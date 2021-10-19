source 'https://rubygems.org'

ruby '2.7.3'

gem 'dry-system', '0.18.1'

gem 'sqlite3'
gem 'sequel'

gem 'blueprinter'
gem 'hanami-controller', '~> 1.3'
gem 'hanami-router', '~> 1.3'
gem 'oj'
gem 'puma'

gem 'activesupport'
gem 'dotenv'
gem 'fhir_client'
gem 'fhir_models', '~> 4.2.0'
gem 'rake'
gem 'faraday'
gem 'sidekiq', '~> 6.2.1'

# TODO: remove with SMART tests
gem 'jwt'

group :development, :test do
  gem 'pry'
  gem 'pry-byebug'
  gem 'rubocop', '~> 1.9'
  gem 'rubocop-rake', require: false
  gem 'rubocop-rspec', require: false
  gem 'rubocop-sequel', require: false
end

group :development do
  gem 'yard'
end

group :test do
  gem 'codecov'
  gem 'database_cleaner-sequel'
  gem 'rack-test'
  gem 'rspec'
  gem 'simplecov'
  gem 'webmock'
  gem 'factory_bot'
end
