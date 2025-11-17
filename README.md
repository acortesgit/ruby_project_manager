# DevHub - Developer Task & Project Management App

Una aplicación Ruby on Rails de entrenamiento que simula un entorno de producción para gestión de proyectos y tareas.

## 📋 Descripción

DevHub es una aplicación Rails diseñada con dos propósitos principales:
1. **Enseñar** a los ingenieros a aplicar la arquitectura e idiomas de Rails mediante código práctico
2. **Entregar** una herramienta interna funcional para gestionar proyectos, tareas e historial de actividades

La aplicación está estructurada de manera similar a un ecosistema Rails modular del mundo real.

## 🎯 Objetivos del Proyecto

- Demostrar competencias core de Rails (Models, Scopes, Service Objects, Engines)
- Implementar una API GraphQL completa
- Integrar background jobs con Sidekiq
- Construir un cliente React con Redux y Apollo
- Aplicar mejores prácticas de testing y arquitectura

## 🏗️ Arquitectura

```
app/
├── models/          # Modelos principales (User)
├── graphql/         # API GraphQL (Types, Queries, Mutations)
├── jobs/            # Background Jobs (ActivityLoggerJob)
└── javascript/      # Frontend React + Apollo Client

core/                # Core Engine (lógica de negocio principal)
├── app/
│   ├── models/core/         # Core::Project, Core::Task, Core::Activity
│   └── services/core/       # Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
└── lib/core/engine.rb

admin/               # Admin Engine (panel de administración)
├── app/
│   ├── controllers/admin/   # Admin::DashboardController, Admin::ReportsController
│   └── views/admin/         # Vistas del admin
└── lib/admin/engine.rb

Frontend: React + Redux Toolkit + Apollo Client
Backend: Rails 7.2.3 + GraphQL + Sidekiq
Database: PostgreSQL
Cache/Jobs: Redis
Auth: Authlogic
```

## 🛠️ Tech Stack

### Backend
- **Ruby**: 3.3.7
- **Rails**: 7.2.3
- **Database**: PostgreSQL 15
- **Cache/Jobs**: Redis 7
- **API**: GraphQL (graphql-ruby)
- **Auth**: Authlogic 6.4
- **Jobs**: Sidekiq 7.3 + ActiveJob

### Frontend
- **React**: 18
- **Apollo Client**: 3.12
- **Redux Toolkit**: (pendiente)
- **Tailwind CSS**: 4.1
- **esbuild**: Para bundling JavaScript

### DevOps
- **Docker**: Para desarrollo local
- **Docker Compose**: Para servicios (PostgreSQL, Redis, Web)

### Testing & Quality
- **RSpec**: Framework de testing
- **Factory Bot**: Factories para tests
- **rails_code_auditor**: Auditoría de código (Rubocop, Brakeman, SimpleCov)

## ✅ Estado Actual

### Completado ✅
- [x] Rails 7.2.3 setup básico
- [x] PostgreSQL y Redis configurados
- [x] Docker setup para desarrollo
- [x] Authlogic configurado (User, UserSession)
- [x] GraphQL API básica (solo autenticación)
- [x] React + Apollo Client básico (solo autenticación)
- [x] Sidekiq configurado
- [x] **Modelos**: Core::Project, Core::Task, Core::Activity con migraciones y relaciones
- [x] **ActiveRecord Scopes**: Implementados en todos los modelos
- [x] **Service Objects**: Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
- [x] **Rails Engines**: Core Engine y Admin Engine montados
- [x] **GraphQL API completa**: Types, Queries y Mutations para Projects/Tasks
- [x] **ActivityLoggerJob**: Background job para registrar actividades asincrónicamente
- [x] **Testing**: RSpec configurado con factories, model specs, service specs y job specs
- [x] rails_code_auditor instalado

### En Progreso ⏳
- [ ] React Client completo (Projects/Tasks UI)

### Pendiente 📋
- [ ] Redux Toolkit integration

## 🚀 Instalación y Setup

### Requisitos Previos
- Docker y Docker Compose instalados
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd training_app
   ```

2. **Construir y levantar los servicios con Docker**
   ```bash
   docker-compose -f docker-compose.dev.yml build
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Crear y migrar la base de datos**
   ```bash
   docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:create
   docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:migrate
   ```

4. **Verificar que todo esté funcionando**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

## 🎮 Uso

### Iniciar el servidor de desarrollo

El servidor Rails debería iniciarse automáticamente con Docker Compose. Si no está corriendo:

```bash
docker-compose -f docker-compose.dev.yml up web
```

O si ya está corriendo en background:

```bash
docker-compose -f docker-compose.dev.yml start web
```

### Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **GraphiQL (dev)**: http://localhost:3000/graphiql
- **Sidekiq Web UI (dev)**: http://localhost:3000/sidekiq
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Reports**: http://localhost:3000/admin/reports
- **Core Engine**: http://localhost:3000/api (montado pero sin rutas aún)

### Comandos Docker Útiles

Ver logs del servidor:
```bash
docker-compose -f docker-compose.dev.yml logs -f web
```

Ejecutar comandos Rails:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails <command>
```

Consola Rails:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails console
```

Ver estado de servicios:
```bash
docker-compose -f docker-compose.dev.yml ps
```

Detener servicios:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Compilar Assets Manualmente

Si necesitas compilar assets JavaScript/CSS manualmente:

```bash
docker-compose -f docker-compose.dev.yml exec web yarn build
docker-compose -f docker-compose.dev.yml exec web yarn build:css
```

## 📁 Estructura del Proyecto

```
training_app/
├── app/
│   ├── models/              # Modelos ActiveRecord principales
│   │   └── user.rb          # Usuario (Authlogic)
│   ├── graphql/             # GraphQL API
│   │   ├── types/           # GraphQL Types
│   │   ├── mutations/       # Mutations
│   │   └── training_app_schema.rb
│   ├── jobs/                # Background Jobs
│   │   ├── application_job.rb
│   │   └── sample_job.rb
│   └── javascript/          # Frontend React
│       └── react/
│           ├── App.jsx
│           └── index.jsx
├── core/                    # Core Engine (lógica de negocio)
│   ├── app/
│   │   ├── models/core/     # Core::Project, Core::Task, Core::Activity
│   │   └── services/core/   # Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
│   └── lib/core/engine.rb
├── admin/                   # Admin Engine (panel de administración)
│   ├── app/
│   │   ├── controllers/admin/   # Admin::DashboardController, Admin::ReportsController
│   │   └── views/admin/         # Vistas del admin
│   └── lib/admin/engine.rb
├── config/
│   ├── database.yml         # Configuración PostgreSQL
│   ├── routes.rb            # Rutas principales (monta engines)
│   └── sidekiq.yml          # Configuración Sidekiq
├── db/
│   └── migrate/             # Migraciones (compartidas)
├── docker-compose.dev.yml   # Docker Compose para desarrollo
├── Dockerfile.dev           # Dockerfile para desarrollo
└── README.md                # Este archivo
```

## 🔐 Autenticación

La aplicación usa **Authlogic** para autenticación. Los usuarios se crean mediante GraphQL mutations:

**Registro**:
```graphql
mutation {
  registerUser(
    email: "user@example.com"
    password: "password123"
    passwordConfirmation: "password123"
  ) {
    user {
      id
      email
    }
    errors
  }
}
```

**Login**:
```graphql
mutation {
  loginUser(
    email: "user@example.com"
    password: "password123"
  ) {
    user {
      id
      email
    }
    errors
  }
}
```

## 🔌 GraphQL API

La aplicación expone una API GraphQL completa en `/graphql`. Puedes explorarla en GraphiQL: http://localhost:3000/graphiql (solo en desarrollo)

### Queries Disponibles

**Obtener proyectos del usuario actual**:
```graphql
query {
  projects {
    id
    name
    description
    createdAt
    tasks {
      id
      title
      status
    }
  }
}
```

**Obtener un proyecto específico**:
```graphql
query {
  project(id: "1") {
    id
    name
    description
    tasks {
      id
      title
      status
    }
  }
}
```

**Obtener tareas (con filtros opcionales)**:
```graphql
query {
  tasks(projectId: "1", status: IN_PROGRESS, assigneeId: "1") {
    id
    title
    description
    status
    project {
      id
      name
    }
    assignee {
      id
      email
    }
  }
}
```

**Obtener actividades**:
```graphql
query {
  activities(recordType: "Task", recordId: "1") {
    id
    action
    user {
      id
      email
    }
    metadata
    createdAt
  }
}
```

### Mutations Disponibles

**Crear proyecto**:
```graphql
mutation {
  createProject(name: "Mi Proyecto", description: "Descripción") {
    project {
      id
      name
    }
    errors
  }
}
```

**Crear tarea**:
```graphql
mutation {
  createTask(
    projectId: "1"
    title: "Nueva Tarea"
    description: "Descripción"
    assigneeId: "1"
  ) {
    task {
      id
      title
      status
    }
    errors
  }
}
```

**Actualizar status de tarea**:
```graphql
mutation {
  updateTaskStatus(id: "1", status: IN_PROGRESS) {
    task {
      id
      status
    }
    errors
  }
}
```

**Actualizar tarea**:
```graphql
mutation {
  updateTask(
    id: "1"
    title: "Tarea Actualizada"
    description: "Nueva descripción"
    status: COMPLETED
  ) {
    task {
      id
      title
      status
    }
    errors
  }
}
```

**Eliminar proyecto**:
```graphql
mutation {
  deleteProject(id: "1") {
    success
    errors
  }
}
```

**Eliminar tarea**:
```graphql
mutation {
  deleteTask(id: "1") {
    success
    errors
  }
}
```

**Nota**: Todas las queries y mutations de Projects/Tasks requieren autenticación (usuario logueado).

## 📊 Modelos y Relaciones

### User
- `has_many :projects` (Core::Project, owner)
- `has_many :assigned_tasks` (Core::Task, polymorphic assignee)
- `has_many :activities` (Core::Activity)

### Core::Project
- `belongs_to :user`
- `has_many :tasks` (Core::Task)
- `has_many :activities` (polymorphic, Core::Activity)

**Scopes**:
- `.by_user(user)` - Proyectos de un usuario
- `.recent` - Ordenados por fecha
- `.with_tasks` - Con tareas

### Core::Task
- `belongs_to :project` (Core::Project)
- `belongs_to :assignee` (polymorphic, optional)
- `has_many :activities` (polymorphic, Core::Activity)
- Enum: `status: { pending: 0, in_progress: 1, completed: 2 }`

**Scopes**:
- `.recent` - Ordenadas por fecha
- `.assigned_to(assignee)` - Asignadas a un usuario
- `.for_project(project)` - De un proyecto
- `.pending`, `.in_progress`, `.completed` (del enum)

### Core::Activity
- `belongs_to :record` (polymorphic)
- `belongs_to :user`
- `metadata` (jsonb)

**Scopes**:
- `.by_record(record)` - De un registro específico
- `.by_user(user)` - De un usuario
- `.recent` - Ordenadas por fecha
- `.by_action(action)` - Filtradas por acción

## 🔧 Service Objects (Core Engine)

Todos los service objects están en el namespace `Core::`.

### Core::TaskStatusUpdater
Actualiza el status de una tarea y registra la actividad.

```ruby
result = Core::TaskStatusUpdater.call(
  task: task,
  new_status: 'in_progress',
  user: current_user
)

if result.success?
  # Éxito
else
  # result.errors contiene los errores
end
```

### Core::ProjectCreator
Crea un nuevo proyecto con validaciones.

```ruby
result = Core::ProjectCreator.call(
  user: current_user,
  name: "Mi Proyecto",
  description: "Descripción"
)
```

### Core::TaskCreator
Crea una nueva tarea con validaciones.

```ruby
result = Core::TaskCreator.call(
  project: project,
  title: "Nueva Tarea",
  description: "Descripción",
  assignee: user  # Opcional
)
```

## 🎛️ Rails Engines

### Core Engine (`/api`)
Contiene la lógica de negocio principal:
- Modelos: `Core::Project`, `Core::Task`, `Core::Activity`
- Services: `Core::TaskStatusUpdater`, `Core::ProjectCreator`, `Core::TaskCreator`

### Admin Engine (`/admin`)
Panel de administración:
- Dashboard: Estadísticas generales (proyectos, tareas, usuarios, actividades)
- Reports: Reportes y actividades recientes

## 🔄 Background Jobs

### ActivityLoggerJob

El `ActivityLoggerJob` se encola automáticamente cuando:
- Se crea un proyecto (via `Core::ProjectCreator`)
- Se crea una tarea (via `Core::TaskCreator`)
- Se actualiza el status de una tarea (via `Core::TaskStatusUpdater`)
- Se actualiza un proyecto (via GraphQL mutation `updateProject`)
- Se actualiza una tarea (via GraphQL mutation `updateTask`)

**Verificar jobs en Sidekiq**:
- Accede a http://localhost:3000/sidekiq (solo en desarrollo)
- Verás la cola de jobs y su estado

**Nota**: Para que los jobs se procesen, Sidekiq debe estar corriendo. Actualmente está comentado en `Procfile.dev` pero puedes iniciarlo manualmente:

```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec sidekiq -C config/sidekiq.yml
```

## 🧪 Testing

### Configuración de Testing

El proyecto usa **RSpec** para testing con **FactoryBot** para factories y **shoulda-matchers** para matchers de validaciones/asociaciones.

### Factories

- `spec/factories/users.rb` - Factory para User
- `spec/factories/projects.rb` - Factory para Core::Project
- `spec/factories/tasks.rb` - Factory para Core::Task
- `spec/factories/activities.rb` - Factory para Core::Activity

### Specs Implementados

**Model Specs**:
- `spec/models/user_spec.rb` - Tests para User model
- `spec/models/core/project_spec.rb` - Tests para Core::Project (validaciones, asociaciones, scopes)
- `spec/models/core/task_spec.rb` - Tests para Core::Task (validaciones, asociaciones, enums, scopes)
- `spec/models/core/activity_spec.rb` - Tests para Core::Activity (relaciones, scopes)

**Service Specs**:
- `spec/services/core/task_status_updater_spec.rb` - Tests para Core::TaskStatusUpdater

**Job Specs**:
- `spec/jobs/activity_logger_job_spec.rb` - Tests para ActivityLoggerJob

### Ejecutar Tests

Ejecutar todos los tests:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec
```

Ejecutar tests específicos:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/models/
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/services/
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/jobs/
```

Ejecutar con formato detallado:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec --format documentation
```

### Ejecutar Auditoría de Código

```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails_code_auditor
```

## 📝 Variables de Entorno

Las variables de entorno se configuran en `docker-compose.dev.yml`:

- `RAILS_ENV`: development
- `DB_HOST`: postgres-training
- `DB_PORT`: 5432
- `DB_NAME`: training_app_development
- `REDIS_URL`: redis://redis-training:6379/0

## 🔄 Próximos Pasos

Según el plan de implementación (`IMPLEMENTATION_PLAN.md`):

1. **Rails Engines** (Core + Admin) - Fase 1.4
2. **GraphQL API Completa** - Fase 2.1
3. **ActivityLoggerJob** - Fase 2.2
4. **Testing con RSpec** - Fase 2.3
5. **React Client Completo** - Fase 2.4

## 📚 Documentación Adicional

- `IMPLEMENTATION_PLAN.md` - Plan detallado de implementación
- `DOCKER_COMMANDS.md` - Comandos Docker útiles

## 🤝 Contribuir

Este es un proyecto de entrenamiento. Consulta el plan de implementación para ver las tareas pendientes.

## 📄 Licencia

[Especificar licencia si aplica]

---

**Última actualización**: 2025-11-17  
**Estado**: En desarrollo activo (Semana 1 - Fase 1.4 completada - Rails Engines implementados)