require "rails_helper"

RSpec.describe Core::Activity, type: :model do
  describe "validations" do
    it { should validate_presence_of(:record_type) }
    it { should validate_presence_of(:record_id) }
    it { should validate_presence_of(:action) }
    it { should validate_presence_of(:user_id) }
  end

  describe "associations" do
    it { should belong_to(:record) }
    it { should belong_to(:user) }
  end

  describe "scopes" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:project) { create(:project, user: user) }
    let(:task) { create(:task, project: project) }

    describe ".by_record" do
      it "returns activities for a specific record" do
        activity1 = create(:activity, user: user, record: project)
        activity2 = create(:activity, user: user, record: project)
        activity3 = create(:activity, user: user, record: task)

        result = Core::Activity.by_record(project).where(id: [activity1.id, activity2.id, activity3.id])
        expect(result).to include(activity1, activity2)
        expect(result).not_to include(activity3)
      end

      it "returns all activities when record is nil" do
        activity1 = create(:activity, user: user, record: project)
        activity2 = create(:activity, user: user, record: task)

        result = Core::Activity.by_record(nil).where(id: [activity1.id, activity2.id])
        expect(result).to include(activity1, activity2)
      end
    end

    describe ".by_user" do
      it "returns activities for a specific user" do
        activity1 = create(:activity, user: user, record: project)
        activity2 = create(:activity, user: user, record: task)
        activity3 = create(:activity, user: other_user, record: project)

        result = Core::Activity.by_user(user).where(id: [activity1.id, activity2.id, activity3.id])
        expect(result).to include(activity1, activity2)
        expect(result).not_to include(activity3)
      end

      it "returns all activities when user is nil" do
        activity1 = create(:activity, user: user, record: project)
        activity2 = create(:activity, user: other_user, record: task)

        result = Core::Activity.by_user(nil).where(id: [activity1.id, activity2.id])
        expect(result).to include(activity1, activity2)
      end
    end

    describe ".recent" do
      it "returns activities ordered by created_at desc" do
        activity1 = create(:activity, user: user, record: project, created_at: 2.days.ago)
        activity2 = create(:activity, user: user, record: task, created_at: 1.day.ago)
        activity3 = create(:activity, user: user, record: project, created_at: 3.days.ago)

        result = Core::Activity.recent.where(id: [activity1.id, activity2.id, activity3.id])
        expect(result.to_a).to eq([activity2, activity1, activity3])
      end
    end

    describe ".by_action" do
      it "returns activities filtered by action" do
        activity1 = create(:activity, user: user, record: project, action: "created")
        activity2 = create(:activity, user: user, record: task, action: "created")
        activity3 = create(:activity, user: user, record: project, action: "updated")

        result = Core::Activity.by_action("created").where(id: [activity1.id, activity2.id, activity3.id])
        expect(result).to include(activity1, activity2)
        expect(result).not_to include(activity3)
      end

      it "returns all activities when action is nil" do
        activity1 = create(:activity, user: user, record: project, action: "created")
        activity2 = create(:activity, user: user, record: task, action: "updated")

        result = Core::Activity.by_action(nil).where(id: [activity1.id, activity2.id])
        expect(result).to include(activity1, activity2)
      end
    end
  end
end
