# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :current_user, Types::UserType, null: true,
      description: "Details for the currently authenticated user"

    def current_user
      context[:current_user]
    end

    # Project queries
    field :projects, [Types::ProjectType], null: false,
      description: "List all projects for the current user"

    def projects
      current_user = context[:current_user]
      return [] unless current_user

      Core::Project.by_user(current_user)
    end

    field :project, Types::ProjectType, null: true,
      description: "Get a specific project by ID" do
      argument :id, ID, required: true, description: "Project ID"
    end

    def project(id:)
      current_user = context[:current_user]
      return nil unless current_user

      project = Core::Project.find_by(id: id)
      return nil unless project
      return nil unless project.user_id == current_user.id

      project
    end

    # Task queries
    field :tasks, [Types::TaskType], null: false,
      description: "List tasks (optionally filtered by project, status, or assignee)" do
      argument :project_id, ID, required: false, description: "Filter by project ID"
      argument :status, Types::StatusEnum, required: false, description: "Filter by status"
      argument :assignee_id, ID, required: false, description: "Filter by assignee ID"
    end

    def tasks(project_id: nil, status: nil, assignee_id: nil)
      current_user = context[:current_user]
      return [] unless current_user

      # Start with tasks from projects owned by the current user
      tasks = Core::Task.joins(:project).where(projects: { user_id: current_user.id })

      tasks = tasks.where(project_id: project_id) if project_id
      tasks = tasks.where(status: status) if status
      tasks = tasks.where(assignee_id: assignee_id, assignee_type: "User") if assignee_id

      tasks
    end

    field :task, Types::TaskType, null: true,
      description: "Get a specific task by ID" do
      argument :id, ID, required: true, description: "Task ID"
    end

    def task(id:)
      current_user = context[:current_user]
      return nil unless current_user

      task = Core::Task.find_by(id: id)
      return nil unless task
      return nil unless task.project.user_id == current_user.id

      task
    end

    # Activity queries
    field :activities, [Types::ActivityType], null: false,
      description: "List activities for a specific record" do
      argument :record_type, String, required: false, description: "Record type (e.g., 'Project', 'Task')"
      argument :record_id, ID, required: false, description: "Record ID"
    end

    def activities(record_type: nil, record_id: nil)
      current_user = context[:current_user]
      return [] unless current_user

      activities = Core::Activity.by_user(current_user)

      activities = activities.where(record_type: record_type) if record_type
      activities = activities.where(record_id: record_id) if record_id

      activities.recent
    end
  end
end
