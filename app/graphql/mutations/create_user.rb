# frozen_string_literal: true

module Mutations
  class CreateUser < BaseMutation
    argument :full_name, String, required: true
    argument :email, String, required: true
    argument :user_type, Integer, required: false, description: "User type: 1 = Admin, 2 = Developer (default: 2)"

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(full_name:, email:, user_type: 2)
      current_user = context[:current_user]
      return { user: nil, errors: ["You must be authenticated to create users"] } unless current_user

      # Only admins can create users
      return { user: nil, errors: ["Only administrators can create users"] } unless current_user.admin?

      # Validate user_type (must be 1 or 2)
      unless [1, 2].include?(user_type)
        return { user: nil, errors: ["Invalid user type. Must be 1 (Admin) or 2 (Developer)"] }
      end

      # Generate a random password for the new user
      # The user will need to reset their password via email or admin action
      random_password = SecureRandom.hex(16)
      
      user = User.new(
        full_name: full_name,
        email: email,
        user_type: user_type
      )
      user.password = random_password

      unless user.save
        { user: nil, errors: user.errors.full_messages }
      else
        { user:, errors: [] }
      end
    rescue StandardError => e
      Rails.logger.error("CreateUser error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { user: nil, errors: ["Unable to create user. Please try again."] }
    end
  end
end


