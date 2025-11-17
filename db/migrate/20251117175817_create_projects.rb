class CreateProjects < ActiveRecord::Migration[7.2]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.text :description
      t.bigint :user_id, null: false

      t.timestamps
    end

    add_index :projects, :user_id
    add_foreign_key :projects, :users, column: :user_id
  end
end
