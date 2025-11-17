module Mutations
  class CreateTask < BaseMutation
    description "Create a new task in a project"

    argument :project_id, ID, required: true, description: "Project ID"
    argument :title, String, required: true, description: "Task title"
    argument :description, String, required: false, description: "Task description"
    argument :assignee_id, ID, required: false, description: "User ID to assign the task to"

    field :task, Types::TaskType, null: true
    field :errors, [String], null: false

    def resolve(project_id:, title:, description: nil, assignee_id: nil)
      current_user = context[:current_user]
      unless current_user
        return { task: nil, errors: ["Not authenticated"] }
      end

      project = Core::Project.find_by(id: project_id)
      unless project
        return { task: nil, errors: ["Project not found"] }
      end

      unless project.user_id == current_user.id
        return { task: nil, errors: ["Not authorized to create tasks in this project"] }
      end

      assignee = User.find_by(id: assignee_id) if assignee_id

      result = Core::TaskCreator.call(
        project: project,
        title: title,
        description: description,
        assignee: assignee
      )

      if result.success?
        { task: result.data, errors: [] }
      else
        { task: nil, errors: result.errors }
      end
    rescue StandardError => e
      Rails.logger.error("CreateTask error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { task: nil, errors: ["Unable to create task: #{e.message}"] }
    end
  end
end
