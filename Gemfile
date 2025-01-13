source 'https://rubygems.org'

ruby '3.1.2'

gemspec

# To test with the g10 test kit (this also adds the US Core, SMART, and TLS test
# kits):
# - Uncomment this line (and change test kit gem as necessary):
gem 'smart_app_launch_test_kit',
    git: 'https://github.com/inferno-framework/smart-app-launch-test-kit.git',
    branch: 'fi-3093-use-auth-info'

gem 'us_core_test_kit',
    git: 'https://github.com/inferno-framework/us-core-test-kit.git',
    branch: 'fi-3586-migrate-to-authinfo'

gem 'onc_certification_g10_test_kit',
    git: 'https://github.com/onc-healthit/onc-certification-g10-test-kit.git',
    branch: 'fi-3587-debug'

# - Run `bundle`
# - Uncomment (and change as necessary) the require at the top of
# `dev_suites/dev_demo_ig_stu1/demo_suite.rb`.

group :development, :test do
  gem 'debug'
  gem 'rubocop', '~> 1.9'
  gem 'rubocop-rake', require: false
  gem 'rubocop-rspec', require: false
  gem 'rubocop-sequel', require: false
end

group :development do
  gem 'yard'
  gem 'yard-junk'
end

group :test do
  gem 'codecov', '0.5.2'
  gem 'database_cleaner-sequel'
  gem 'factory_bot', '~> 6.1'
  gem 'rack-test'
  gem 'rspec', '~> 3.10'
  gem 'simplecov', '0.21.2', require: false
  gem 'simplecov-cobertura'
  gem 'webmock', '~> 3.11'
end
