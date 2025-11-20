# Background job to log activities asynchronously
# This job creates Activity records for tracking changes to Projects, Tasks, etc.
class ActivityLoggerJob < ApplicationJob
  queue_as :default

  # Log an activity for a record
  # @param record_type [String] The class name of the record (e.g., "Core::Project", "Core::Task")
  # @param record_id [Integer] The ID of the record
  # @param action [String] The action performed (e.g., "created", "updated", "status_changed")
  # @param user_id [Integer] The ID of the user who performed the action
  # @param metadata [Hash] Additional metadata about the activity (default: {})
  def perform(record_type:, record_id:, action:, user_id:, metadata: {})
    Rails.logger.info("ActivityLoggerJob: Starting - Record: #{record_type}##{record_id}, Action: #{action}, User: #{user_id}")
    
    # Find the record
    record_class = record_type.constantize
    record = record_class.find_by(id: record_id)

    unless record
      Rails.logger.warn("ActivityLoggerJob: Record not found - #{record_type}##{record_id}")
      return
    end

    # Find the user
    user = User.find_by(id: user_id)
    unless user
      Rails.logger.warn("ActivityLoggerJob: User not found - User##{user_id}")
      return
    end

    # Create the activity
    Core::Activity.create!(
      record: record,
      action: action,
      user: user,
      metadata: metadata || {}
    )

    Rails.logger.info("ActivityLoggerJob: Created activity for #{record_type}##{record_id} - action: #{action}")
  rescue StandardError => e
    # Log errors but don't fail the job
    Rails.logger.error("ActivityLoggerJob error: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    # Re-raise to let Sidekiq handle retries if needed
    raise
  end
end
