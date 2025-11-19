class CreateNotifications < ActiveRecord::Migration[7.2]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :notification_type, null: false
      t.text :message, null: false
      t.boolean :read, default: false, null: false
      t.references :notifiable, polymorphic: true, null: true, index: true

      t.timestamps
    end

    add_index :notifications, :read
  end
end

