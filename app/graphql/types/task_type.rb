module Types
  class TaskType < Types::BaseObject
    description "A task within a project"

    field :id, ID, null: false
    field :title, String, null: false
    field :description, String, null: true
    field :status, Types::StatusEnum, null: false
    field :project, Types::ProjectType, null: false, description: "Project this task belongs to"
    field :assignee, Types::UserType, null: true, description: "User assigned to this task"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def project
      object.project
    end

    def assignee
      # Task has polymorphic assignee, but currently only User is supported
      object.assignee if object.assignee_type == "User"
    end
  end
end
