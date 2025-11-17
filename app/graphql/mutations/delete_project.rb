module Mutations
  class DeleteProject < BaseMutation
    description "Delete a project"

    argument :id, ID, required: true, description: "Project ID"

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      current_user = context[:current_user]
      unless current_user
        return { success: false, errors: ["Not authenticated"] }
      end

      project = Core::Project.find_by(id: id)
      unless project
        return { success: false, errors: ["Project not found"] }
      end

      unless project.user_id == current_user.id
        return { success: false, errors: ["Not authorized to delete this project"] }
      end

      if project.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: project.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("DeleteProject error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { success: false, errors: ["Unable to delete project: #{e.message}"] }
    end
  end
end
