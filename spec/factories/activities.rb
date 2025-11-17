FactoryBot.define do
  factory :activity, class: "Core::Activity" do
    association :user
    action { "created" }
    metadata { {} }

    trait :for_project do
      association :record, factory: :project
    end

    trait :for_task do
      association :record, factory: :task
    end

    trait :status_changed do
      action { "status_changed" }
      metadata { { old_status: "pending", new_status: "in_progress" } }
    end
  end
end
