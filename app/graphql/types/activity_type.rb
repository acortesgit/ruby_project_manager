module Types
  class ActivityType < Types::BaseObject
    description "Activity log entry"

    field :id, ID, null: false
    field :action, String, null: false, description: "Action performed (e.g., 'created', 'updated', 'status_changed')"
    field :user, Types::UserType, null: false, description: "User who performed the action"
    field :metadata, GraphQL::Types::JSON, null: true, description: "Additional metadata about the activity"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false

    # Polymorphic record - we'll return basic info about the record
    field :record_type, String, null: false, description: "Type of record (e.g., 'Project', 'Task')"
    field :record_id, ID, null: false, description: "ID of the record"

    def user
      object.user
    end

    def record_type
      object.record_type
    end

    def record_id
      object.record_id.to_s
    end
  end
end
