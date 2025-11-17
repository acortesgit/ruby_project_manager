require "rails_helper"

RSpec.describe Core::Project, type: :model do
  describe "validations" do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:user_id) }
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:tasks).class_name("Core::Task").dependent(:destroy) }
    # Note: Polymorphic associations are tested manually
    it "has many activities as polymorphic record" do
      project = create(:project)
      activity = create(:activity, record: project)
      expect(project.activities).to include(activity)
    end
  end

  describe "scopes" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    describe ".by_user" do
      it "returns projects for a specific user" do
        project1 = create(:project, user: user)
        project2 = create(:project, user: user)
        project3 = create(:project, user: other_user)

        expect(Core::Project.by_user(user)).to include(project1, project2)
        expect(Core::Project.by_user(user)).not_to include(project3)
      end

      it "returns all projects when user is nil" do
        project1 = create(:project, user: user)
        project2 = create(:project, user: other_user)

        result = Core::Project.by_user(nil)
        expect(result).to include(project1, project2)
      end
    end

    describe ".recent" do
      it "returns projects ordered by created_at desc" do
        project1 = create(:project, user: user, created_at: 2.days.ago)
        project2 = create(:project, user: user, created_at: 1.day.ago)
        project3 = create(:project, user: user, created_at: 3.days.ago)

        result = Core::Project.recent.where(id: [project1.id, project2.id, project3.id])
        expect(result.to_a).to eq([project2, project1, project3])
      end
    end

    describe ".with_tasks" do
      it "returns only projects that have tasks" do
        project_with_tasks = create(:project, user: user)
        create(:task, project: project_with_tasks)
        project_without_tasks = create(:project, user: user)

        result = Core::Project.with_tasks.where(id: [project_with_tasks.id, project_without_tasks.id])
        expect(result).to include(project_with_tasks)
        expect(result).not_to include(project_without_tasks)
      end
    end
  end
end
