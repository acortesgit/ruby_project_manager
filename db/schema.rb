# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_11_17_180136) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.string "action", null: false
    t.bigint "user_id", null: false
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["action"], name: "index_activities_on_action"
    t.index ["created_at"], name: "index_activities_on_created_at"
    t.index ["record_type", "record_id"], name: "index_activities_on_record_type_and_record_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.integer "status", default: 0, null: false
    t.bigint "project_id", null: false
    t.string "assignee_type"
    t.bigint "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assignee_type", "assignee_id"], name: "index_tasks_on_assignee_type_and_assignee_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.index ["status"], name: "index_tasks_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "crypted_password", null: false
    t.string "password_salt", null: false
    t.string "persistence_token", null: false
    t.string "single_access_token"
    t.string "perishable_token"
    t.integer "login_count", default: 0, null: false
    t.integer "failed_login_count", default: 0, null: false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string "current_login_ip"
    t.string "last_login_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["perishable_token"], name: "index_users_on_perishable_token"
    t.index ["persistence_token"], name: "index_users_on_persistence_token", unique: true
    t.index ["single_access_token"], name: "index_users_on_single_access_token", unique: true
  end

  add_foreign_key "activities", "users"
  add_foreign_key "projects", "users"
  add_foreign_key "tasks", "projects"
end
