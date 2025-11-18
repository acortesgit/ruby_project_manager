class ChangeUserTypeDefaultToAdmin < ActiveRecord::Migration[7.2]
  def change
    change_column_default :users, :user_type, from: 2, to: 1
  end
end
