# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # Authentication mutations
    field :register_user, mutation: Mutations::RegisterUser, description: "Create a new user and start a session"
    field :login_user, mutation: Mutations::LoginUser, description: "Authenticate an existing user"
    field :logout_user, mutation: Mutations::LogoutUser, description: "End the current session"
    field :create_user, mutation: Mutations::CreateUser, description: "Create a new user (admin only, requires authentication)"
    field :update_user, mutation: Mutations::UpdateUser, description: "Update an existing user (admin only, requires authentication)"
    field :delete_user, mutation: Mutations::DeleteUser, description: "Delete a user (admin only, requires authentication)"
    field :enqueue_sample_job, mutation: Mutations::EnqueueSampleJob, description: "Queue a demo background job (requires authentication)"

    # Project mutations
    field :create_project, mutation: Mutations::CreateProject, description: "Create a new project (requires authentication)"
    field :update_project, mutation: Mutations::UpdateProject, description: "Update an existing project (requires authentication)"
    field :delete_project, mutation: Mutations::DeleteProject, description: "Delete a project (requires authentication)"

    # Task mutations
    field :create_task, mutation: Mutations::CreateTask, description: "Create a new task in a project (requires authentication)"
    field :update_task, mutation: Mutations::UpdateTask, description: "Update an existing task (requires authentication)"
    field :delete_task, mutation: Mutations::DeleteTask, description: "Delete a task (requires authentication)"
    field :update_task_status, mutation: Mutations::UpdateTaskStatus, description: "Update task status using TaskStatusUpdater service (requires authentication)"

    # Notification mutations
    field :mark_notification_read, mutation: Mutations::MarkNotificationRead, description: "Mark a notification as read (requires authentication)"
    field :mark_all_notifications_read, mutation: Mutations::MarkAllNotificationsRead, description: "Mark all notifications as read for the current user (requires authentication)"
  end
end
