class CreateTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.integer :status, null: false, default: 0
      t.bigint :project_id, null: false
      t.string :assignee_type
      t.bigint :assignee_id

      t.timestamps
    end

    add_index :tasks, :project_id
    add_index :tasks, [:assignee_type, :assignee_id]
    add_index :tasks, :status
    add_foreign_key :tasks, :projects, column: :project_id
  end
end
