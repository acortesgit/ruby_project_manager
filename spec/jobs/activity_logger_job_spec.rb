require "rails_helper"

RSpec.describe ActivityLoggerJob, type: :job do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }

  describe "#perform" do
    it "creates an activity for the record" do
      expect {
        described_class.new.perform(
          record_type: "Core::Project",
          record_id: project.id,
          action: "created",
          user_id: user.id,
          metadata: {}
        )
      }.to change { Core::Activity.count }.by(1)

      activity = Core::Activity.last
      expect(activity.record).to eq(project)
      expect(activity.action).to eq("created")
      expect(activity.user).to eq(user)
      expect(activity.metadata).to eq({})
    end

    it "creates an activity with metadata" do
      metadata = { old_status: "pending", new_status: "in_progress" }

      described_class.new.perform(
        record_type: "Core::Project",
        record_id: project.id,
        action: "status_changed",
        user_id: user.id,
        metadata: metadata
      )

      activity = Core::Activity.last
      expect(activity.metadata).to eq(metadata.with_indifferent_access)
    end

    context "when record does not exist" do
      it "logs a warning and returns early" do
        expect(Rails.logger).to receive(:warn).with(/Record not found/)

        expect {
          described_class.new.perform(
            record_type: "Core::Project",
            record_id: 99999,
            action: "created",
            user_id: user.id,
            metadata: {}
          )
        }.not_to change { Core::Activity.count }
      end
    end

    context "when user does not exist" do
      it "logs a warning and returns early" do
        expect(Rails.logger).to receive(:warn).with(/User not found/)

        expect {
          described_class.new.perform(
            record_type: "Core::Project",
            record_id: project.id,
            action: "created",
            user_id: 99999,
            metadata: {}
          )
        }.not_to change { Core::Activity.count }
      end
    end

    context "when an error occurs" do
      it "logs the error and re-raises" do
        allow(Core::Activity).to receive(:create!).and_raise(StandardError.new("Test error"))

        expect {
          described_class.new.perform(
            record_type: "Core::Project",
            record_id: project.id,
            action: "created",
            user_id: user.id,
            metadata: {}
          )
        }.to raise_error(StandardError, "Test error")
      end
    end
  end

  describe "job enqueueing" do
    it "can be enqueued" do
      expect {
        described_class.perform_later(
          record_type: "Core::Project",
          record_id: project.id,
          action: "created",
          user_id: user.id,
          metadata: {}
        )
      }.to have_enqueued_job(described_class)
    end
  end
end
