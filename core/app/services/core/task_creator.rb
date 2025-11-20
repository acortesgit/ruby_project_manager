# Service to create a new task with validations
module Core
  class TaskCreator < Core::ApplicationService
    attr_reader :project, :title, :description, :assignee, :user

    def initialize(project:, title:, description: nil, assignee: nil, user: nil)
      super()
      @project = project
      @title = title
      @description = description
      @assignee = assignee
      @user = user || project.user # Fallback to project owner if user not provided
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
          Rails.logger.info("TaskCreator: Enqueuing notification for assignee User##{assignee.id}")
          job = NotificationJob.perform_later(
            user_id: assignee.id,
            notification_type: "task_assigned",
            message: "You've been assigned to task: #{task.title} in project #{project.name}",
            notifiable: task
          )
          Rails.logger.info("TaskCreator: NotificationJob enqueued with job_id: #{job.job_id rescue 'N/A'}")

          # Notify admin who assigned the task (if different from assignee)
          if user.id != assignee.id
            Rails.logger.info("TaskCreator: Enqueuing notification for admin User##{user.id}")
            job = NotificationJob.perform_later(
              user_id: user.id,
              notification_type: "task_assigned_by_you",
              message: "You assigned task '#{task.title}' to #{assignee.full_name || assignee.email} in project '#{project.name}'",
              notifiable: task
            )
            Rails.logger.info("TaskCreator: NotificationJob enqueued with job_id: #{job.job_id rescue 'N/A'}")
          end
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
