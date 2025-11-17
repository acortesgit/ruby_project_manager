module Admin
  class ReportsController < Admin::ApplicationController
    def index
      @recent_projects = Core::Project.recent.limit(10)
      @recent_tasks = Core::Task.recent.limit(10)
      @recent_activities = Core::Activity.recent.limit(20)
    end
  end
end
