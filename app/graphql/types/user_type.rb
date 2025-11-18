module Types
  class UserType < Types::BaseObject
    description "Application user"

    field :id, ID, null: false
    field :email, String, null: false
    field :user_type, Integer, null: false, description: "User type: 1 = Admin, 2 = Developer"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end




