require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    # Note: Authlogic handles email validation internally
    # These tests verify basic functionality
    it "can be created with a valid email and password" do
      user = create(:user)
      expect(user).to be_valid
      expect(user.email).to be_present
    end

    it "normalizes email addresses (handled by #normalize_email)" do
      user = build(:user, email: "TEST@EXAMPLE.COM")
      user.valid?
      expect(user.email).to eq("test@example.com")
    end

    it "prevents duplicate emails" do
      create(:user, email: "test@example.com")
      user = build(:user, email: "test@example.com")
      # Authlogic handles uniqueness validation internally
      expect { user.save }.to raise_error(ActiveRecord::RecordInvalid).or(change { User.count }.by(0))
    end
  end

  describe "associations" do
    it { should have_many(:projects).with_foreign_key(:user_id).class_name("Core::Project").dependent(:destroy) }
    it { should have_many(:assigned_tasks).class_name("Core::Task").dependent(:nullify) }
    it { should have_many(:activities).class_name("Core::Activity").dependent(:destroy) }
  end

  describe "#normalize_email" do
    it "normalizes email to lowercase" do
      user = build(:user, email: "TEST@EXAMPLE.COM")
      user.valid?
      expect(user.email).to eq("test@example.com")
    end

    it "strips whitespace from email" do
      user = build(:user, email: "  test@example.com  ")
      user.valid?
      expect(user.email).to eq("test@example.com")
    end
  end
end
