begin
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
  task default: :spec
rescue LoadError # rubocop:disable Lint/SuppressedException
end

namespace :db do
  desc 'Apply changes to the database'
  task :migrate do
    require_relative 'lib/inferno/config/application'
    require_relative 'lib/inferno/apps/cli/migration'

    Inferno::CLI::Migration.new.run
  end
end
