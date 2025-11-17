FactoryBot.define do
  factory :task, class: "Core::Task" do
    association :project
    title { Faker::Lorem.sentence(word_count: 4) }
    description { Faker::Lorem.paragraph }
    status { :pending }

    trait :in_progress do
      status { :in_progress }
    end

    trait :completed do
      status { :completed }
    end

    trait :with_assignee do
      association :assignee, factory: :user
    end
  end
end
