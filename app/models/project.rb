class Project < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :user_id, presence: true

  # Relations
  belongs_to :user
  has_many :tasks, dependent: :destroy
  has_many :activities, as: :record, dependent: :destroy

  # Scopes
  scope :by_user, ->(user) { where(user: user) if user }
  scope :recent, -> { order(created_at: :desc) }
  scope :with_tasks, -> { joins(:tasks).distinct }
end

