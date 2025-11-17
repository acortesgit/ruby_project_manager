# Service to create a new project with validations
module Core
  class ProjectCreator < Core::ApplicationService
    attr_reader :user, :name, :description

    def initialize(user:, name:, description: nil)
      super()
      @user = user
      @name = name
      @description = description
    end

    def call
      return failure(["User is required"]) unless user
      return failure(["Name is required"]) if name.blank?

      project = Core::Project.new(
        user: user,
        name: name,
        description: description
      )

      if project.save
        # Enqueue ActivityLoggerJob to log the creation asynchronously
        ActivityLoggerJob.perform_later(
          record_type: project.class.name,
          record_id: project.id,
          action: "created",
          user_id: user.id,
          metadata: {}
        )

        success(project)
      else
        failure(project.errors.full_messages, project)
      end
    rescue StandardError => e
      Rails.logger.error("ProjectCreator error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      failure(["Unable to create project: #{e.message}"])
    end
  end
end
