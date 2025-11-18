# DevHub - Developer Task & Project Management App

A Ruby on Rails training application that simulates a production environment for project and task management.

## 📋 Description

DevHub is a Rails application designed with two main purposes:
1. **Teach** engineers to apply Rails architecture and idioms through hands-on code
2. **Deliver** a functional internal tool for managing projects, tasks, and activity history

The application is structured similar to a real-world modular Rails ecosystem.

## 🎯 Project Objectives

- Demonstrate core Rails competencies (Models, Scopes, Service Objects, Engines)
- Implement a complete GraphQL API
- Integrate background jobs with Sidekiq
- Build a React client with Redux and Apollo
- Apply testing and architecture best practices

## 🏗️ Architecture

```
app/
├── models/          # Main models (User)
├── graphql/         # GraphQL API (Types, Queries, Mutations)
├── jobs/            # Background Jobs (ActivityLoggerJob)
└── javascript/      # Frontend React + Apollo Client

core/                # Core Engine (main business logic)
├── app/
│   ├── models/core/         # Core::Project, Core::Task, Core::Activity
│   └── services/core/       # Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
└── lib/core/engine.rb

admin/               # Admin Engine (administration panel)
├── app/
│   ├── controllers/admin/   # Admin::DashboardController, Admin::ReportsController
│   └── views/admin/         # Admin views
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
- **Redux Toolkit**: 2.10
- **Tailwind CSS**: 4.1
- **esbuild**: For JavaScript bundling

### DevOps
- **Docker**: For local development
- **Docker Compose**: For services (PostgreSQL, Redis, Web)

### Testing & Quality
- **RSpec**: Testing framework
- **Factory Bot**: Factories for tests
- **shoulda-matchers**: Matchers for validations/associations
- **rails_code_auditor**: Code auditing (Rubocop, Brakeman, SimpleCov)

## ✅ Current Status

### Completed ✅
- [x] Rails 7.2.3 basic setup
- [x] PostgreSQL and Redis configured
- [x] Docker setup for development
- [x] Authlogic configured (User, UserSession)
- [x] Basic GraphQL API (authentication only)
- [x] Basic React + Apollo Client (authentication only)
- [x] Sidekiq configured
- [x] **Models**: Core::Project, Core::Task, Core::Activity with migrations and relations
- [x] **ActiveRecord Scopes**: Implemented in all models
- [x] **Service Objects**: Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
- [x] **Rails Engines**: Core Engine and Admin Engine mounted
- [x] **Complete GraphQL API**: Types, Queries and Mutations for Projects/Tasks
- [x] **ActivityLoggerJob**: Background job to register activities asynchronously
- [x] **Testing**: RSpec configured with factories, model specs, service specs and job specs
- [x] **React Client**: Complete React client with Redux Toolkit for Projects/Tasks management
- [x] rails_code_auditor installed

### In Progress ⏳
- [ ] Additional features and enhancements

### Pending 📋
- [ ] Production deployment setup
- [x] CI/CD pipeline (Jenkinsfile created, GitHub Actions also available)

## 🚀 Installation and Setup

### Prerequisites

Before starting, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

**Optional** (for local development without Docker):
- Ruby 3.3.7
- PostgreSQL 15
- Redis 7
- Node.js 18+ and Yarn

### Installation Steps

#### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd training_app
   ```

2. **Build and start services with Docker**
   ```bash
   docker-compose -f docker-compose.dev.yml build
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Create and migrate the database**
   ```bash
   docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:create
   docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:migrate
   ```

4. **Install JavaScript dependencies** (if not done automatically)
   ```bash
   docker-compose -f docker-compose.dev.yml exec web yarn install
   ```

5. **Verify everything is working**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

   You should see all services running:
   - `web` (Rails application)
   - `postgres-training` (PostgreSQL database)
   - `redis-training` (Redis cache/queue)

#### Option 2: Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd training_app
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   yarn install
   ```

4. **Setup database**
   ```bash
   # Configure database.yml with your PostgreSQL credentials
   rails db:create
   rails db:migrate
   ```

5. **Start Redis** (required for Sidekiq)
   ```bash
   redis-server
   ```

6. **Start the Rails server**
   ```bash
   bin/dev
   # Or separately:
   # rails server
   # bin/rails sidekiq
   ```

### Post-Installation Verification

1. **Check application is running**
   - Open http://localhost:3000 in your browser
   - You should see the application homepage

2. **Verify GraphQL endpoint**
   - Open http://localhost:3000/graphiql
   - You should see the GraphiQL interface

3. **Verify Sidekiq Web UI**
   - Open http://localhost:3000/sidekiq
   - You should see the Sidekiq dashboard

4. **Run tests to verify setup**
   ```bash
   docker-compose -f docker-compose.dev.yml exec web bundle exec rspec
   # Or locally:
   bundle exec rspec
   ```

## 🎮 Usage

### Start the development server

The Rails server should start automatically with Docker Compose. If it's not running:

```bash
docker-compose -f docker-compose.dev.yml up web
```

Or if it's already running in the background:

```bash
docker-compose -f docker-compose.dev.yml start web
```

### Access the application

- **Frontend**: http://localhost:3000
- **GraphiQL (dev)**: http://localhost:3000/graphiql
- **Sidekiq Web UI (dev)**: http://localhost:3000/sidekiq
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Reports**: http://localhost:3000/admin/reports
- **Core Engine**: http://localhost:3000/api (mounted but no routes yet)

### Useful Docker Commands

View server logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f web
```

Run Rails commands:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails <command>
```

Rails console:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails console
```

View service status:
```bash
docker-compose -f docker-compose.dev.yml ps
```

Stop services:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Compile Assets Manually

If you need to compile JavaScript/CSS assets manually:

```bash
docker-compose -f docker-compose.dev.yml exec web yarn build
docker-compose -f docker-compose.dev.yml exec web yarn build:css
```

## 📁 Project Structure

```
training_app/
├── app/
│   ├── models/              # Main ActiveRecord models
│   │   └── user.rb          # User (Authlogic)
│   ├── graphql/             # GraphQL API
│   │   ├── types/           # GraphQL Types
│   │   ├── mutations/       # Mutations
│   │   └── training_app_schema.rb
│   ├── jobs/                # Background Jobs
│   │   ├── application_job.rb
│   │   └── activity_logger_job.rb
│   └── javascript/          # Frontend React
│       └── react/
│           ├── App.jsx
│           ├── index.jsx
│           ├── components/  # React components
│           ├── store/       # Redux store
│           └── graphql/     # GraphQL queries/mutations
├── core/                    # Core Engine (business logic)
│   ├── app/
│   │   ├── models/core/     # Core::Project, Core::Task, Core::Activity
│   │   └── services/core/   # Core::TaskStatusUpdater, Core::ProjectCreator, Core::TaskCreator
│   └── lib/core/engine.rb
├── admin/                   # Admin Engine (administration panel)
│   ├── app/
│   │   ├── controllers/admin/   # Admin::DashboardController, Admin::ReportsController
│   │   └── views/admin/         # Admin views
│   └── lib/admin/engine.rb
├── config/
│   ├── database.yml         # PostgreSQL configuration
│   ├── routes.rb            # Main routes (mounts engines)
│   └── sidekiq.yml          # Sidekiq configuration
├── db/
│   └── migrate/             # Migrations (shared)
├── docker-compose.dev.yml   # Docker Compose for development
├── Dockerfile.dev           # Dockerfile for development
└── README.md                # This file
```

## 🔐 Authentication

The application uses **Authlogic** for authentication. Users are created through GraphQL mutations:

**Register**:
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

The application exposes a complete GraphQL API at `/graphql`. You can explore it in GraphiQL: http://localhost:3000/graphiql (development only)

### Available Queries

**Get current user's projects**:
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

**Get a specific project**:
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

**Get tasks (with optional filters)**:
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

**Get activities**:
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

### Available Mutations

**Create project**:
```graphql
mutation {
  createProject(name: "My Project", description: "Description") {
    project {
      id
      name
    }
    errors
  }
}
```

**Create task**:
```graphql
mutation {
  createTask(
    projectId: "1"
    title: "New Task"
    description: "Description"
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

**Update task status**:
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

**Update task**:
```graphql
mutation {
  updateTask(
    id: "1"
    title: "Updated Task"
    description: "New description"
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

**Delete project**:
```graphql
mutation {
  deleteProject(id: "1") {
    success
    errors
  }
}
```

**Delete task**:
```graphql
mutation {
  deleteTask(id: "1") {
    success
    errors
  }
}
```

**Note**: All Projects/Tasks queries and mutations require authentication (logged-in user).

## 📊 Models and Relations

### User
- `has_many :projects` (Core::Project, owner)
- `has_many :assigned_tasks` (Core::Task, polymorphic assignee)
- `has_many :activities` (Core::Activity)

### Core::Project
- `belongs_to :user`
- `has_many :tasks` (Core::Task)
- `has_many :activities` (polymorphic, Core::Activity)

**Scopes**:
- `.by_user(user)` - Projects for a user
- `.recent` - Ordered by date
- `.with_tasks` - With tasks

### Core::Task
- `belongs_to :project` (Core::Project)
- `belongs_to :assignee` (polymorphic, optional)
- `has_many :activities` (polymorphic, Core::Activity)
- Enum: `status: { pending: 0, in_progress: 1, completed: 2 }`

**Scopes**:
- `.recent` - Ordered by date
- `.assigned_to(assignee)` - Assigned to a user
- `.for_project(project)` - From a project
- `.pending`, `.in_progress`, `.completed` (from enum)

### Core::Activity
- `belongs_to :record` (polymorphic)
- `belongs_to :user`
- `metadata` (jsonb)

**Scopes**:
- `.by_record(record)` - From a specific record
- `.by_user(user)` - From a user
- `.recent` - Ordered by date
- `.by_action(action)` - Filtered by action

## 🔧 Service Objects (Core Engine)

All service objects are in the `Core::` namespace.

### Core::TaskStatusUpdater
Updates a task's status and logs the activity.

```ruby
result = Core::TaskStatusUpdater.call(
  task: task,
  new_status: 'in_progress',
  user: current_user
)

if result.success?
  # Success
else
  # result.errors contains the errors
end
```

### Core::ProjectCreator
Creates a new project with validations.

```ruby
result = Core::ProjectCreator.call(
  user: current_user,
  name: "My Project",
  description: "Description"
)
```

### Core::TaskCreator
Creates a new task with validations.

```ruby
result = Core::TaskCreator.call(
  project: project,
  title: "New Task",
  description: "Description",
  assignee: user  # Optional
)
```

## 🎛️ Rails Engines

### Core Engine (`/api`)
Contains the main business logic:
- Models: `Core::Project`, `Core::Task`, `Core::Activity`
- Services: `Core::TaskStatusUpdater`, `Core::ProjectCreator`, `Core::TaskCreator`

### Admin Engine (`/admin`)
Administration panel:
- Dashboard: General statistics (projects, tasks, users, activities)
- Reports: Reports and recent activities

## 🔄 Background Jobs

### ActivityLoggerJob

The `ActivityLoggerJob` is automatically enqueued when:
- A project is created (via `Core::ProjectCreator`)
- A task is created (via `Core::TaskCreator`)
- A task's status is updated (via `Core::TaskStatusUpdater`)
- A project is updated (via GraphQL mutation `updateProject`)
- A task is updated (via GraphQL mutation `updateTask`)

**Check jobs in Sidekiq**:
- Access http://localhost:3000/sidekiq (development only)
- You'll see the job queue and its status

**Note**: For jobs to be processed, Sidekiq must be running. Currently it's commented out in `Procfile.dev` but you can start it manually:

```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec sidekiq -C config/sidekiq.yml
```

## 🧪 Testing

### Testing Configuration

The project uses **RSpec** for testing with **FactoryBot** for factories and **shoulda-matchers** for validation/association matchers.

### Factories

- `spec/factories/users.rb` - Factory for User
- `spec/factories/projects.rb` - Factory for Core::Project
- `spec/factories/tasks.rb` - Factory for Core::Task
- `spec/factories/activities.rb` - Factory for Core::Activity

### Implemented Specs

**Model Specs**:
- `spec/models/user_spec.rb` - Tests for User model
- `spec/models/core/project_spec.rb` - Tests for Core::Project (validations, associations, scopes)
- `spec/models/core/task_spec.rb` - Tests for Core::Task (validations, associations, enums, scopes)
- `spec/models/core/activity_spec.rb` - Tests for Core::Activity (relations, scopes)

**Service Specs**:
- `spec/services/core/task_status_updater_spec.rb` - Tests for Core::TaskStatusUpdater

**Job Specs**:
- `spec/jobs/activity_logger_job_spec.rb` - Tests for ActivityLoggerJob

### Run Tests

Run all tests:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec
```

Run specific tests:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/models/
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/services/
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec spec/jobs/
```

Run with detailed format:
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rspec --format documentation
```

### Run Code Audit

```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails_code_auditor
```

## 📝 Environment Variables

Environment variables are configured in `docker-compose.dev.yml`:

- `RAILS_ENV`: development
- `DB_HOST`: postgres-training
- `DB_PORT`: 5432
- `DB_NAME`: training_app_development
- `REDIS_URL`: redis://redis-training:6379/0

## 🔄 CI/CD Pipeline

The project includes CI/CD pipeline configurations for both Jenkins and GitHub Actions.

### Jenkins Pipeline

A `Jenkinsfile` is provided for Jenkins CI/CD. The pipeline includes:

- **Security Scan**: Brakeman static analysis
- **Lint**: RuboCop code style checking
- **Tests**: RSpec test suite execution
- **Code Audit**: Rails code auditor

To use with Jenkins:
1. Configure Jenkins to detect the `Jenkinsfile` in the repository
2. Ensure Jenkins has access to PostgreSQL and Redis services
3. Configure Ruby version manager (rbenv or rvm) on Jenkins agents

### GitHub Actions

GitHub Actions CI is configured in `.github/workflows/ci.yml` and runs automatically on:
- Pull requests
- Pushes to `main` branch

The workflow includes:
- Security scanning (Brakeman)
- Code linting (RuboCop)
- Test execution (RSpec)

## 🔄 Next Steps

According to the implementation plan (`IMPLEMENTATION_PLAN.md`):

1. **Rails Engines** (Core + Admin) - Phase 1.4 ✅
2. **Complete GraphQL API** - Phase 2.1 ✅
3. **ActivityLoggerJob** - Phase 2.2 ✅
4. **Testing with RSpec** - Phase 2.3 ✅
5. **Complete React Client** - Phase 2.4 ✅
6. **CI/CD Pipeline** - Jenkinsfile + GitHub Actions ✅
7. **Documentation** - Architecture diagram + ERD ✅

## 📚 Additional Documentation

- `IMPLEMENTATION_PLAN.md` - Detailed implementation plan
- `DOCKER_COMMANDS.md` - Useful Docker commands
- `ARCHITECTURE.md` - System architecture diagrams and component descriptions
- `SCHEMA_ERD.md` - Database schema ERD and relationship documentation
- `Jenkinsfile` - Jenkins CI/CD pipeline configuration

## 🤝 Contributing

This is a training project. Check the implementation plan for pending tasks.

## 📄 License

[Specify license if applicable]

---

**Last updated**: 2025-11-17  
**Status**: Active development (Week 2 - Phase 2.4 completed - React Client with Redux implemented)
