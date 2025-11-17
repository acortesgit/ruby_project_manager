module Mutations
  class DeleteTask < BaseMutation
    description "Delete a task"

    argument :id, ID, required: true, description: "Task ID"

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      current_user = context[:current_user]
      unless current_user
        return { success: false, errors: ["Not authenticated"] }
      end

      task = Core::Task.find_by(id: id)
      unless task
        return { success: false, errors: ["Task not found"] }
      end

      unless task.project.user_id == current_user.id
        return { success: false, errors: ["Not authorized to delete this task"] }
      end

      if task.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: task.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("DeleteTask error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { success: false, errors: ["Unable to delete task: #{e.message}"] }
    end
  end
end
