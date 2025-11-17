require "rails_helper"

RSpec.describe Core::TaskStatusUpdater, type: :service do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:task) { create(:task, project: project, status: :pending) }

  describe ".call" do
    context "with valid status transition" do
      it "updates the task status" do
        result = described_class.call(task: task, new_status: :in_progress, user: user)

        expect(result.success?).to be true
        expect(result.data).to eq(task.reload)
        expect(task.reload.status).to eq("in_progress")
      end

      it "enqueues ActivityLoggerJob" do
        expect {
          described_class.call(task: task, new_status: :in_progress, user: user)
        }.to have_enqueued_job(ActivityLoggerJob)
          .with(
            record_type: "Core::Task",
            record_id: task.id,
            action: "status_changed",
            user_id: user.id,
            metadata: { old_status: "pending", new_status: "in_progress" }
          )
      end
    end

    context "with invalid status" do
      it "returns failure with error message" do
        result = described_class.call(task: task, new_status: "invalid_status", user: user)

        expect(result.success?).to be false
        expect(result.errors).to include(/Invalid status transition/)
      end
    end

    context "with missing task" do
      it "returns failure with error message" do
        result = described_class.call(task: nil, new_status: :in_progress, user: user)

        expect(result.success?).to be false
        expect(result.errors).to include("Task is required")
      end
    end

    context "with missing user" do
      it "returns failure with error message" do
        result = described_class.call(task: task, new_status: :in_progress, user: nil)

        expect(result.success?).to be false
        expect(result.errors).to include("User is required")
      end
    end

    context "status transitions" do
      it "allows transition from pending to in_progress" do
        task = create(:task, project: project, status: :pending)
        result = described_class.call(task: task, new_status: :in_progress, user: user)

        expect(result.success?).to be true
        expect(task.reload.status).to eq("in_progress")
      end

      it "allows transition from in_progress to completed" do
        task = create(:task, project: project, status: :in_progress)
        result = described_class.call(task: task, new_status: :completed, user: user)

        expect(result.success?).to be true
        expect(task.reload.status).to eq("completed")
      end

      it "allows transition from pending to completed" do
        task = create(:task, project: project, status: :pending)
        result = described_class.call(task: task, new_status: :completed, user: user)

        expect(result.success?).to be true
        expect(task.reload.status).to eq("completed")
      end
    end
  end
end
