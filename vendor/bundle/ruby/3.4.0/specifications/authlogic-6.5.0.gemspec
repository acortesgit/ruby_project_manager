# -*- encoding: utf-8 -*-
# stub: authlogic 6.5.0 ruby lib

Gem::Specification.new do |s|
  s.name = "authlogic".freeze
  s.version = "6.5.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "rubygems_mfa_required" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Ben Johnson".freeze, "Tieg Zaharia".freeze, "Jared Beck".freeze]
  s.date = "2025-04-11"
  s.email = ["bjohnson@binarylogic.com".freeze, "tieg.zaharia@gmail.com".freeze, "jared@jaredbeck.com".freeze]
  s.homepage = "https://github.com/binarylogic/authlogic".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.6.0".freeze)
  s.rubygems_version = "3.0.3.1".freeze
  s.summary = "An unobtrusive ruby authentication library based on ActiveRecord.".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<activemodel>.freeze, [">= 5.2".freeze, "< 8.1".freeze])
  s.add_runtime_dependency(%q<activerecord>.freeze, [">= 5.2".freeze, "< 8.1".freeze])
  s.add_runtime_dependency(%q<activesupport>.freeze, [">= 5.2".freeze, "< 8.1".freeze])
  s.add_runtime_dependency(%q<request_store>.freeze, ["~> 1.0".freeze])
  s.add_development_dependency(%q<bcrypt>.freeze, ["~> 3.1".freeze])
  s.add_development_dependency(%q<byebug>.freeze, ["~> 11.1.3".freeze])
  s.add_development_dependency(%q<coveralls_reborn>.freeze, ["~> 0.28.0".freeze])
  s.add_development_dependency(%q<minitest>.freeze, ["< 5.19.0".freeze])
  s.add_development_dependency(%q<minitest-reporters>.freeze, ["~> 1.3".freeze])
  s.add_development_dependency(%q<mutex_m>.freeze, ["~> 0.3.0".freeze])
  s.add_development_dependency(%q<rake>.freeze, ["~> 13.0".freeze])
  s.add_development_dependency(%q<rubocop>.freeze, ["~> 0.80.1".freeze])
  s.add_development_dependency(%q<rubocop-performance>.freeze, ["~> 1.1".freeze])
  s.add_development_dependency(%q<scrypt>.freeze, [">= 1.2".freeze, "< 4.0".freeze])
  s.add_development_dependency(%q<simplecov>.freeze, ["~> 0.22.0".freeze])
  s.add_development_dependency(%q<simplecov-console>.freeze, ["~> 0.9.1".freeze])
  s.add_development_dependency(%q<timecop>.freeze, ["~> 0.7".freeze])
end
