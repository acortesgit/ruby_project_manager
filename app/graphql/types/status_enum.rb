module Types
  class StatusEnum < Types::BaseEnum
    description "Task status"

    value "PENDING", value: "pending", description: "Task is pending"
    value "IN_PROGRESS", value: "in_progress", description: "Task is in progress"
    value "COMPLETED", value: "completed", description: "Task is completed"
  end
end
