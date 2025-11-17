# -*- encoding: utf-8 -*-
# stub: grover 1.2.4 ruby lib

Gem::Specification.new do |s|
  s.name = "grover".freeze
  s.version = "1.2.4".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "allowed_push_host" => "https://rubygems.org", "rubygems_mfa_required" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Andrew Bromwich".freeze]
  s.date = "2025-11-04"
  s.description = "Transform HTML into PDF/PNG/JPEG using Google Puppeteer/Chromium".freeze
  s.email = ["abromwich@studiosity.com".freeze]
  s.homepage = "https://github.com/Studiosity/grover".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new([">= 3.0.0".freeze, "< 3.5.0".freeze])
  s.rubygems_version = "3.3.7".freeze
  s.summary = "A Ruby gem to transform HTML into PDF, PNG or JPEG by wrapping the NodeJS Google Puppeteer driver for Chromium".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<nokogiri>.freeze, ["~> 1".freeze])
end
