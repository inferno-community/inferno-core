# frozen_string_literal: true

require 'pastel'
require 'active_support'
require_relative '../web/serializers/test_run'
require_relative '../web/serializers/result'
require_relative '../../utils/verify_runnable'
require_relative '../../utils/persist_inputs'

module Inferno
  module CLI
    class Execute

      include ::Inferno::Utils::VerifyRunnable
      include ::Inferno::Utils::PersistInputs

      def self.suppress_output
        begin
          original_stderr = $stderr.clone
          original_stdout = $stdout.clone
          $stderr.reopen(File.new('/dev/null', 'w'))
          $stdout.reopen(File.new('/dev/null', 'w'))
          retval = yield
        rescue StandardError => e
          $stdout.reopen(original_stdout)
          $stderr.reopen(original_stderr)
          raise e
        ensure
          $stdout.reopen(original_stdout)
          $stderr.reopen(original_stderr)
        end
        retval
      end

      # Inferno boot flow triggers migration and logger outputs it
      # I would be allow this in verbose mode but definitely not for JSON output
      suppress_output{ require_relative '../../../inferno' }

      # TODO hijack logger and suppress or redirect its output

      COLOR = Pastel.new
      CHECKMARK = "\u2713"

      include Import[
                test_sessions_repo: 'inferno.repositories.test_sessions',
                session_data_repo: 'inferno.repositories.session_data',
                test_runs_repo: 'inferno.repositories.test_runs'
              ]

      attr_accessor :options


      def run(options)
        puts ''
        puts '=========================================='
        puts "Testing #{options[:suite]} Suite"
        puts '=========================================='

        self.options = options
        verbose_puts "options:", self.options

        Inferno::Application.start(:suites)

        suite = Inferno::Repositories::TestSuites.new.find(options[:suite])
        raise StandardError, "Suite #{options[:suite]} not found" if suite.nil?

        test_session = test_sessions_repo.create({test_suite_id: suite.id}) # TODO add suite options

        verify_runnable(
          test_runs_repo.build_entity(create_params(test_session,suite)).runnable,
          thor_hash_to_inputs_array(options[:inputs]),
          test_session.suite_options
        )

        test_run = test_runs_repo.create(
          create_params(test_session,suite).merge({status: 'queued'})
        )

        persist_inputs(create_params(test_session, suite), test_run)

        puts "Running tests. This may take a while..."
        Jobs.perform(Jobs::ExecuteTestRun, test_run.id, force_synchronous: true)

        results = test_runs_repo.results_for_test_run(test_run.id).reverse
        verbose_puts '=========================================='
        verbose_puts "JSON Test Results:"
        verbose_puts '=========================================='
        verbose_puts serialize(results)
        verbose_puts '=========================================='

        puts '=========================================='
        puts "Colored Test Results:"
        puts '=========================================='
        results.each do |result|
          print fetch_test_id(result), ": "
          case result.result
          when 'pass'
            print COLOR.bold.green(CHECKMARK, ' pass')
          when 'fail'
            print COLOR.bold.red 'X fail'
          when 'skip'
            print COLOR.yellow '* skip'
          when 'omit'
            print COLOR.blue '* omit'
          when 'error'
            print COLOR.magenta 'X error'
          when 'wait'
            # This may be dead code with synchronous test execution
            print '. wait'
          when 'cancel'
            print COLOR.red 'X cancel'
          else
            # TODO strict behavior or no?
            #raise StandardError.new, "Unrecognized result #{result.result}" # strict
            print '- unknown'                                                # unstrict
          end
          puts ''
          verbose_puts "\tsummary: ",  result.result_message
          verbose_puts "\tmessages: ", format_messages(result)
          verbose_puts "\trequests: ", format_requests(result)
        end
        puts '=========================================='

        exit(0) if results.find{|result| result.test_suite_id == options[:suite_id]}.result == 'pass'

        exit(1)
      rescue Sequel::ValidationFailed => e
        print_error_and_exit(e, 3)
      rescue Sequel::ForeignKeyConstraintViolation => e
        print_error_and_exit(e, 4)
      rescue Inferno::Exceptions::RequiredInputsNotFound => e
        print_error_and_exit(e, 5)
      rescue Inferno::Exceptions::NotUserRunnableException => e
        print_error_and_exit(e, 6)
      rescue StandardError => e
        print_error_and_exit(e, 2)
      end

      def thor_hash_to_inputs_array(hash)
        hash.to_a.map{|pair| {name: pair[0], value: pair[1]}}
      end

      def create_params(test_session, suite)
        {
          test_session_id: test_session.id,
          test_suite_id: suite.id,
          inputs: thor_hash_to_inputs_array(self.options[:inputs])
        }
      end

      def serialize(entity)
        case entity.class.to_s
        when 'Array'
          JSON.pretty_generate entity.map{ |item| JSON.parse serialize(item) }
        when ->(x) { defined?(x.constantize) && defined?("Inferno::Web::Serializers::#{x.split('::').last}".constantize) }
          "Inferno::Web::Serializers::#{entity.class.to_s.split('::').last}".constantize.render(entity)
        else
          raise StandardError, "CLI does not know how to serialize #{entity.class}"
        end
      end

      def verbose_print(*args)
        print(COLOR.dim(*args)) if self.options[:verbose]
      end

      def verbose_puts(*args)
        args.push("\n")
        verbose_print(*args)
      end

      def fetch_test_id(result)
        [result.test_id, result.test_group_id, result.test_suite_id].find { |x| x.presence }
      end

      def format_messages(result)
        result.messages.map do |message|
          "\n\t\t" + message.type + ": " + message.message
        end
      end

      def format_requests(result)
        result.requests.map do |req_res|
          "\n\t\t" + req_res.status.to_s + ' ' + req_res.verb.upcase + ' ' + req_res.url
        end
      end

      def print_error_and_exit(e, code)
        # TODO: use Application Logger for stderr?
        $stderr.puts COLOR.red "Error: #{e.full_message}"
        exit(code)
      end
    end
  end
end
