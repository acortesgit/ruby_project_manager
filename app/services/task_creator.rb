# Service to create a new task with validations
class TaskCreator < ApplicationService
  attr_reader :project, :title, :description, :assignee

  def initialize(project:, title:, description: nil, assignee: nil)
    super()
    @project = project
    @title = title
    @description = description
    @assignee = assignee
  end

  def call
    return failure(["Project is required"]) unless project
    return failure(["Title is required"]) if title.blank?

    task = project.tasks.build(
      title: title,
      description: description,
      assignee: assignee,
      status: :pending
    )

    if task.save
      # Get user from project owner or current context
      # For now, use project.user as the actor
      user = project.user

      # Log activity
      Activity.create!(
        record: task,
        action: "created",
        user: user,
        metadata: { assignee_id: assignee&.id, assignee_type: assignee&.class&.name }
      )

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
