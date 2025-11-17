class User < ApplicationRecord
  acts_as_authentic do |config|
    config.login_field = :email
    config.crypto_provider = Authlogic::CryptoProviders::BCrypt
  end

  before_validation :normalize_email

  # Relations
  has_many :projects, foreign_key: :user_id, dependent: :destroy, class_name: "Project"
  has_many :assigned_tasks, as: :assignee, class_name: "Task", dependent: :nullify
  has_many :activities, dependent: :destroy, class_name: "Activity"

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end




