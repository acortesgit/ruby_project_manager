module Core
  class Project < Core::ApplicationRecord
    self.table_name = "projects"

    # Validations
    validates :name, presence: true
    validates :user_id, presence: true

    # Relations
    belongs_to :user, class_name: "User"
    has_many :tasks, class_name: "Core::Task", foreign_key: :project_id, dependent: :destroy
    has_many :activities, as: :record, class_name: "Core::Activity", dependent: :destroy

    # Scopes
    scope :by_user, ->(user) { where(user: user) if user }
    scope :recent, -> { order(created_at: :desc) }
    scope :with_tasks, -> { joins(:tasks).distinct }
  end
end
