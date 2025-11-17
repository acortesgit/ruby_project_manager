# Service to create a new project with validations
class ProjectCreator < ApplicationService
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

    project = user.projects.build(
      name: name,
      description: description
    )

    if project.save
      # Log activity
      Activity.create!(
        record: project,
        action: "created",
        user: user,
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
