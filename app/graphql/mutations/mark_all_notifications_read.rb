module Mutations
  class MarkAllNotificationsRead < BaseMutation
    description "Mark all notifications as read for the current user"

    field :success, Boolean, null: false
    field :count, Integer, null: false, description: "Number of notifications marked as read"
    field :errors, [String], null: false

    def resolve
      current_user = context[:current_user]
      unless current_user
        return { success: false, count: 0, errors: ["Not authenticated"] }
      end

      unread_notifications = Notification.for_user(current_user).unread
      count = unread_notifications.count

      if unread_notifications.update_all(read: true) >= 0
        { success: true, count: count, errors: [] }
      else
        { success: false, count: 0, errors: ["Unable to mark notifications as read"] }
      end
    rescue StandardError => e
      Rails.logger.error("MarkAllNotificationsRead error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { success: false, count: 0, errors: ["Unable to mark notifications as read: #{e.message}"] }
    end
  end
end

