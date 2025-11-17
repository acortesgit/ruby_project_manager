module Mutations
  class LogoutUser < BaseMutation
    field :success, Boolean, null: false

    def resolve
      if (user_session = context[:current_user_session])
        user_session.destroy
      end

      controller = context[:controller]
      controller.reset_session if controller.respond_to?(:reset_session)

      context[:current_user] = nil
      context[:current_user_session] = nil

      { success: true }
    end
  end
end




