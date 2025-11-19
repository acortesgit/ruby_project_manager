module Mutations
  class MarkNotificationRead < BaseMutation
    description "Mark a notification as read"

    argument :id, ID, required: true, description: "Notification ID"

    field :notification, Types::NotificationType, null: true
    field :errors, [String], null: false

    def resolve(id:)
      current_user = context[:current_user]
      unless current_user
        return { notification: nil, errors: ["Not authenticated"] }
      end

      notification = Notification.find_by(id: id)
      unless notification
        return { notification: nil, errors: ["Notification not found"] }
      end

      unless notification.user_id == current_user.id
        return { notification: nil, errors: ["Not authorized to update this notification"] }
      end

      if notification.mark_as_read!
        { notification: notification, errors: [] }
      else
        { notification: notification, errors: notification.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("MarkNotificationRead error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { notification: nil, errors: ["Unable to mark notification as read: #{e.message}"] }
    end
  end
end

