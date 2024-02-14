require 'thor'
require 'bundler'
require_relative '../../utils/named_thor_actions'
require_relative '../../utils/ig_downloader'
require_relative '../../version'

module Inferno
  module CLI
    class New < Thor::Group
      include Thor::Actions
      include Inferno::Utils::NamedThorActions
      include Inferno::Utils::IgDownloader

      desc <<~HELP
        Generate a new Inferno test kit for FHIR software testing

        Examples:

          `inferno new test_fhir_app`
            => generates an Inferno app

          `inferno new test_my_ig -a MyName`
            => generates Inferno app and specifies MyName as gemspec author

        https://inferno-framework.github.io/index.html
      HELP

      def self.banner
        'inferno new TEST_KIT_NAME'
      end

      def self.source_root
        File.join(__dir__, 'templates')
      end

      argument :name,
               type: :string,
               required: true,
               desc: 'name for new Inferno project'
      class_option :author,
                   type: :string,
                   aliases: '-a',
                   default: [],
                   repeatable: true,
                   desc: "Author names for gemspec file; you may use '-a' multiple times"
      class_option :skip_bundle,
                   type: :boolean,
                   aliases: '-b',
                   default: false,
                   desc: 'Do not run bundle install'
      class_option :implementation_guide,
                   type: :string,
                   aliases: '-i',
                   repeatable: true,
                   desc: 'Load an Implementation Guide by FHIR Registry name, URL, or absolute path'

      add_runtime_options!

      def create_app
        directory('.', root_name, { mode: :preserve, recursive: true, verbose: !options['quiet'] })

        inside(root_name) do
          bundle_install
          inferno_migrate
          load_igs
        end

        say_unless_quiet "Created #{root_name} Inferno test kit!", :green

        return unless options['pretend']

        say_unless_quiet 'This was a dry run; re-run without `--pretend` to actually create project',
                         :yellow
      end

      private

      def authors
        options['author'].presence || [default_author]
      end

      def default_author
        ENV['USER'] || ENV['USERNAME'] || 'PUT_YOUR_NAME_HERE'
      end

      def bundle_install
        return if options['skip_bundle']

        Bundler.with_unbundled_env do
          run 'bundle install', verbose: !options['quiet'], capture: options['quiet']
        end
      end

      def inferno_migrate
        return if options['skip_bundle']

        run 'bundle exec inferno migrate', verbose: !options['quiet'], capture: options['quiet']
      end

      def load_igs
        config = options.merge({verbose: !options['quiet']})
        options['implementation_guide']&.each_with_index do |ig, idx|
          begin # rubocop:disable Style/RedundantBegin
            uri = options['implementation_guide'].length == 1 ? load_ig(ig, nil, config) : load_ig(ig, idx, config)
            say_unless_quiet "Downloading IG from #{uri}"
          rescue Inferno::Utils::IgDownloader::Error => e
            say_unless_quiet e.message, :red
          end
        end
      end

      def say_unless_quiet(*args)
        say(*args) unless options['quiet']
      end
    end
  end
end
