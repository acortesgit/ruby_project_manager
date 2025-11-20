module Mutations
  class UpdateTask < BaseMutation
    description "Update an existing task"

    argument :id, ID, required: true, description: "Task ID"
    argument :title, String, required: false, description: "Task title"
    argument :description, String, required: false, description: "Task description"
    argument :status, Types::StatusEnum, required: false, description: "Task status"
    argument :assignee_id, ID, required: false, description: "User ID to assign the task to"

    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(id:, title: nil, description: nil, status: nil, assignee_id: nil)
      current_user = context[:current_user]
      unless current_user
        return { task: nil, errors: ["Not authenticated"] }
      end

      task = Core::Task.find_by(id: id)
      unless task
        return { task: nil, errors: ["Task not found"] }
      end

      unless task.project.user_id == current_user.id
        return { task: nil, errors: ["Not authorized to update this task"] }
      end

      attributes = {}
      attributes[:title] = title if title.present?
      attributes[:description] = description if description.present?
      attributes[:status] = status if status.present?

      # Track if assignee is changing
      old_assignee = task.assignee
      assignee_changed = false

      if assignee_id.present?
        assignee = User.find_by(id: assignee_id)
        if assignee
          assignee_changed = (old_assignee != assignee)
          attributes[:assignee] = assignee
        end
      end

      if task.update(attributes)
        # Enqueue ActivityLoggerJob to log the update asynchronously
        ActivityLoggerJob.perform_later(
          record_type: task.class.name,
          record_id: task.id,
          action: "updated",
          user_id: current_user.id,
          metadata: {}
        )

        # Notify new assignee if task was assigned
        if assignee_changed && task.assignee
          NotificationJob.perform_later(
            user_id: task.assignee.id,
            notification_type: "task_assigned",
            message: "You've been assigned to task: #{task.title} in project #{task.project.name}",
            notifiable: task
          )

          # Notify admin who assigned the task (if different from assignee)
          if current_user.id != task.assignee.id
            NotificationJob.perform_later(
              user_id: current_user.id,
              notification_type: "task_assigned_by_you",
              message: "You assigned task '#{task.title}' to #{task.assignee.full_name || task.assignee.email} in project '#{task.project.name}'",
              notifiable: task
            )
          end
        end

        # Notify if task status changed to completed
        if status == "completed"
          # Notify assignee if different from current user
          if task.assignee && task.assignee.id != current_user.id
            NotificationJob.perform_later(
              user_id: task.assignee.id,
              notification_type: "task_completed",
              message: "Task '#{task.title}' has been marked as completed",
              notifiable: task
            )
          end

          # Notify project owner if different from current user and assignee
          if task.project.user && task.project.user.id != current_user.id && task.project.user.id != task.assignee&.id
            NotificationJob.perform_later(
              user_id: task.project.user.id,
              notification_type: "task_completed_project_owner",
              message: "Task '#{task.title}' in your project '#{task.project.name}' has been completed.",
              notifiable: task
            )
          end

          # Notify admin who completed the task (if different from assignee and project owner)
          if current_user.id != task.assignee&.id && current_user.id != task.project.user_id
            NotificationJob.perform_later(
              user_id: current_user.id,
              notification_type: "task_completed_by_you",
              message: "You marked task '#{task.title}' as completed in project '#{task.project.name}'",
              notifiable: task
            )
          end
        end

        { task: task, errors: [] }
      else
        { task: task, errors: task.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("UpdateTask error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { task: nil, errors: ["Unable to update task: #{e.message}"] }
    end
  end
end
