module Core
  class Task < Core::ApplicationRecord
    self.table_name = "tasks"

    # Enums
    enum status: {
      pending: 0,
      in_progress: 1,
      completed: 2
    }

    # Validations
    validates :title, presence: true
    validates :status, presence: true
    validates :project_id, presence: true

    # Relations
    belongs_to :project, class_name: "Core::Project"
    belongs_to :assignee, polymorphic: true, optional: true
    has_many :activities, as: :record, class_name: "Core::Activity", dependent: :destroy

    # Scopes
    # Note: .pending, .in_progress, .completed are provided by enum
    scope :recent, -> { order(created_at: :desc) }
    scope :assigned_to, ->(assignee) { where(assignee: assignee) if assignee }
    scope :for_project, ->(project) { where(project: project) if project }
  end
end
