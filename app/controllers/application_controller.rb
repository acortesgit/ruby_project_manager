class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :activate_authlogic

  helper_method :current_user_session, :current_user

  private

  def activate_authlogic
    Authlogic::Session::Base.controller = Authlogic::ControllerAdapters::RailsAdapter.new(self)
  end

  def current_user_session
    @current_user_session ||= UserSession.find
  end

  def current_user
    @current_user ||= current_user_session&.record
  end

  def require_user!
    return if current_user

    respond_to do |format|
      format.json { render json: { errors: ["Not authorized"] }, status: :unauthorized }
      format.html { redirect_to root_path, alert: "You need to sign in first." }
      format.any { head :unauthorized }
    end
  end
end
