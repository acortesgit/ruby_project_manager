module Types
  class NotificationType < Types::BaseObject
    description "A notification for a user"

    field :id, ID, null: false
    field :notification_type, String, null: false, description: "Type of notification (e.g., 'task_assigned', 'task_completed')"
    field :message, String, null: false, description: "Notification message"
    field :read, Boolean, null: false, description: "Whether the notification has been read"
    field :user, Types::UserType, null: false, description: "User who received the notification"
    field :notifiable, Types::NodeType, null: true, description: "The object this notification is about (Task, Project, etc.)"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def user
      object.user
    end

    def notifiable
      object.notifiable
    end
  end
end

