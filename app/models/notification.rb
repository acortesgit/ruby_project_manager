class Notification < ApplicationRecord
  # Validations
  validates :user_id, presence: true
  validates :notification_type, presence: true
  validates :message, presence: true

  # Relations
  belongs_to :user
  belongs_to :notifiable, polymorphic: true, optional: true

  # Scopes
  scope :unread, -> { where(read: false) }
  scope :read, -> { where(read: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :for_user, ->(user) { user ? where(user: user) : none }
  scope :by_type, ->(notification_type) { notification_type ? where(notification_type: notification_type) : all }

  # Instance methods
  def mark_as_read!
    update(read: true)
  end

  def mark_as_unread!
    update(read: false)
  end
end

