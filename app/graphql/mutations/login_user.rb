module Mutations
  class LoginUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      controller = context[:controller]
      controller.reset_session if controller.respond_to?(:reset_session)

      user_session = UserSession.new(email:, password:)

      if user_session.save
        context[:current_user_session] = user_session
        context[:current_user] = user_session.record
        { user: user_session.record, errors: [] }
      else
        { user: nil, errors: user_session.errors.full_messages.presence || ["Invalid email or password"] }
      end
    end
  end
end




