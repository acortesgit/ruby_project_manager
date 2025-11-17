class SampleJob < ApplicationJob
  queue_as :default

  def perform(user_id: nil, message: "Hello from Sidekiq")
    user = User.find_by(id: user_id) if user_id
    user_info = user ? " (user: #{user.email})" : ""
    Rails.logger.info("[SampleJob] #{message}#{user_info}")
  end
end




