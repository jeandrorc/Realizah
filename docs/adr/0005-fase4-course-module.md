# ADR 005: Fase 4 - Course Module (LMS Platform)

**Status:** Accepted  
**Date:** 2026-03-04  
**Deciders:** Equipe de Desenvolvimento  
**Technical Story:** Implementação do módulo de cursos (LMS) com progresso, quizzes e certificados

## Context

A plataforma Realizah precisa de um sistema completo de LMS (Learning Management System) para
oferecer cursos aos usuários. O sistema deve suportar:

- Cursos com múltiplos módulos e aulas
- Diferentes tipos de conteúdo (vídeo, texto, quiz, assignment, arquivo)
- Sistema de progresso automático
- Quizzes com correção automática
- Geração de certificados
- Integração com Access Control Module (tiers)
- Avaliações de cursos
- APIs para admin e store

## Decision

### 1. Arquitetura de Entidades

Implementamos 6 entidades principais:

#### Course

- Representa um curso completo
- Campos: title, slug, description, thumbnail, instructorId, category, level, duration, language,
  requiredTier, featureId, isPublished, publishedAt, enrollmentCount, rating, ratingCount
- Níveis: beginner, intermediate, advanced
- Integração com Access Control via `requiredTier` e `featureId`

#### CourseModule

- Agrupa aulas em módulos organizacionais
- Campos: courseId, title, description, order, duration, isPublished
- Permite estruturação hierárquica do conteúdo

#### Lesson

- Representa uma aula individual
- Tipos: video, text, quiz, assignment, file
- Campos: moduleId, title, description, type, content (JSON), order, duration, isPreview,
  isPublished
- Content structure varia por tipo:
  - Video: videoUrl, videoProvider (youtube, vimeo, s3)
  - Text: text (markdown/HTML)
  - Quiz: questions array
  - File: fileUrl, fileName, fileSize

#### Enrollment

- Matrícula do customer em um curso
- Campos: customerId, courseId, status, enrolledAt, completedAt, progress, lastAccessedAt,
  certificateUrl
- Status: active, completed, dropped
- Unique constraint: (customerId, courseId)

#### LessonProgress

- Progresso individual por aula
- Campos: enrollmentId, lessonId, status, watchedDuration, quizScore, quizAttempts, completedAt
- Status: not_started, in_progress, completed
- Unique constraint: (enrollmentId, lessonId)

#### CourseReview

- Avaliações de cursos
- Campos: courseId, customerId, rating (1-5), comment, isPublished
- Unique constraint: (courseId, customerId)

### 2. Services

#### Core Services

- **CourseService**: CRUD de cursos, publicação, rating
- **CourseModuleService**: gestão de módulos, reordenação
- **LessonService**: gestão de aulas, validação de conteúdo
- **EnrollmentService**: matrículas, verificação de acesso
- **LessonProgressService**: tracking de progresso por aula
- **CourseReviewService**: avaliações e ratings

#### Business Logic Services

- **ProgressManagerService**: cálculo automático de progresso, estatísticas, auto-completion
- **QuizManagerService**: submissão de quizzes, correção automática, feedback
- **CertificateManagerService**: geração e verificação de certificados

### 3. Sistema de Progresso

Implementamos um sistema de progresso automático:

1. **Tracking por Aula**: cada aula tem seu próprio LessonProgress
2. **Cálculo Automático**: ProgressManagerService calcula % de conclusão baseado em aulas
   completadas
3. **Auto-Completion**: quando progresso atinge 100%, enrollment é marcado como "completed"
4. **Estatísticas**: total de aulas, completadas, em progresso, tempo assistido

### 4. Sistema de Quiz

Quiz com correção automática:

1. **Estrutura de Questões**:
   - multiple_choice: opções múltiplas
   - true_false: verdadeiro/falso
   - short_answer: resposta curta

2. **Correção Automática**:
   - Compara resposta do aluno com resposta correta
   - Suporta múltiplas respostas corretas
   - Score em percentual (0-100)

3. **Aprovação**:
   - Nota mínima: 70%
   - Tentativas ilimitadas
   - Melhor score é mantido

4. **Feedback**:
   - Por questão: correct/incorrect
   - Explicação opcional
   - Score total e status de aprovação

### 5. Sistema de Certificados

Geração de certificados para cursos completados:

1. **Geração**:
   - Automática ao completar 100% do curso
   - URL única por enrollment
   - Metadata: curso, customer, data de conclusão

2. **Verificação**:
   - Verificação por URL
   - Metadata completa do certificado

3. **Listagem**:
   - Customer pode listar todos seus certificados

**Nota**: Implementação atual gera apenas URL placeholder. Integração futura com serviço de PDF
(Canvas API, PDFKit, etc.)

### 6. APIs

#### Admin APIs (12+ endpoints)

- `GET /admin/courses` - listar cursos
- `POST /admin/courses` - criar curso
- `GET /admin/courses/:id` - detalhes do curso
- `PATCH /admin/courses/:id` - atualizar curso
- `DELETE /admin/courses/:id` - deletar curso
- `POST /admin/courses/:id/publish` - publicar curso
- `GET /admin/courses/modules` - listar módulos
- `POST /admin/courses/modules` - criar módulo
- `GET /admin/courses/modules/:id` - detalhes do módulo
- `PATCH /admin/courses/modules/:id` - atualizar módulo
- `DELETE /admin/courses/modules/:id` - deletar módulo
- `GET /admin/courses/modules/lessons` - listar aulas
- `POST /admin/courses/modules/lessons` - criar aula
- `GET /admin/courses/modules/lessons/:id` - detalhes da aula
- `PATCH /admin/courses/modules/lessons/:id` - atualizar aula
- `DELETE /admin/courses/modules/lessons/:id` - deletar aula
- `GET /admin/courses/enrollments` - listar matrículas
- `GET /admin/courses/enrollments/:id` - detalhes da matrícula
- `GET /admin/courses/reviews` - listar avaliações
- `DELETE /admin/courses/reviews/:id` - deletar avaliação

#### Store APIs (11+ endpoints)

- `GET /store/courses` - listar cursos publicados
- `GET /store/courses/:id` - detalhes do curso
- `GET /store/courses/:id/modules` - módulos e aulas do curso
- `POST /store/courses/:id/enroll` - matricular-se no curso
- `GET /store/my-courses` - meus cursos
- `GET /store/my-courses/:id` - detalhes da matrícula
- `GET /store/my-courses/:id/lessons/:lessonId` - detalhes da aula
- `POST /store/my-courses/:id/lessons/:lessonId/complete` - completar aula
- `POST /store/my-courses/:id/lessons/:lessonId/quiz` - submeter quiz
- `GET /store/my-courses/:id/certificate` - obter certificado
- `POST /store/my-courses/:id/certificate` - gerar certificado
- `POST /store/reviews` - criar avaliação

### 7. Integração com Access Control

Implementamos verificação de acesso em dois níveis:

1. **Tier-based Access**:
   - Cada curso tem `requiredTier` (free, pro, premium)
   - Middleware `verifyCourseAccess` valida tier do customer
   - Bloqueia matrícula se tier insuficiente

2. **Feature-based Access**:
   - Cursos podem ter `featureId` opcional
   - Permite acesso granular além de tiers
   - Exemplo: curso especial para beta testers

3. **Helper Function**:
   - `canEnrollInCourse()`: verifica elegibilidade completa
   - Retorna: allowed + reason

### 8. Event-Driven Architecture

Implementamos 5 subscribers:

1. **enrollment.created**: welcome email, notificar instrutor, analytics
2. **enrollment.completed**: gerar certificado, email de parabéns, recomendar próximo curso
3. **lesson.completed**: atualizar progresso, unlock próxima aula, notificação
4. **quiz.passed**: award badge, notificação de parabéns
5. **review.created**: atualizar rating do curso, notificar instrutor, moderação

### 9. Migrations

Criamos 6 tabelas com indexes otimizados:

- `course`: 5 indexes (slug, category, tier, published, instructor)
- `course_module`: 2 indexes (courseId, order)
- `lesson`: 3 indexes (moduleId, order, preview)
- `enrollment`: 3 indexes (customerId, courseId, status)
- `lesson_progress`: 3 indexes (enrollmentId, lessonId, status)
- `course_review`: 2 indexes (courseId, customerId)

Constraints:

- Foreign keys com ON DELETE CASCADE
- Unique constraints para evitar duplicatas
- Check constraint em rating (1-5)

### 10. Shared Types

Adicionamos tipos completos em `@realizah/types`:

- Interfaces: Course, CourseModule, Lesson, Enrollment, LessonProgress, CourseReview
- Input types: Create/Update para cada entidade
- Enums: CourseLevel, LessonType, EnrollmentStatus, ProgressStatus, QuizQuestionType, VideoProvider
- Quiz types: QuizQuestion, SubmitQuizInput, SubmitQuizResult
- Content types: LessonContent

### 11. Seed Data

Criamos 5 cursos padrão para onboarding:

1. **Introdução ao Realizah** (free, beginner, 60min)
2. **Gestão de Projetos Ágeis** (pro, intermediate, 180min)
3. **Desenvolvimento Full Stack Avançado** (premium, advanced, 480min)
4. **Marketing Digital para Iniciantes** (free, beginner, 120min)
5. **Análise de Dados com Python** (pro, intermediate, 300min)

## Consequences

### Positive

1. **Sistema Completo de LMS**: plataforma pronta para oferecer cursos
2. **Progresso Automático**: tracking sem intervenção manual
3. **Quiz Inteligente**: correção automática com feedback
4. **Certificados**: reconhecimento de conclusão
5. **Integração com Access Control**: monetização via tiers
6. **Event-Driven**: extensível para notificações, analytics, etc.
7. **APIs Completas**: admin e store cobrem todos os casos de uso
8. **Estrutura Flexível**: suporta múltiplos tipos de conteúdo
9. **Performance**: indexes otimizados para queries frequentes
10. **Type Safety**: tipos compartilhados entre backend e frontend

### Negative

1. **Certificados Placeholder**: geração real de PDF pendente
2. **Módulo Não Registrado**: Medusa v2 RC requer módulos built
3. **Sem Vídeo Hosting**: integração com S3/Vimeo/YouTube pendente
4. **Sem Notificações**: subscribers têm TODOs para email/push
5. **Sem Gamificação**: badges/achievements pendentes
6. **Sem Recomendações**: sistema de próximo curso pendente

### Risks

1. **Medusa v2 RC**: limitações podem impactar módulo custom
2. **Performance**: cálculo de progresso pode ser lento com muitas aulas
3. **Storage**: vídeos e arquivos requerem infraestrutura dedicada
4. **Certificados**: geração de PDF pode ser complexa
5. **Fraude em Quiz**: tentativas ilimitadas podem ser exploradas

## Metrics of Success

1. **Funcionalidade**: 100% dos endpoints implementados
2. **Tipos**: 100% type-safe com @realizah/types
3. **Progresso**: cálculo automático funcionando
4. **Quiz**: correção automática com 70% de aprovação
5. **Certificados**: geração de URL funcionando
6. **Access Control**: verificação de tier funcionando
7. **Events**: 5 subscribers implementados
8. **Migrations**: 6 tabelas criadas com sucesso
9. **APIs**: 23+ endpoints REST funcionais
10. **Code Quality**: 0 erros de ESLint/Prettier

## References

- [Especificação do Course Module](../specs/course-module.md)
- [Plano Detalhado da Fase 4](../plans/2026-03-04-fase4-course-module.md)
- [ADR 003: Subscription Module](./0003-fase2-subscription-module.md)
- [ADR 004: Access Control Module](./0004-fase3-access-control-module.md)
- [MedusaJS v2 Documentation](https://docs.medusajs.com/v2)
- [MikroORM Migrations](https://mikro-orm.io/docs/migrations)

## Notes

- Implementação completa em ~2-3 dias
- 49 arquivos criados (2329+ linhas)
- Pronto para integração com frontend Next.js
- Requer infraestrutura para vídeos e certificados PDF
- Subscribers prontos para integração com email/push
