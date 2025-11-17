module Mutations
  class UpdateTaskStatus < BaseMutation
    description "Update task status using TaskStatusUpdater service"

    argument :id, ID, required: true, description: "Task ID"
    argument :status, Types::StatusEnum, required: true, description: "New status"

    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(id:, status:)
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

      result = Core::TaskStatusUpdater.call(
        task: task,
        new_status: status,
        user: current_user
      )

      if result.success?
        { task: result.data, errors: [] }
      else
        { task: task, errors: result.errors }
      end
    rescue StandardError => e
      Rails.logger.error("UpdateTaskStatus error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { task: nil, errors: ["Unable to update task status: #{e.message}"] }
    end
  end
end
