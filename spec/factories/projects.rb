FactoryBot.define do
  factory :project, class: "Core::Project" do
    association :user
    name { Faker::Lorem.words(number: 3).join(" ") }
    description { Faker::Lorem.sentence }

    trait :with_tasks do
      after(:create) do |project|
        create_list(:task, 3, project: project)
      end
    end
  end
end
