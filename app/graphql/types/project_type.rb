module Types
  class ProjectType < Types::BaseObject
    implements Types::NodeType
    description "A project containing multiple tasks"

    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :user, Types::UserType, null: false, description: "Project owner"
    field :tasks, [Types::TaskType], null: false, description: "Tasks in this project"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def user
      object.user
    end

    def tasks
      object.tasks
    end
  end
end
