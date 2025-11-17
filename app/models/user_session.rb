class UserSession < Authlogic::Session::Base
  record_selection_method :find_by_email

  def to_key
    new_record? ? nil : [id]
  end
end

