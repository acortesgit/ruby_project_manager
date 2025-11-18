class AddTypeToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :type, :integer, default: 2, null: false
    add_index :users, :type
  end
end
