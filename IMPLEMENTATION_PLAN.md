# Plan de Implementación - DevHub Training App

## Estado Actual

### ✅ Completado
- [x] Rails 7.2.3 setup básico
- [x] PostgreSQL configurado
- [x] Redis configurado
- [x] Authlogic configurado (User, UserSession)
- [x] GraphQL API básica (solo autenticación)
- [x] React + Apollo Client básico (solo autenticación)
- [x] Sidekiq configurado (SampleJob como demo)
- [x] Docker setup para desarrollo
- [x] rails_code_auditor instalado

### ⏳ Pendiente (Según PRD)
- [ ] Projects CRUD
- [ ] Tasks CRUD (con polymorphic assignee)
- [ ] ActiveRecord Scopes
- [ ] Service Objects (TaskStatusUpdater)
- [ ] Rails Engines (Core + Admin)
- [ ] GraphQL API completa (Projects/Tasks)
- [ ] ActivityLoggerJob (background jobs)
- [ ] Testing (RSpec/Minitest)
- [ ] React Client completo (Projects/Tasks UI)
- [ ] Redux Toolkit integration

---

## SEMANA 1: Core Rails Features

### Fase 1.1: Models y Migrations (Días 1-2)

#### Objetivo: Crear la estructura de datos base

**Tareas:**
1. **Crear modelo Project**
   - Migración: `create_projects`
   - Modelo: `app/models/project.rb`
   - Campos: `id`, `name`, `description`, `user_id` (owner), `timestamps`
   - Validaciones: `name` required, `user_id` required
   - Relaciones: `belongs_to :user`, `has_many :tasks`

2. **Crear modelo Task**
   - Migración: `create_tasks`
   - Modelo: `app/models/task.rb`
   - Campos: `id`, `title`, `description`, `status` (enum), `project_id`, `assignee_type` (polymorphic), `assignee_id` (polymorphic), `timestamps`
   - Validaciones: `title` required, `status` enum validation
   - Relaciones: `belongs_to :project`, `belongs_to :assignee, polymorphic: true`
   - Enum: `status: { pending: 0, in_progress: 1, completed: 2 }`

3. **Crear modelo Activity**
   - Migración: `create_activities`
   - Modelo: `app/models/activity.rb`
   - Campos: `id`, `record_type`, `record_id`, `action` (string), `user_id`, `metadata` (jsonb), `created_at`
   - Relaciones: `belongs_to :record, polymorphic: true`, `belongs_to :user`
   - Scope: `by_record(record)` para filtrar por registro polimórfico

4. **Actualizar modelo User**
   - Agregar: `has_many :projects, foreign_key: :user_id`
   - Agregar: `has_many :assigned_tasks, as: :assignee, class_name: 'Task'`
   - Agregar: `has_many :activities`

**Deliverables:**
- 3 migraciones ejecutadas
- 3 modelos creados con validaciones
- Schema actualizado

---

### Fase 1.2: ActiveRecord Scopes (Día 3)

#### Objetivo: Implementar scopes reutilizables según PRD

**Tareas:**

1. **Scopes para Task**
   - `.completed` - tareas con status completed
   - `.recent` - tareas ordenadas por created_at DESC
   - `.assigned_to(assignee)` - tareas asignadas a un usuario específico (polymorphic)
   - `.for_project(project)` - tareas de un proyecto específico
   - `.pending` - tareas pendientes
   - `.in_progress` - tareas en progreso

2. **Scopes para Project**
   - `.by_user(user)` - proyectos de un usuario
   - `.recent` - proyectos ordenados por created_at DESC
   - `.with_tasks` - proyectos que tienen tareas

3. **Scopes para Activity**
   - `.by_record(record)` - actividades de un registro específico
   - `.by_user(user)` - actividades de un usuario
   - `.recent` - actividades recientes
   - `.by_action(action)` - filtrar por acción

**Deliverables:**
- Scopes implementados en todos los modelos
- Tests unitarios para scopes (opcional en Semana 1, pero recomendado)

---

### Fase 1.3: Service Objects (Día 4)

#### Objetivo: Extraer lógica de negocio de modelos/controllers

**Tareas:**

1. **Crear estructura de Services**
   - Directorio: `app/services/`
   - Base class: `app/services/application_service.rb`
   - Patrón: `ServiceClass.call(params)` retornando `OpenStruct.new(success?: bool, data: object, errors: array)`

2. **TaskStatusUpdater Service**
   - Archivo: `app/services/task_status_updater.rb`
   - Método: `TaskStatusUpdater.call(task:, new_status:, user:)`
   - Lógica:
     - Validar transición de estado válida
     - Actualizar status del task
     - Encolar `ActivityLoggerJob` para registrar cambio
     - Retornar resultado (success/errors)

3. **ProjectCreator Service** (opcional, buena práctica)
   - Archivo: `app/services/project_creator.rb`
   - Método: `ProjectCreator.call(user:, name:, description:)`
   - Lógica: Crear proyecto con validaciones

4. **TaskCreator Service** (opcional, buena práctica)
   - Archivo: `app/services/task_creator.rb`
   - Método: `TaskCreator.call(project:, title:, description:, assignee: nil)`
   - Lógica: Crear tarea con validaciones

**Deliverables:**
- Estructura de services creada
- `TaskStatusUpdater` implementado y funcionando
- Services opcionales si hay tiempo

---

### Fase 1.4: Rails Engines (Días 5-7)

#### Objetivo: Modularizar la aplicación en Engines

**Tareas:**

1. **Crear Core Engine**
   - Generar: `rails plugin new core --mountable --skip-test`
   - Estructura:
     ```
     engines/core/
     ├── app/
     │   ├── models/core/
     │   │   ├── project.rb
     │   │   ├── task.rb
     │   │   └── activity.rb
     │   ├── services/core/
     │   │   └── task_status_updater.rb
     │   └── controllers/core/
     │       └── application_controller.rb
     ├── lib/core/
     │   └── engine.rb
     └── config/
         └── routes.rb
     ```
   - Mover modelos Project, Task, Activity a `core`
   - Mover TaskStatusUpdater a `core`
   - Namespace: `Core::Project`, `Core::Task`, etc.
   - Montar en `config/routes.rb`: `mount Core::Engine => '/api'`

2. **Crear Admin Engine**
   - Generar: `rails plugin new admin --mountable --skip-test`
   - Estructura:
     ```
     engines/admin/
     ├── app/
     │   ├── controllers/admin/
     │   │   ├── dashboard_controller.rb
     │   │   └── reports_controller.rb
     │   └── views/admin/
     │       ├── dashboard/
     │       │   └── index.html.erb
     │       └── reports/
     │           └── index.html.erb
     ├── lib/admin/
     │   └── engine.rb
     └── config/
         └── routes.rb
     ```
   - Routes: `mount Admin::Engine => '/admin'`
   - Controllers: `Admin::DashboardController`, `Admin::ReportsController`
   - Views básicas para dashboard y reports

3. **Actualizar estructura principal**
   - Mover modelos de `app/models/` a `engines/core/app/models/core/`
   - Mover services de `app/services/` a `engines/core/app/services/core/`
   - Actualizar referencias en toda la aplicación
   - Asegurar que las migraciones de Core se ejecuten correctamente

4. **Actualizar rutas principales**
   ```ruby
   # config/routes.rb
   mount Core::Engine => '/api'
   mount Admin::Engine => '/admin'
   ```

**Deliverables:**
- 2 Engines creados y montados
- Modelos y services movidos a Core Engine
- Admin Engine con dashboard básico
- Aplicación funcionando con Engines

---

## SEMANA 2: GraphQL, Background Jobs, Testing, React

### Fase 2.1: GraphQL API Completa (Días 1-3)

#### Objetivo: Implementar queries y mutations para Projects/Tasks

**Tareas:**

1. **GraphQL Types**
   - `Core::Types::ProjectType`
     - Campos: `id`, `name`, `description`, `user`, `tasks`, `createdAt`, `updatedAt`
   - `Core::Types::TaskType`
     - Campos: `id`, `title`, `description`, `status`, `project`, `assignee` (union/interface), `createdAt`, `updatedAt`
   - `Core::Types::ActivityType`
     - Campos: `id`, `record`, `action`, `user`, `metadata`, `createdAt`
   - `Core::Types::StatusEnum` (para Task status)

2. **GraphQL Queries**
   - `QueryType` en Core Engine:
     - `projects` - lista todos los proyectos del usuario actual
     - `project(id:)` - proyecto específico
     - `tasks` - lista tareas (con filtros opcionales: project, status, assignee)
     - `task(id:)` - tarea específica
     - `activities(recordType:, recordId:)` - actividades de un registro

3. **GraphQL Mutations**
   - `Core::Mutations::CreateProject`
     - Args: `name`, `description`
     - Return: `project`, `errors`
   - `Core::Mutations::UpdateProject`
     - Args: `id`, `name`, `description`
     - Return: `project`, `errors`
   - `Core::Mutations::DeleteProject`
     - Args: `id`
     - Return: `success`, `errors`
   - `Core::Mutations::CreateTask`
     - Args: `projectId`, `title`, `description`, `assigneeId` (opcional)
     - Return: `task`, `errors`
   - `Core::Mutations::UpdateTask`
     - Args: `id`, `title`, `description`, `status`, `assigneeId`
     - Return: `task`, `errors`
   - `Core::Mutations::DeleteTask`
     - Args: `id`
     - Return: `success`, `errors`
   - `Core::Mutations::UpdateTaskStatus`
     - Args: `id`, `status`
     - Usa `TaskStatusUpdater` service
     - Return: `task`, `errors`

4. **Actualizar Schema**
   - Registrar queries y mutations en `Core::Types::QueryType` y `Core::Types::MutationType`
   - Integrar con schema principal en `app/graphql/training_app_schema.rb`

**Deliverables:**
- GraphQL Types completos
- Queries funcionando (verificar en GraphiQL)
- Mutations funcionando (verificar en GraphiQL)
- Autenticación requerida para todas las operaciones

---

### Fase 2.2: Background Jobs (Día 4)

#### Objetivo: Implementar ActivityLoggerJob según PRD

**Tareas:**

1. **ActivityLoggerJob**
   - Archivo: `engines/core/app/jobs/core/activity_logger_job.rb`
   - Método: `perform(record_type:, record_id:, action:, user_id:, metadata: {})`
   - Lógica:
     - Buscar el registro por tipo e ID
     - Crear Activity con la información
     - Manejar errores silenciosamente (log)

2. **Integrar con TaskStatusUpdater**
   - Modificar `TaskStatusUpdater` para encolar `ActivityLoggerJob`
   - Pasar metadata relevante (old_status, new_status)

3. **Actualizar otros lugares donde se crean/modifican records**
   - En Project mutations: encolar ActivityLoggerJob
   - En Task mutations: encolar ActivityLoggerJob

**Deliverables:**
- ActivityLoggerJob funcionando
- Jobs encolándose cuando cambian tasks/projects
- Verificar en Sidekiq Web UI que los jobs se ejecutan

---

### Fase 2.3: Testing (Días 5-6)

#### Objetivo: Agregar RSpec coverage para componentes core

**Tareas:**

1. **Configurar RSpec**
   - Ya está instalado `rspec-rails`
   - Generar: `rails generate rspec:install`
   - Configurar: `spec/spec_helper.rb`, `spec/rails_helper.rb`
   - Configurar FactoryBot (ya instalado)

2. **Factories**
   - `spec/factories/users.rb`
   - `spec/factories/projects.rb`
   - `spec/factories/tasks.rb`
   - `spec/factories/activities.rb`

3. **Model Specs**
   - `spec/models/user_spec.rb`
   - `spec/models/core/project_spec.rb` (validaciones, relaciones, scopes)
   - `spec/models/core/task_spec.rb` (validaciones, relaciones, scopes, enum)
   - `spec/models/core/activity_spec.rb` (relaciones, scopes)

4. **Service Specs**
   - `spec/services/core/task_status_updater_spec.rb`
   - Tests para: transiciones válidas/inválidas, encoleo de jobs

5. **Job Specs**
   - `spec/jobs/core/activity_logger_job_spec.rb`
   - Tests para: creación de activity, manejo de errores

6. **GraphQL Specs (opcional pero recomendado)**
   - `spec/graphql/queries/projects_spec.rb`
   - `spec/graphql/mutations/create_task_spec.rb`

7. **CI Integration**
   - Actualizar `.github/workflows/ci.yml` para ejecutar tests
   - Asegurar que todos los tests pasen en CI

**Deliverables:**
- RSpec configurado
- Factories creados
- Tests para modelos, scopes, services, jobs
- Todos los tests pasando localmente y en CI

---

### Fase 2.4: React Client Completo (Días 7-8)

#### Objetivo: Frontend completo para Projects/Tasks con Redux

**Tareas:**

1. **Instalar Redux Toolkit**
   ```bash
   yarn add @reduxjs/toolkit react-redux
   ```

2. **Redux Store Setup**
   - `app/javascript/react/store/index.js`
   - Configurar store con RTK
   - Middleware para Apollo Client integration

3. **Redux Slices**
   - `app/javascript/react/store/slices/projectsSlice.js`
     - Estado: `projects`, `loading`, `error`, `currentProject`
     - Acciones: `fetchProjects`, `addProject`, `updateProject`, `deleteProject`
   - `app/javascript/react/store/slices/tasksSlice.js`
     - Estado: `tasks`, `loading`, `error`, `filters`
     - Acciones: `fetchTasks`, `addTask`, `updateTask`, `deleteTask`, `updateTaskStatus`

4. **GraphQL Queries/Mutations en React**
   - `app/javascript/react/graphql/queries.js`
     - Queries: `PROJECTS_QUERY`, `TASKS_QUERY`, `PROJECT_QUERY`, `TASK_QUERY`
   - `app/javascript/react/graphql/mutations.js`
     - Mutations: `CREATE_PROJECT`, `UPDATE_PROJECT`, `DELETE_PROJECT`, `CREATE_TASK`, `UPDATE_TASK`, `UPDATE_TASK_STATUS`, `DELETE_TASK`

5. **React Components**
   - `app/javascript/react/components/ProjectsList.jsx`
     - Lista proyectos del usuario
     - Link a proyecto individual
   - `app/javascript/react/components/ProjectDetail.jsx`
     - Detalles del proyecto
     - Lista de tareas del proyecto
     - Form para crear tarea
   - `app/javascript/react/components/TaskCard.jsx`
     - Muestra información de tarea
     - Botón para cambiar status
     - Botón para editar/eliminar
   - `app/javascript/react/components/TaskForm.jsx`
     - Form para crear/editar tarea
   - `app/javascript/react/components/ProjectForm.jsx`
     - Form para crear/editar proyecto

6. **Actualizar App.jsx**
   - Router básico (o estado simple para navegación)
   - Integrar Redux Provider
   - Vistas: Projects List, Project Detail, Dashboard

7. **Styling**
   - Usar Tailwind CSS ya configurado
   - Diseño responsive
   - Loading states, error states

**Deliverables:**
- Redux Toolkit configurado e integrado
- Todos los componentes React creados
- UI funcional para CRUD de Projects/Tasks
- Estados de loading/error manejados
- Diseño con Tailwind CSS

---

## Checklist Final de Entregables

### Funcionalidades Core
- [ ] Projects CRUD completo
- [ ] Tasks CRUD completo con polymorphic assignee
- [ ] ActiveRecord Scopes implementados y funcionando
- [ ] Service Objects (TaskStatusUpdater) funcionando
- [ ] Rails Engines (Core + Admin) montados y funcionando
- [ ] GraphQL API completa (queries y mutations)
- [ ] ActivityLoggerJob encolándose automáticamente
- [ ] Tests pasando (RSpec)
- [ ] React Client completo con Redux

### Infraestructura
- [ ] Docker setup funcionando
- [ ] CI Pipeline funcionando (tests, lint, brakeman)
- [ ] Documentación actualizada (README.md)
- [ ] rails_code_auditor ejecutándose sin errores críticos

---

## Notas de Implementación

### Orden de Trabajo Recomendado
1. **Semana 1** debe completarse en orden (Fase 1.1 → 1.2 → 1.3 → 1.4)
2. **Semana 2** puede paralelizarse parcialmente:
   - Fase 2.1 y 2.2 pueden trabajarse simultáneamente
   - Fase 2.3 puede comenzar antes de terminar 2.1/2.2
   - Fase 2.4 requiere que 2.1 esté completo

### Consideraciones Técnicas
- **Engines**: Asegurar que las migraciones se copien correctamente al mountar engines
- **GraphQL**: Usar Dataloader para evitar N+1 queries
- **Polymorphic Assignee**: Implementar GraphQL Union o Interface para `assignee` en TaskType
- **Testing**: Priorizar tests de modelos y services sobre tests de GraphQL/React inicialmente
- **React**: Usar Apollo Client cache updates para sincronizar estado con Redux

### Próximos Pasos Después del Plan
1. Ejecutar `rails_code_auditor` después de cada fase importante
2. Code review por mentor después de Semana 1
3. Deploy a staging después de Semana 2
4. Optimizaciones y refinamientos según feedback

