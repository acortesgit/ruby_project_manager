require "sidekiq"

redis_url = ENV.fetch("REDIS_URL", "redis://localhost:6379/0")

Rails.logger.info("Sidekiq: Configuring with Redis URL: #{redis_url.gsub(/:[^:@]+@/, ':****@')}") if Rails.logger

Sidekiq.configure_server do |config|
  config.redis = { url: redis_url }
  # Use Rails logger for Sidekiq
  config.logger = Rails.logger if Rails.logger
  Rails.logger.info("Sidekiq: Server configured with Rails logger") if Rails.logger
end

Sidekiq.configure_client do |config|
  config.redis = { url: redis_url }
  Rails.logger.info("Sidekiq: Client configured") if Rails.logger
end
