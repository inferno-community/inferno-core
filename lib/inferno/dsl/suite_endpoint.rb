require 'hanami/controller'

module Inferno
  module DSL
    # A base class for creating endpoints to test client requests.
    class SuiteEndpoint < Hanami::Action
      include Import[
                requests_repo: 'inferno.repositories.requests',
                results_repo: 'inferno.repositories.results',
                test_runs_repo: 'inferno.repositories.test_runs',
                tests_repo: 'inferno.repositories.tests'
              ]

      attr_reader :req, :res

      # @private
      def self.call(...)
        new.call(...)
      end

      # The incoming request as a `Hanami::Action::Request`
      #
      # @return [Hanami::Action::Request]
      #
      # @example
      # request.params               # Get url/query params
      # request.body                 # Get body
      # request.get_header('accept') # Get Accept header
      def request
        req
      end

      # The response as a `Hanami::Action::Response`. Modify this to build the
      # response to the incoming request.
      #
      # @return [Hanami::Action::Response]
      #
      # @example
      # response.status = 200        # Set the status
      # response.body = 'Ok'         # Set the body
      # # Set headers
      # response.headers.merge!('X-Custom-Header' => 'CUSTOM_HEADER_VALUE')
      def response
        res
      end

      # Override this method to determine a test run's identifier based on an
      # incoming request.
      #
      # @return [String]
      #
      # @example
      # def test_run_identifier
      #   # Identify the test session of an incoming request based on the bearer
      #   # token
      #   request.get_header('authorization')&.delete_prefix('Bearer ')
      # end
      def test_run_identifier
        nil
      end

      # Override this method to build the response.
      #
      # @return [Void]
      #
      # @example
      # def build_response
      #   response.status = 200
      #   response.body = { abc: 123 }.to_json
      #   response.format = :json
      # end
      def build_response
        nil
      end

      # Override this method to define the tags which will be applied to the
      # request.
      #
      # @return [Array<String>]
      def tags
        @tags ||= []
      end

      # Override this method to specify whether this request should be
      # persisted. Defaults to true.
      #
      # @return [Boolean]
      def persist_request?
        true
      end

      # Override this method to update the current waiting result. To resume the
      # test run, set the result to something other than 'waiting'.
      #
      # @return [Void]
      #
      # @example
      # def update_result
      #   results_repo.update(result.id, result: 'pass')
      # end
      def update_result
        nil
      end

      # The test run which is waiting for incoming requests
      #
      # @return [Inferno::Entities::TestRun]
      def test_run
        @test_run ||=
          test_runs_repo.find_latest_waiting_by_identifier(find_test_run_identifier).tap do |test_run|
            halt 500, "Unable to find test run with identifier '#{test_run_identifier}'." if test_run.nil?
          end
      end

      # The result which is waiting for incoming requests for the current test
      # run
      #
      # @return [Inferno::Entities::Result]
      def result
        @result ||= find_result
      end

      # The test which is currently waiting for incoming requests
      #
      # @return [Inferno::Entities::Test]
      def test
        @test ||= tests_repo.find(result.test_id)
      end

      # @private
      def find_test_run_identifier
        @test_run_identifier ||= test_run_identifier
      rescue StandardError => e
        halt 500, "Unable to determine test run identifier:\n#{e.full_message}"
      end

      # @private
      def find_result
        results_repo.find_waiting_result(test_run_id: test_run.id)
      end

      # @private
      def persist_request
        request.env['inferno.persist_request'] = true
        request.env['inferno.test_session_id'] = test_run.test_session_id
        request.env['inferno.result_id'] = result.id
        request.env['inferno.tags'] = tags
      end

      # @private
      def resume_test_run?
        find_result&.result != 'waiting'
      end

      # @private
      def resume
        test_runs_repo.mark_as_no_longer_waiting(test_run.id)

        Jobs.perform(Jobs::ResumeTestRun, test_run.id)
      end

      # @private
      def handle(req, res)
        @req = req
        @res = res

        build_response

        persist_request if persist_request?

        update_result

        resume if resume_test_run?
      end
    end
  end
end
