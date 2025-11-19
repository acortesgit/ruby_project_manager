class CreateUserTypes < ActiveRecord::Migration[7.2]
  def up
    create_table :user_types do |t|
      t.string :name, null: false
      t.timestamps
    end

    add_index :user_types, :name, unique: true

    # Insert initial data
    execute <<-SQL
      INSERT INTO user_types (id, name, created_at, updated_at) VALUES
      (1, 'Admin', NOW(), NOW()),
      (2, 'Developer', NOW(), NOW());
    SQL
  end

  def down
    drop_table :user_types
  end
end
