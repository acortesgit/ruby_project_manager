module Mutations
  class UpdateProject < BaseMutation
    description "Update an existing project"

    argument :id, ID, required: true, description: "Project ID"
    argument :name, String, required: false, description: "Project name"
    argument :description, String, required: false, description: "Project description"

    field :project, Types::ProjectType, null: true
    field :errors, [String], null: false

    def resolve(id:, name: nil, description: nil)
      current_user = context[:current_user]
      unless current_user
        return { project: nil, errors: ["Not authenticated"] }
      end

      project = Core::Project.find_by(id: id)
      unless project
        return { project: nil, errors: ["Project not found"] }
      end

      unless project.user_id == current_user.id
        return { project: nil, errors: ["Not authorized to update this project"] }
      end

      attributes = {}
      attributes[:name] = name if name.present?
      attributes[:description] = description if description.present?

      if project.update(attributes)
        # Enqueue ActivityLoggerJob to log the update asynchronously
        ActivityLoggerJob.perform_later(
          record_type: project.class.name,
          record_id: project.id,
          action: "updated",
          user_id: current_user.id,
          metadata: {}
        )

        { project: project, errors: [] }
      else
        { project: project, errors: project.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("UpdateProject error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { project: nil, errors: ["Unable to update project: #{e.message}"] }
    end
  end
end
