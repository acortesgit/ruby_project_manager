# Background job to create notifications asynchronously
# This job creates Notification records for users when events occur
class NotificationJob < ApplicationJob
  queue_as :default

  # Create a notification for a user
  # @param user_id [Integer] The ID of the user to notify
  # @param notification_type [String] The type of notification (e.g., "task_assigned", "task_completed")
  # @param message [String] The notification message
  # @param notifiable [Object] Optional polymorphic object (e.g., Task, Project)
  def perform(user_id:, notification_type:, message:, notifiable: nil)
    # Find the user
    user = User.find_by(id: user_id)
    unless user
      Rails.logger.warn("NotificationJob: User not found - User##{user_id}")
      return
    end

    # Create the notification
    Notification.create!(
      user: user,
      notification_type: notification_type,
      message: message,
      notifiable: notifiable
    )

    Rails.logger.info("NotificationJob: Created notification for User##{user_id} - type: #{notification_type}")
  rescue StandardError => e
    # Log errors but don't fail the job
    Rails.logger.error("NotificationJob error: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    # Re-raise to let Sidekiq handle retries if needed
    raise
  end
end

