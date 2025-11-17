FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { "password123" }
    crypted_password { Authlogic::CryptoProviders::BCrypt.encrypt("password123") }
    password_salt { Authlogic::Random.hex_token }

    trait :with_projects do
      after(:create) do |user|
        create_list(:project, 3, user: user)
      end
    end
  end
end
