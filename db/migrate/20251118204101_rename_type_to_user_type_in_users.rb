class RenameTypeToUserTypeInUsers < ActiveRecord::Migration[7.2]
  def change
    remove_index :users, :type if index_exists?(:users, :type)
    rename_column :users, :type, :user_type
    add_index :users, :user_type
  end
end
