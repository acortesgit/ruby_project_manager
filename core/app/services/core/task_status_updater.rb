# Service to update task status and log activity
# Validates status transitions and enqueues ActivityLoggerJob
module Core
  class TaskStatusUpdater < Core::ApplicationService
    attr_reader :task, :new_status, :user

    def initialize(task:, new_status:, user:)
      super()
      @task = task
      @new_status = new_status.to_s
      @user = user
    end

    def call
      return failure(["Task is required"]) unless task
      return failure(["New status is required"]) unless new_status
      return failure(["User is required"]) unless user

      # Validate status transition
      unless valid_status_transition?
        return failure(["Invalid status transition from #{task.status} to #{new_status}"])
      end

      # Store old status for activity log
      old_status = task.status

      # Update task status
      if task.update(status: new_status)
        # Enqueue ActivityLoggerJob to log the change asynchronously
        ActivityLoggerJob.perform_later(
          record_type: task.class.name,
          record_id: task.id,
          action: "status_changed",
          user_id: user.id,
          metadata: { old_status: old_status, new_status: new_status }
        )

        # Notify assignee if task is completed
        if new_status == "completed" && task.assignee
          NotificationJob.perform_later(
            user_id: task.assignee.id,
            notification_type: "task_completed",
            message: "Task '#{task.title}' has been marked as completed",
            notifiable: task
          )
        end

        # Notify project owner if task is completed
        if new_status == "completed" && task.project.user_id != user.id
          NotificationJob.perform_later(
            user_id: task.project.user_id,
            notification_type: "task_completed",
            message: "Task '#{task.title}' in project '#{task.project.name}' has been completed",
            notifiable: task
          )
        end

        success(task)
      else
        failure(task.errors.full_messages, task)
      end
    rescue StandardError => e
      Rails.logger.error("TaskStatusUpdater error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      failure(["Unable to update task status: #{e.message}"])
    end

    private

    def valid_status_transition?
      valid_statuses = Core::Task.statuses.keys
      return false unless valid_statuses.include?(new_status)

      # Allow any valid status transition for now
      # Can be made more restrictive if needed (e.g., only allow specific transitions)
      true
    end
  end
end
