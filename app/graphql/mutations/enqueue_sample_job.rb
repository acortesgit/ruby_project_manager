module Mutations
  class EnqueueSampleJob < BaseMutation
    argument :message, String, required: false,
      description: "Optional message that will be logged by the job"

    field :queued, Boolean, null: false
    field :job_id, String, null: true
    field :errors, [String], null: false

    def resolve(message: "Scheduled via GraphQL")
      user = context[:current_user]

      unless user
        return { queued: false, job_id: nil, errors: ["Not authorized"] }
      end

      job = SampleJob.perform_later(user_id: user.id, message:)

      { queued: true, job_id: job.job_id, errors: [] }
    rescue StandardError => e
      Rails.logger.error("EnqueueSampleJob error: #{e.message}")
      { queued: false, job_id: nil, errors: ["Unable to enqueue job"] }
    end
  end
end




