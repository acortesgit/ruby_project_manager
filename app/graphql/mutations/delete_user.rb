# frozen_string_literal: true

module Mutations
  class DeleteUser < BaseMutation
    description "Delete a user"

    argument :id, ID, required: true, description: "User ID"

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      current_user = context[:current_user]
      unless current_user
        return { success: false, errors: ["Not authenticated"] }
      end

      # Only admins can delete users
      unless current_user.admin?
        return { success: false, errors: ["Only administrators can delete users"] }
      end

      user = User.find_by(id: id)
      unless user
        return { success: false, errors: ["User not found"] }
      end

      # Prevent deleting the current user
      if user.id == current_user.id
        return { success: false, errors: ["You cannot delete your own account"] }
      end

      if user.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: user.errors.full_messages }
      end
    rescue StandardError => e
      Rails.logger.error("DeleteUser error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      { success: false, errors: ["Unable to delete user: #{e.message}"] }
    end
  end
end

