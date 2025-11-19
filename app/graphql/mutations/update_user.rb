# frozen_string_literal: true

module Mutations
  class UpdateUser < BaseMutation
    argument :id, ID, required: true
    argument :full_name, String, required: false
    argument :email, String, required: false
    argument :user_type, Integer, required: false, description: "User type: 1 = Admin, 2 = Developer"

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(id:, full_name: nil, email: nil, user_type: nil)
      current_user = context[:current_user]
      return { user: nil, errors: ["You must be authenticated to update users"] } unless current_user

      # Only admins can update users
      return { user: nil, errors: ["Only administrators can update users"] } unless current_user.admin?

      user = User.find_by(id: id)
      unless user
        return { user: nil, errors: ["User not found"] }
      end

      # Prevent updating the current user's own user_type
      if user_type && user.id == current_user.id
        return { user: nil, errors: ["You cannot change your own user type"] }
      end

      # Validate user_type if provided
      if user_type && ! [1, 2].include?(user_type)
        return { user: nil, errors: ["Invalid user type. Must be 1 (Admin) or 2 (Developer)"] }
      end

      user.full_name = full_name if full_name
      user.email = email if email
      user.user_type = user_type if user_type

      unless user.save
        { user: nil, errors: user.errors.full_messages }
      else
        { user:, errors: [] }
      end
    rescue StandardError => e
      Rails.logger.error("UpdateUser error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { user: nil, errors: ["Unable to update user. Please try again."] }
    end
  end
end

