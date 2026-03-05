# Plano Detalhado: Fase 4 - Course Module

**Data:** 2026-03-04  
**Status:** Planejamento  
**Duração Estimada:** 6-7 dias  
**Complexidade:** Alta

---

## 📋 Visão Geral

Implementar um sistema LMS (Learning Management System) completo com cursos estruturados, módulos,
aulas, progresso do aluno, quizzes e geração de certificados.

### Objetivos Principais

1. ✅ Criar estrutura hierárquica: Course → CourseModule → Lesson
2. ✅ Implementar sistema de matrícula (Enrollment)
3. ✅ Tracking de progresso por aula (LessonProgress)
4. ✅ Sistema de quiz com correção automática
5. ✅ Geração de certificados ao completar curso
6. ✅ Integração com Access Control Module
7. ✅ Sistema de avaliações (CourseReview)

---

## 🗂️ Estrutura de Entidades

### Hierarquia

```
Course (Curso)
  └── CourseModule (Módulo)
        └── Lesson (Aula)
              └── LessonProgress (Progresso)

Enrollment (Matrícula)
  └── LessonProgress (Progresso por aula)

CourseReview (Avaliação)
```

### Entidades Principais

1. **Course** (6 campos principais + metadata)
   - Informações básicas: title, slug, description, thumbnail
   - Classificação: category, level, requiredTier
   - Controle: isPublished, publishedAt
   - Métricas: enrollmentCount, rating, ratingCount

2. **CourseModule** (agrupamento lógico)
   - Organização: order, duration
   - Relacionamento: courseId

3. **Lesson** (conteúdo)
   - Tipo: video, text, quiz, assignment, file
   - Conteúdo: JSON flexível por tipo
   - Controle: isPreview (permite acesso sem matrícula)

4. **Enrollment** (matrícula)
   - Status: active, completed, dropped
   - Progresso: 0-100%
   - Certificado: certificateUrl

5. **LessonProgress** (progresso detalhado)
   - Status: not_started, in_progress, completed
   - Métricas: watchedDuration, quizScore, quizAttempts

6. **CourseReview** (avaliação)
   - Rating: 1-5
   - Comentário opcional

---

## 📝 Tasks Detalhadas

### Fase 4.1: Fundação (Dia 1-2)

#### Task 4.1.1: Tipos TypeScript

- [ ] Criar `packages/types/src/course.ts`
- [ ] Definir interfaces: Course, CourseModule, Lesson, Enrollment, LessonProgress, CourseReview
- [ ] Definir tipos auxiliares: LessonType, LessonContent, QuizQuestion, EnrollmentStatus,
      ProgressStatus
- [ ] Definir tipos de input: CreateCourseInput, UpdateCourseInput, EnrollInput, etc.
- [ ] Build e validar tipos

**Estimativa:** 1-2 horas

#### Task 4.1.2: Estrutura do Módulo

- [ ] Criar `apps/medusa/src/modules/course/`
- [ ] Criar subpastas: models/, services/, migrations/, subscribers/, scripts/
- [ ] Verificar estrutura

**Estimativa:** 15 minutos

#### Task 4.1.3: Models (Entidades)

- [ ] Criar `models/course.ts`
- [ ] Criar `models/course-module.ts`
- [ ] Criar `models/lesson.ts`
- [ ] Criar `models/enrollment.ts`
- [ ] Criar `models/lesson-progress.ts`
- [ ] Criar `models/course-review.ts`
- [ ] Criar `models/index.ts` (exports)
- [ ] Definir relacionamentos (belongsTo, hasMany)

**Estimativa:** 2-3 horas

#### Task 4.1.4: Migrations

- [ ] Criar migration com 6 tabelas
- [ ] Adicionar constraints (UNIQUE, CHECK, CASCADE)
- [ ] Criar 10 índices otimizados
- [ ] Testar migration up/down

**Estimativa:** 1-2 horas

**Checkpoint Dia 1-2:** Fundação completa, build passando

---

### Fase 4.2: Serviços Core (Dia 2-3)

#### Task 4.2.1: CourseService

- [ ] CRUD básico: create, list, retrieve, update, delete
- [ ] Métodos auxiliares: listPublished, getByCat egory, getBySlug
- [ ] Método publish/unpublish
- [ ] Atualizar enrollmentCount
- [ ] Atualizar rating médio

**Estimativa:** 2-3 horas

#### Task 4.2.2: CourseModuleService

- [ ] CRUD básico
- [ ] Métodos: getModulesByCourse, reorder
- [ ] Calcular duration total

**Estimativa:** 1-2 horas

#### Task 4.2.3: LessonService

- [ ] CRUD básico
- [ ] Métodos: getLessonsByModule, reorder
- [ ] Validar content por tipo
- [ ] Método getPreviewLessons

**Estimativa:** 2-3 horas

#### Task 4.2.4: EnrollmentService

- [ ] Criar enrollment (verificar duplicatas)
- [ ] Listar enrollments (por customer, por course)
- [ ] Calcular progresso
- [ ] Marcar como completed
- [ ] Drop enrollment

**Estimativa:** 2-3 horas

#### Task 4.2.5: LessonProgressService

- [ ] Criar/atualizar progress
- [ ] Marcar como completed
- [ ] Atualizar watchedDuration
- [ ] Registrar quiz attempts/score

**Estimativa:** 1-2 horas

#### Task 4.2.6: CourseReviewService

- [ ] Criar/atualizar review
- [ ] Listar reviews por curso
- [ ] Calcular rating médio
- [ ] Atualizar course.rating

**Estimativa:** 1-2 horas

**Checkpoint Dia 2-3:** Todos os serviços implementados

---

### Fase 4.3: Lógica de Negócio (Dia 3-4)

#### Task 4.3.1: Sistema de Progresso

- [ ] Implementar `calculateProgress(enrollmentId)`
- [ ] Atualizar progresso ao completar aula
- [ ] Detectar conclusão de curso (100%)
- [ ] Disparar evento `course.completed`

**Estimativa:** 2-3 horas

#### Task 4.3.2: Sistema de Quiz

- [ ] Implementar `submitQuiz(lessonId, answers)`
- [ ] Corrigir respostas automaticamente
- [ ] Calcular score (0-100)
- [ ] Aprovar se score >= 70%
- [ ] Registrar tentativas

**Estimativa:** 3-4 horas

#### Task 4.3.3: Geração de Certificados

- [ ] Criar template de certificado (HTML/PDF)
- [ ] Implementar `generateCertificate(enrollmentId)`
- [ ] Gerar PDF com dados do aluno e curso
- [ ] Upload para S3 (ou local)
- [ ] Atualizar enrollment.certificateUrl

**Estimativa:** 3-4 horas

**Nota:** Pode usar biblioteca como `pdfkit` ou `puppeteer` para gerar PDFs

#### Task 4.3.4: Integração com Access Control

- [ ] Verificar acesso antes de matricular
- [ ] Verificar acesso antes de acessar aula
- [ ] Usar `course.featureId` ou `course.requiredTier`
- [ ] Retornar erro 403 se acesso negado

**Estimativa:** 1-2 horas

**Checkpoint Dia 3-4:** Lógica de negócio completa

---

### Fase 4.4: APIs Admin (Dia 4-5)

#### Task 4.4.1: Course Admin APIs

- [ ] `POST /admin/courses` - Criar curso
- [ ] `GET /admin/courses` - Listar cursos
- [ ] `GET /admin/courses/:id` - Detalhes do curso
- [ ] `PATCH /admin/courses/:id` - Atualizar curso
- [ ] `DELETE /admin/courses/:id` - Deletar curso
- [ ] `POST /admin/courses/:id/publish` - Publicar curso

**Estimativa:** 2-3 horas

#### Task 4.4.2: Module Admin APIs

- [ ] `POST /admin/courses/:courseId/modules` - Criar módulo
- [ ] `GET /admin/courses/:courseId/modules` - Listar módulos
- [ ] `PATCH /admin/courses/:courseId/modules/:moduleId` - Atualizar
- [ ] `DELETE /admin/courses/:courseId/modules/:moduleId` - Deletar

**Estimativa:** 1-2 horas

#### Task 4.4.3: Lesson Admin APIs

- [ ] `POST /admin/courses/:courseId/modules/:moduleId/lessons` - Criar aula
- [ ] `GET /admin/courses/:courseId/modules/:moduleId/lessons` - Listar aulas
- [ ] `PATCH /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId` - Atualizar
- [ ] `DELETE /admin/courses/:courseId/modules/:moduleId/lessons/:lessonId` - Deletar

**Estimativa:** 1-2 horas

#### Task 4.4.4: Enrollment Admin APIs

- [ ] `GET /admin/enrollments` - Listar todas as matrículas
- [ ] `GET /admin/enrollments/:id` - Detalhes da matrícula
- [ ] `GET /admin/courses/:courseId/enrollments` - Matrículas do curso

**Estimativa:** 1 hora

**Checkpoint Dia 4-5:** Admin APIs completas

---

### Fase 4.5: APIs Store (Dia 5-6)

#### Task 4.5.1: Course Store APIs

- [ ] `GET /store/courses` - Listar cursos publicados
- [ ] `GET /store/courses/:id` - Detalhes do curso
- [ ] `POST /store/courses/:id/enroll` - Matricular (com verificação de acesso)
- [ ] `GET /store/courses/:id/modules` - Listar módulos
- [ ] `GET /store/courses/:id/modules/:moduleId/lessons` - Listar aulas

**Estimativa:** 2-3 horas

#### Task 4.5.2: Lesson Store APIs

- [ ] `GET /store/courses/:id/modules/:moduleId/lessons/:lessonId` - Conteúdo da aula
- [ ] Verificar matrícula ou isPreview
- [ ] Retornar conteúdo apropriado por tipo

**Estimativa:** 1-2 horas

#### Task 4.5.3: Enrollment Store APIs

- [ ] `GET /store/my-enrollments` - Minhas matrículas
- [ ] `GET /store/my-enrollments/:id` - Detalhes da matrícula
- [ ] `GET /store/my-enrollments/:id/progress` - Progresso detalhado
- [ ] `POST /store/my-enrollments/:id/lessons/:lessonId/complete` - Marcar como concluída
- [ ] `POST /store/my-enrollments/:id/lessons/:lessonId/quiz` - Submeter quiz

**Estimativa:** 2-3 horas

#### Task 4.5.4: Review Store APIs

- [ ] `POST /store/courses/:id/review` - Avaliar curso
- [ ] `GET /store/courses/:id/reviews` - Listar avaliações

**Estimativa:** 1 hora

**Checkpoint Dia 5-6:** Store APIs completas

---

### Fase 4.6: Eventos e Finalização (Dia 6-7)

#### Task 4.6.1: Subscribers

- [ ] `enrollment.created` - Log de matrícula
- [ ] `lesson.completed` - Atualizar progresso
- [ ] `course.completed` - Gerar certificado
- [ ] `course.reviewed` - Atualizar rating médio
- [ ] `quiz.submitted` - Log de quiz

**Estimativa:** 2-3 horas

#### Task 4.6.2: Seed Script

- [ ] Criar 3-5 cursos de exemplo
- [ ] Criar módulos e aulas para cada curso
- [ ] Distribuir por tiers (free, pro, premium)
- [ ] Incluir diferentes tipos de aulas (video, text, quiz)

**Estimativa:** 2-3 horas

#### Task 4.6.3: Testes e Validação

- [ ] Build completo do monorepo
- [ ] Verificar ESLint
- [ ] Testar APIs manualmente (opcional)
- [ ] Verificar integração com Access Control

**Estimativa:** 1-2 horas

#### Task 4.6.4: Documentação

- [ ] Criar ADR 005
- [ ] Atualizar CHANGELOG
- [ ] Commit final

**Estimativa:** 1-2 horas

**Checkpoint Dia 6-7:** Fase 4 completa!

---

## 🔗 Integrações

### Com Access Control Module

```typescript
// Antes de matricular
const hasAccess = await accessControlService.hasAccess(
  customerId,
  course.featureId || `feat_${course.requiredTier}_courses`,
);

if (!hasAccess) {
  throw new ForbiddenError('Upgrade to access this course');
}
```

### Com Digital Delivery Module (Futuro)

```typescript
// Para aulas com arquivos
if (lesson.type === 'file') {
  const signedUrl = await digitalDeliveryService.generateSignedUrl(lesson.content.fileUrl);
}
```

---

## ⚠️ Desafios e Considerações

### Complexidade Alta

1. **Hierarquia de 3 níveis**: Course → Module → Lesson
2. **Múltiplos tipos de conteúdo**: video, text, quiz, file, assignment
3. **Sistema de progresso**: cálculo dinâmico baseado em múltiplas aulas
4. **Geração de certificados**: requer biblioteca externa (PDF)

### Decisões Técnicas

1. **Conteúdo da aula**: JSON flexível vs tabelas separadas por tipo
   - **Decisão**: JSON flexível (mais simples, menos tabelas)

2. **Progresso**: calculado on-demand vs cached
   - **Decisão**: Cached em `enrollment.progress` (performance)

3. **Certificados**: gerar sob demanda vs pré-gerar
   - **Decisão**: Gerar ao completar e cachear URL

4. **Quiz**: correção client-side vs server-side
   - **Decisão**: Server-side (segurança)

---

## 📊 Métricas de Sucesso

- [ ] 6 entidades criadas
- [ ] 6 serviços implementados
- [ ] 20+ endpoints REST (admin + store)
- [ ] Sistema de progresso funcionando
- [ ] Sistema de quiz funcionando
- [ ] Geração de certificados funcionando
- [ ] Integração com Access Control funcionando
- [ ] 5 subscribers implementados
- [ ] Seed script com cursos de exemplo
- [ ] Build passando sem erros
- [ ] ESLint passando sem erros
- [ ] ADR e CHANGELOG atualizados

---

## 🚀 Próximos Passos Após Fase 4

1. **Fase 5: Mercado Pago Integration**
   - Processar pagamentos de cursos avulsos
   - Processar pagamentos de assinaturas

2. **Fase 4b: Digital Delivery Module** (paralelo)
   - Upload de arquivos para aulas
   - Download seguro com URLs assinadas

3. **Melhorias Futuras**
   - Fórum de discussão
   - Assignments com correção manual
   - Certificados personalizados por curso
   - Analytics de engajamento

---

## 📚 Referências

- [Especificação do Course Module](../specs/course-module.md)
- [ADR 004: Access Control Module](../adr/0004-fase3-access-control-module.md)
- [Medusa v2 Documentation](https://docs.medusajs.com/v2)
- [PDFKit Documentation](http://pdfkit.org/) (para certificados)

---

## ✅ Checklist de Início

Antes de começar a implementação:

- [x] Especificação lida e compreendida
- [x] Plano detalhado criado
- [ ] Decisões técnicas aprovadas
- [ ] Dependências identificadas (Fase 3 completa ✅)
- [ ] Estimativas revisadas
- [ ] Pronto para começar!

---

**Nota:** Este é um plano ambicioso. A Fase 4 é a mais complexa até agora devido à hierarquia de
entidades e lógica de negócio. Esteja preparado para ajustar estimativas conforme necessário.
