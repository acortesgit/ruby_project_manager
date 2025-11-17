module Mutations
  class RegisterUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(email:, password:, password_confirmation:)
      # Validate password confirmation manually (Authlogic doesn't provide password_confirmation=)
      if password != password_confirmation
        return { user: nil, errors: ["Password confirmation doesn't match password"] }
      end

      user = User.new(email: email)
      user.password = password

      unless user.save
        { user: nil, errors: user.errors.full_messages }
      else
        _session, session_errors = establish_session(email:, password:)
        if session_errors.any?
          { user:, errors: session_errors }
        else
          { user:, errors: [] }
        end
      end
    rescue StandardError => e
      Rails.logger.error("RegisterUser error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { user: nil, errors: ["Unable to create user. Please try again."] }
    end

    private

    def establish_session(email:, password:)
      controller = context[:controller]
      controller.reset_session if controller.respond_to?(:reset_session)

      user_session = UserSession.new(email:, password:)
      if user_session.save
        context[:current_user_session] = user_session
        context[:current_user] = user_session.record
        [user_session, []]
      else
        [
          nil,
          user_session.errors.full_messages.presence || ["Unable to start session"]
        ]
      end

    rescue StandardError => e
      Rails.logger.error("Authlogic session error: #{e.message}")
      [nil, ["Unable to start session"]]
    end
  end
end

