module Core
  class Activity < Core::ApplicationRecord
    self.table_name = "activities"

    # Validations
    validates :record_type, presence: true
    validates :record_id, presence: true
    validates :action, presence: true
    validates :user_id, presence: true

    # Relations
    belongs_to :record, polymorphic: true
    belongs_to :user, class_name: "User"

    # Scopes
    scope :by_record, ->(record) { where(record_type: record.class.name, record_id: record.id) if record }
    scope :by_user, ->(user) { where(user: user) if user }
    scope :recent, -> { order(created_at: :desc) }
    scope :by_action, ->(action) { where(action: action) if action }
  end
end
