# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :register_user, mutation: Mutations::RegisterUser, description: "Create a new user and start a session"
    field :login_user, mutation: Mutations::LoginUser, description: "Authenticate an existing user"
    field :logout_user, mutation: Mutations::LogoutUser, description: "End the current session"
    field :enqueue_sample_job, mutation: Mutations::EnqueueSampleJob, description: "Queue a demo background job (requires authentication)"
  end
end
