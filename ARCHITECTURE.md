# Architecture Diagram - DevHub Training App

## System Architecture Overview

This document describes the architecture of the DevHub Training App, a modular Ruby on Rails application with a React frontend.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        React[React Client<br/>Redux Toolkit + Apollo]
    end

    subgraph "API Layer"
        GraphQL[GraphQL API<br/>/graphql endpoint]
        Admin[Admin Engine<br/>/admin routes]
    end

    subgraph "Application Layer"
        Main[Rails 7.2.3 App]
        Core[Core Engine<br/>Business Logic]
        Services[Service Objects<br/>TaskStatusUpdater, etc.]
    end

    subgraph "Background Jobs"
        Sidekiq[Sidekiq<br/>Background Jobs]
        RedisQ[(Redis Queue)]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Database)]
        Redis[(Redis<br/>Cache/Queue)]
    end

    React -->|HTTP/GraphQL| GraphQL
    React -->|HTTP| Admin
    GraphQL --> Main
    Admin --> Main
    Main --> Core
    Core --> Services
    Services --> Sidekiq
    Sidekiq --> RedisQ
    Core --> PostgreSQL
    Main --> PostgreSQL
    Sidekiq --> Redis
    Main --> Redis
```

## Detailed Component Architecture

### Rails Application Structure

```mermaid
graph LR
    subgraph "Main App"
        UserModel[User Model<br/>Authlogic]
        GraphQLAPI[GraphQL API<br/>Types, Queries, Mutations]
        Jobs[Background Jobs<br/>ActivityLoggerJob]
    end

    subgraph "Core Engine"
        CoreModels[Core Models<br/>Project, Task, Activity]
        CoreServices[Core Services<br/>TaskStatusUpdater<br/>ProjectCreator<br/>TaskCreator]
    end

    subgraph "Admin Engine"
        AdminControllers[Admin Controllers<br/>Dashboard, Reports]
        AdminViews[Admin Views<br/>ERB Templates]
    end

    GraphQLAPI --> CoreModels
    GraphQLAPI --> CoreServices
    AdminControllers --> CoreModels
    Jobs --> CoreModels
    UserModel --> CoreModels
```

## Data Flow

### Request Flow: Create Task

```mermaid
sequenceDiagram
    participant React as React Client
    participant GraphQL as GraphQL API
    participant Service as TaskCreator Service
    participant Model as Core::Task Model
    participant Job as ActivityLoggerJob
    participant Sidekiq as Sidekiq
    participant DB as PostgreSQL

    React->>GraphQL: mutation createTask
    GraphQL->>Service: TaskCreator.call()
    Service->>Model: Task.create()
    Model->>DB: INSERT INTO tasks
    Service->>Job: ActivityLoggerJob.perform_later()
    Job->>Sidekiq: Enqueue job
    Sidekiq->>DB: INSERT INTO activities
    Service-->>GraphQL: Success/Error
    GraphQL-->>React: Task data
```

### Request Flow: Query Projects

```mermaid
sequenceDiagram
    participant React as React Client
    participant GraphQL as GraphQL API
    participant Model as Core::Project Model
    participant DB as PostgreSQL

    React->>GraphQL: query projects
    GraphQL->>Model: Project.by_user(current_user)
    Model->>DB: SELECT * FROM projects
    DB-->>Model: Projects data
    Model-->>GraphQL: Projects array
    GraphQL-->>React: Projects JSON
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Redux Toolkit 2.10**: State management
- **Apollo Client 3.12**: GraphQL client
- **Tailwind CSS 4.1**: Styling

### Backend
- **Ruby 3.3.7**: Programming language
- **Rails 7.2.3**: Web framework
- **GraphQL (graphql-ruby)**: API layer
- **Authlogic 6.4**: Authentication
- **Sidekiq 7.3**: Background jobs

### Infrastructure
- **PostgreSQL 15**: Primary database
- **Redis 7**: Cache and job queue
- **Docker**: Containerization
- **Docker Compose**: Local development

## Engine Architecture

### Core Engine

The Core Engine contains the main business logic:

```
core/
├── app/
│   ├── models/core/
│   │   ├── project.rb      # Core::Project
│   │   ├── task.rb          # Core::Task
│   │   └── activity.rb      # Core::Activity
│   └── services/core/
│       ├── task_status_updater.rb
│       ├── project_creator.rb
│       └── task_creator.rb
└── lib/core/
    └── engine.rb
```

**Mounted at**: `/api` (currently no routes, used for namespacing)

### Admin Engine

The Admin Engine provides administrative interfaces:

```
admin/
├── app/
│   ├── controllers/admin/
│   │   ├── dashboard_controller.rb
│   │   └── reports_controller.rb
│   └── views/admin/
│       ├── dashboard/
│       └── reports/
└── lib/admin/
    └── engine.rb
```

**Mounted at**: `/admin`

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant GraphQL
    participant Authlogic
    participant Session

    User->>React: Login credentials
    React->>GraphQL: loginUser mutation
    GraphQL->>Authlogic: UserSession.create()
    Authlogic->>Session: Create session
    Authlogic-->>GraphQL: User + Session
    GraphQL-->>React: User data + token
    React->>React: Store in Redux/Apollo
    React->>React: Set Authorization header
```

## Background Jobs Flow

```mermaid
graph LR
    A[Service Object] -->|Enqueue| B[ActivityLoggerJob]
    B --> C[Sidekiq Queue]
    C --> D[Sidekiq Worker]
    D --> E[Create Activity Record]
    E --> F[(PostgreSQL)]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer]
        App1[Rails App<br/>Container 1]
        App2[Rails App<br/>Container 2]
        Sidekiq1[Sidekiq Worker<br/>Container 1]
        Sidekiq2[Sidekiq Worker<br/>Container 2]
        PG[(PostgreSQL<br/>Primary)]
        Redis[(Redis<br/>Cluster)]
    end

    LB --> App1
    LB --> App2
    App1 --> PG
    App2 --> PG
    App1 --> Redis
    App2 --> Redis
    Sidekiq1 --> Redis
    Sidekiq2 --> Redis
    Sidekiq1 --> PG
    Sidekiq2 --> PG
```

## Security Architecture

- **Authentication**: Authlogic with session-based auth
- **Authorization**: User-scoped queries (users can only access their own projects/tasks)
- **API Security**: GraphQL queries require authentication
- **Background Jobs**: Secure job processing via Sidekiq
- **Database**: Parameterized queries via ActiveRecord

## Scalability Considerations

1. **Horizontal Scaling**: Rails app can be scaled horizontally behind load balancer
2. **Background Jobs**: Sidekiq workers can be scaled independently
3. **Database**: PostgreSQL can be replicated for read scaling
4. **Caching**: Redis used for session storage and job queue
5. **Engines**: Modular architecture allows independent scaling of features

---

**Last Updated**: 2025-11-17  
**Version**: 1.0

