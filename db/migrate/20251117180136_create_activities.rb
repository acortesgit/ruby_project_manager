class CreateActivities < ActiveRecord::Migration[7.2]
  def change
    create_table :activities do |t|
      t.string :record_type, null: false
      t.bigint :record_id, null: false
      t.string :action, null: false
      t.bigint :user_id, null: false
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :activities, [:record_type, :record_id]
    add_index :activities, :user_id
    add_index :activities, :action
    add_index :activities, :created_at
    add_foreign_key :activities, :users, column: :user_id
  end
end
