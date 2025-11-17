module Mutations
  class CreateProject < BaseMutation
    description "Create a new project"

    argument :name, String, required: true, description: "Project name"
    argument :description, String, required: false, description: "Project description"

    field :project, Types::ProjectType, null: true
    field :errors, [String], null: false

    def resolve(name:, description: nil)
      current_user = context[:current_user]
      unless current_user
        return { project: nil, errors: ["Not authenticated"] }
      end

      result = Core::ProjectCreator.call(
        user: current_user,
        name: name,
        description: description
      )

      if result.success?
        { project: result.data, errors: [] }
      else
        { project: nil, errors: result.errors }
      end
    rescue StandardError => e
      Rails.logger.error("CreateProject error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { project: nil, errors: ["Unable to create project: #{e.message}"] }
    end
  end
end
