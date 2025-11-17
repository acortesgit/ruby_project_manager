require "rails_helper"

RSpec.describe Core::Task, type: :model do
  describe "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:status) }
    it { should validate_presence_of(:project_id) }
  end

  describe "associations" do
    it { should belong_to(:project).class_name("Core::Project") }
    it { should belong_to(:assignee).optional }
    # Note: Polymorphic associations are tested manually
    it "has many activities as polymorphic record" do
      task = create(:task)
      activity = create(:activity, record: task)
      expect(task.activities).to include(activity)
    end
  end

  describe "enums" do
    it { should define_enum_for(:status).with_values(pending: 0, in_progress: 1, completed: 2) }
  end

  describe "scopes" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:project) { create(:project, user: user) }

    describe ".recent" do
      it "returns tasks ordered by created_at desc" do
        task1 = create(:task, project: project, created_at: 2.days.ago)
        task2 = create(:task, project: project, created_at: 1.day.ago)
        task3 = create(:task, project: project, created_at: 3.days.ago)

        result = Core::Task.recent.where(id: [task1.id, task2.id, task3.id])
        expect(result.to_a).to eq([task2, task1, task3])
      end
    end

    describe ".assigned_to" do
      it "returns tasks assigned to a specific user" do
        task1 = create(:task, project: project, assignee: user)
        task2 = create(:task, project: project, assignee: other_user)
        task3 = create(:task, project: project, assignee: nil)

        result = Core::Task.assigned_to(user).where(id: [task1.id, task2.id, task3.id])
        expect(result).to include(task1)
        expect(result).not_to include(task2, task3)
      end

      it "returns all tasks when assignee is nil" do
        task1 = create(:task, project: project, assignee: user)
        task2 = create(:task, project: project, assignee: other_user)

        result = Core::Task.assigned_to(nil).where(id: [task1.id, task2.id])
        expect(result).to include(task1, task2)
      end
    end

    describe ".for_project" do
      let(:other_project) { create(:project, user: user) }

      it "returns tasks for a specific project" do
        task1 = create(:task, project: project)
        task2 = create(:task, project: project)
        task3 = create(:task, project: other_project)

        result = Core::Task.for_project(project).where(id: [task1.id, task2.id, task3.id])
        expect(result).to include(task1, task2)
        expect(result).not_to include(task3)
      end

      it "returns all tasks when project is nil" do
        task1 = create(:task, project: project)
        task2 = create(:task, project: other_project)

        result = Core::Task.for_project(nil).where(id: [task1.id, task2.id])
        expect(result).to include(task1, task2)
      end
    end

    describe "status scopes" do
      it "provides scopes for each status" do
        pending_task = create(:task, project: project, status: :pending)
        in_progress_task = create(:task, :in_progress, project: project)
        completed_task = create(:task, :completed, project: project)

        task_ids = [pending_task.id, in_progress_task.id, completed_task.id]

        expect(Core::Task.pending.where(id: task_ids)).to include(pending_task)
        expect(Core::Task.pending.where(id: task_ids)).not_to include(in_progress_task, completed_task)

        expect(Core::Task.in_progress.where(id: task_ids)).to include(in_progress_task)
        expect(Core::Task.in_progress.where(id: task_ids)).not_to include(pending_task, completed_task)

        expect(Core::Task.completed.where(id: task_ids)).to include(completed_task)
        expect(Core::Task.completed.where(id: task_ids)).not_to include(pending_task, in_progress_task)
      end
    end
  end
end
