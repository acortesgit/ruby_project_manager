# Service to create a new task with validations
module Core
  class TaskCreator < Core::ApplicationService
    attr_reader :project, :title, :description, :assignee

    def initialize(project:, title:, description: nil, assignee: nil)
      super()
      @project = project
      @title = title
      @description = description
      @assignee = assignee
    end

    def call
      return failure(["Project is required"]) unless project
      return failure(["Title is required"]) if title.blank?

      task = Core::Task.new(
        project: project,
        title: title,
        description: description,
        assignee: assignee,
        status: :pending
      )

      if task.save
        # Get user from project owner or current context
        # For now, use project.user as the actor
        user = project.user

        # Enqueue ActivityLoggerJob to log the creation asynchronously
        ActivityLoggerJob.perform_later(
          record_type: task.class.name,
          record_id: task.id,
          action: "created",
          user_id: user.id,
          metadata: { assignee_id: assignee&.id, assignee_type: assignee&.class&.name }
        )

        # Notify assignee if task is assigned
        if assignee
          NotificationJob.perform_later(
            user_id: assignee.id,
            notification_type: "task_assigned",
            message: "You've been assigned to task: #{task.title} in project #{project.name}",
            notifiable: task
          )
        end

        success(task)
      else
        failure(task.errors.full_messages, task)
      end
    rescue StandardError => e
      Rails.logger.error("TaskCreator error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      failure(["Unable to create task: #{e.message}"])
    end
  end
end
