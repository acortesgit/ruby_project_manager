class User < ApplicationRecord
  acts_as_authentic do |config|
    config.login_field = :email
    config.crypto_provider = Authlogic::CryptoProviders::BCrypt
  end

  before_validation :normalize_email

  # User types
  # Explicitly specify the column name to avoid conflict with Rails' reserved 'type' attribute
  enum :user_type, {
    admin: 1,
    developer: 2
  }

  # Relations
  has_many :projects, foreign_key: :user_id, dependent: :destroy, class_name: "Core::Project"
  has_many :assigned_tasks, as: :assignee, class_name: "Core::Task", dependent: :nullify
  has_many :activities, dependent: :destroy, class_name: "Core::Activity"
  has_many :notifications, dependent: :destroy

  # Helper methods
  def admin?
    user_type == "admin"
  end

  def developer?
    user_type == "developer"
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end




