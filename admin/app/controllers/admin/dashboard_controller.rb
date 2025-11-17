module Admin
  class DashboardController < Admin::ApplicationController
    def index
      @projects_count = Core::Project.count
      @tasks_count = Core::Task.count
      @users_count = User.count
      @activities_count = Core::Activity.count
    end
  end
end
