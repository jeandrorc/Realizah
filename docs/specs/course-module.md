# Course Module — Especificação Técnica

Módulo responsável pela gestão de cursos, módulos, aulas e progresso do aluno na plataforma LMS.

## Visão Geral

O Course Module implementa uma plataforma LMS (Learning Management System) completa com cursos estruturados, controle de progresso e integração com o sistema de assinaturas.

## Entidades

### Course

Representa um curso completo.

```typescript
interface Course {
  id: string;
  title: string;
  slug: string;                  // URL-friendly (ex: introducao-typescript)
  description: string;
  thumbnail?: string;            // URL da imagem
  instructorId: string;          // ID do instrutor
  category: string;              // Categoria (ex: "programming", "design")
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;              // Duração estimada em minutos
  language: string;              // Idioma (ex: "pt-BR")
  requiredTier: Tier;            // Tier mínimo necessário
  featureId?: string;            // ID da feature no Access Control Module
  isPublished: boolean;
  publishedAt?: Date;
  enrollmentCount: number;       // Contador de matrículas
  rating?: number;               // Avaliação média (0-5)
  ratingCount: number;           // Número de avaliações
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### CourseModule

Representa um módulo dentro de um curso (agrupamento de aulas).

```typescript
interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;                 // Ordem no curso (1, 2, 3...)
  duration: number;              // Duração total em minutos
  isPublished: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Lesson

Representa uma aula dentro de um módulo.

```typescript
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  content: LessonContent;
  order: number;                 // Ordem no módulo
  duration: number;              // Duração em minutos
  isPreview: boolean;            // Se pode ser visualizada sem matrícula
  isPublished: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'file';

interface LessonContent {
  // Para vídeo
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 's3';
  
  // Para texto
  text?: string;                 // Markdown ou HTML
  
  // Para quiz
  questions?: QuizQuestion[];
  
  // Para arquivo
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];            // Para multiple choice
  correctAnswer: string | string[];
  explanation?: string;
}
```

### Enrollment

Representa a matrícula de um aluno em um curso.

```typescript
interface Enrollment {
  id: string;
  customerId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;              // Porcentagem (0-100)
  lastAccessedAt?: Date;
  certificateUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type EnrollmentStatus = 
  | 'active'        // Ativo
  | 'completed'     // Concluído
  | 'dropped';      // Abandonado
```

### LessonProgress

Representa o progresso de um aluno em uma aula específica.

```typescript
interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  status: ProgressStatus;
  watchedDuration?: number;      // Para vídeos (em segundos)
  quizScore?: number;            // Para quizzes (0-100)
  quizAttempts: number;
  completedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type ProgressStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed';
```

### CourseReview

Representa uma avaliação de curso.

```typescript
interface CourseReview {
  id: string;
  courseId: string;
  customerId: string;
  rating: number;                // 1-5
  comment?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Casos de Uso

### 1. Criar Curso

**Ator**: Admin/Instrutor

**Fluxo**:
1. Admin preenche dados do curso
2. Sistema valida dados
3. Sistema cria curso com status `isPublished: false`
4. Sistema retorna curso criado

**Validações**:
- Título é obrigatório
- Slug deve ser único
- Tier deve ser válido

### 2. Matricular em Curso

**Ator**: Cliente

**Fluxo**:
1. Cliente seleciona curso
2. Sistema verifica se cliente tem acesso (via Access Control Module)
3. Sistema verifica se cliente já está matriculado
4. Sistema cria `Enrollment` com status `active`
5. Sistema incrementa `enrollmentCount` do curso
6. Sistema dispara evento `enrollment.created`

**Validações**:
- Cliente deve ter tier suficiente
- Cliente não pode estar matriculado duas vezes no mesmo curso
- Curso deve estar publicado

### 3. Assistir Aula

**Ator**: Cliente

**Fluxo**:
1. Cliente acessa aula
2. Sistema verifica matrícula
3. Sistema busca conteúdo da aula
4. Sistema cria/atualiza `LessonProgress`
5. Sistema atualiza `lastAccessedAt` do enrollment
6. Sistema retorna conteúdo

**Validações**:
- Cliente deve estar matriculado
- Aula deve estar publicada (ou ser preview)

### 4. Marcar Aula como Concluída

**Ator**: Cliente

**Fluxo**:
1. Cliente marca aula como concluída
2. Sistema atualiza `LessonProgress` para `completed`
3. Sistema recalcula progresso do enrollment
4. Sistema verifica se curso foi concluído (100%)
5. Se concluído: gera certificado e atualiza status
6. Sistema dispara evento `lesson.completed` ou `course.completed`

**Cálculo de Progresso**:
```typescript
function calculateProgress(enrollmentId: string): number {
  const lessons = await getAllLessonsForEnrollment(enrollmentId);
  const completed = lessons.filter(l => l.status === 'completed').length;
  return (completed / lessons.length) * 100;
}
```

### 5. Fazer Quiz

**Ator**: Cliente

**Fluxo**:
1. Cliente acessa quiz
2. Sistema apresenta questões
3. Cliente submete respostas
4. Sistema corrige e calcula score
5. Sistema atualiza `LessonProgress` com score
6. Sistema marca como concluído se score >= 70%
7. Sistema retorna resultado e feedback

**Regras**:
- Mínimo 70% para passar
- Tentativas ilimitadas (registradas)

### 6. Avaliar Curso

**Ator**: Cliente

**Fluxo**:
1. Cliente submete avaliação (rating + comentário)
2. Sistema verifica se cliente está matriculado
3. Sistema cria/atualiza `CourseReview`
4. Sistema recalcula rating médio do curso
5. Sistema dispara evento `course.reviewed`

**Validações**:
- Cliente deve estar matriculado
- Rating deve ser 1-5
- Um cliente pode avaliar apenas uma vez

## APIs

### Admin APIs

```
POST   /admin/courses
GET    /admin/courses
GET    /admin/courses/:id
PATCH  /admin/courses/:id
DELETE /admin/courses/:id
POST   /admin/courses/:id/publish

POST   /admin/courses/:courseId/modules
GET    /admin/courses/:courseId/modules
PATCH  /admin/courses/:courseId/modules/:moduleId
DELETE /admin/courses/:courseId/modules/:moduleId

POST   /admin/courses/:courseId/modules/:moduleId/lessons
GET    /admin/courses/:courseId/modules/:moduleId/lessons
PATCH  /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId
DELETE /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId

GET    /admin/enrollments
GET    /admin/enrollments/:id
GET    /admin/courses/:courseId/enrollments
```

### Store APIs

```
GET    /store/courses
GET    /store/courses/:id
POST   /store/courses/:id/enroll
GET    /store/courses/:id/modules
GET    /store/courses/:id/modules/:moduleId/lessons
GET    /store/courses/:id/modules/:moduleId/lessons/:lessonId

GET    /store/my-enrollments
GET    /store/my-enrollments/:id
GET    /store/my-enrollments/:id/progress
POST   /store/my-enrollments/:id/lessons/:lessonId/complete
POST   /store/my-enrollments/:id/lessons/:lessonId/quiz

POST   /store/courses/:id/review
GET    /store/courses/:id/reviews
```

## Eventos

| Evento | Quando | Payload |
|--------|--------|---------|
| `enrollment.created` | Aluno se matricula | `{ enrollment, course }` |
| `lesson.completed` | Aula concluída | `{ enrollment, lesson }` |
| `course.completed` | Curso concluído | `{ enrollment, course }` |
| `course.reviewed` | Curso avaliado | `{ review, course }` |
| `quiz.submitted` | Quiz submetido | `{ enrollment, lesson, score }` |

## Integrações

### Access Control Module

Antes de matricular ou acessar conteúdo:

```typescript
async function enrollInCourse(customerId: string, courseId: string) {
  const course = await getCourse(courseId);
  
  // Verificar acesso via Access Control Module
  const hasAccess = await accessControlService.hasAccess(
    customerId,
    course.featureId
  );
  
  if (!hasAccess) {
    throw new ForbiddenError('Upgrade to access this course');
  }
  
  // Criar enrollment
  return await createEnrollment(customerId, courseId);
}
```

### Digital Delivery Module

Para aulas com arquivos para download:

```typescript
async function getLessonContent(lessonId: string) {
  const lesson = await getLesson(lessonId);
  
  if (lesson.type === 'file') {
    // Gerar URL assinada via Digital Delivery Module
    const signedUrl = await digitalDeliveryService.generateSignedUrl(
      lesson.content.fileUrl
    );
    return { ...lesson, content: { ...lesson.content, fileUrl: signedUrl } };
  }
  
  return lesson;
}
```

## Migrations

```sql
-- Criar tabelas
CREATE TABLE course (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT NOT NULL,
  thumbnail VARCHAR,
  instructor_id VARCHAR NOT NULL,
  category VARCHAR(50) NOT NULL,
  level VARCHAR(20) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  language VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
  required_tier VARCHAR(20) NOT NULL,
  feature_id VARCHAR,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP,
  enrollment_count INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2),
  rating_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE course_module (
  id VARCHAR PRIMARY KEY,
  course_id VARCHAR NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson (
  id VARCHAR PRIMARY KEY,
  module_id VARCHAR NOT NULL REFERENCES course_module(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  content JSONB NOT NULL,
  "order" INTEGER NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollment (
  id VARCHAR PRIMARY KEY,
  customer_id VARCHAR NOT NULL,
  course_id VARCHAR NOT NULL REFERENCES course(id),
  status VARCHAR(20) NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  progress INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMP,
  certificate_url VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, course_id)
);

CREATE TABLE lesson_progress (
  id VARCHAR PRIMARY KEY,
  enrollment_id VARCHAR NOT NULL REFERENCES enrollment(id) ON DELETE CASCADE,
  lesson_id VARCHAR NOT NULL REFERENCES lesson(id),
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  watched_duration INTEGER,
  quiz_score INTEGER,
  quiz_attempts INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

CREATE TABLE course_review (
  id VARCHAR PRIMARY KEY,
  course_id VARCHAR NOT NULL REFERENCES course(id),
  customer_id VARCHAR NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, customer_id)
);

-- Índices
CREATE INDEX idx_course_slug ON course(slug);
CREATE INDEX idx_course_category ON course(category);
CREATE INDEX idx_course_tier ON course(required_tier);
CREATE INDEX idx_course_published ON course(is_published);
CREATE INDEX idx_module_course ON course_module(course_id);
CREATE INDEX idx_lesson_module ON lesson(module_id);
CREATE INDEX idx_enrollment_customer ON enrollment(customer_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);
CREATE INDEX idx_enrollment_status ON enrollment(status);
CREATE INDEX idx_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_review_course ON course_review(course_id);
```

## Certificados

Quando um curso é concluído, gerar certificado:

```typescript
async function generateCertificate(enrollmentId: string) {
  const enrollment = await getEnrollment(enrollmentId);
  const course = await getCourse(enrollment.courseId);
  const customer = await getCustomer(enrollment.customerId);
  
  // Gerar PDF com template
  const certificateUrl = await generateCertificatePDF({
    studentName: customer.name,
    courseName: course.title,
    completedAt: enrollment.completedAt,
    certificateId: enrollment.id,
  });
  
  // Atualizar enrollment
  await updateEnrollment(enrollmentId, { certificateUrl });
  
  return certificateUrl;
}
```

## Testes

### Casos de Teste

1. **Criar curso**: deve criar curso com dados válidos
2. **Matricular**: deve criar enrollment se tier suficiente
3. **Matricular**: deve rejeitar se tier insuficiente
4. **Assistir aula**: deve permitir se matriculado
5. **Completar aula**: deve atualizar progresso
6. **Completar curso**: deve gerar certificado
7. **Quiz**: deve calcular score corretamente
8. **Avaliar**: deve atualizar rating médio do curso

## Próximos Passos

- [ ] Implementar entidades e migrations
- [ ] Implementar CourseService
- [ ] Implementar APIs admin e store
- [ ] Integrar com Access Control Module
- [ ] Implementar geração de certificados
- [ ] Implementar sistema de quiz
- [ ] Escrever testes
- [ ] Documentar APIs
