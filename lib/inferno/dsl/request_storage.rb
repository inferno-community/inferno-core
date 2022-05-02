module Inferno
  module DSL
    # This module handles storing and retrieving requests/responses made by
    # FHIR/HTTP clients
    module RequestStorage
      def self.included(klass)
        klass.extend ClassMethods
      end

      # Returns the FHIR/HTTP requests that have been made in this `Test`
      #
      # @return [Array<Inferno::Entities::Request>]
      def requests
        @requests ||= []
      end

      # Returns the most recent FHIR/HTTP request
      #
      # @return [Inferno::Entities::Request]
      def request
        requests.last
      end

      # Returns the response from the most recent FHIR/HTTP request
      #
      # @return [Hash, nil]
      def response
        request&.response
      end

      # Returns the FHIR resource from the response to the most recent FHIR
      # request
      #
      # @return [FHIR::Model, nil]
      def resource
        request&.resource
      end

      # TODO: do a check in the test runner
      def named_request(name)
        requests.find { |request| request.name == self.class.config.request_name(name.to_sym) }
      end

      # @private
      def store_request(direction, name = nil, &block)
        response = block.call

        name = self.class.config.request_name(name)
        request =
          if response.is_a? FHIR::ClientReply
            Entities::Request.from_fhir_client_reply(
              response, direction: direction, name: name, test_session_id: test_session_id
            )
          else
            Entities::Request.from_http_response(
              response, direction: direction, name: name, test_session_id: test_session_id
            )
          end

        requests << request
        request
      end

      # @private
      def load_named_requests
        requests_repo = Inferno::Repositories::Requests.new
        self.class.named_requests_used.map do |request_name|
          request_alias = self.class.config.request_name(request_name)
          request = requests_repo.find_named_request(test_session_id, request_alias)
          if request.nil?
            raise Exceptions::SkipException, "Request `#{request_alias}` was not made in a previous test as expected."
          end

          requests << request
        end
      end

      module ClassMethods
        # @private
        def named_requests_made
          @named_requests_made ||= []
        end

        # @private
        def named_requests_used
          @named_requests_used ||= []
        end

        # Specify the named requests made by a test
        #
        # @param identifiers [Symbol] one or more request identifiers
        def makes_request(*identifiers)
          named_requests_made.concat(identifiers).uniq!
          identifiers.each do |identifier|
            config.add_request(identifier)
          end
        end

        # Specify the name for a request received by a test
        #
        # @param identifier [Symbol]
        def receives_request(identifier)
          config.add_request(identifier)
          @incoming_request_name = identifier
        end

        # @private
        def incoming_request_name
          @incoming_request_name
        end

        # Specify the named requests used by a test
        #
        # @param identifiers [Symbol] one or more request identifiers
        def uses_request(*identifiers)
          named_requests_used.concat(identifiers).uniq!
          identifiers.each do |identifier|
            config.add_request(identifier)
          end
        end
      end
    end
  end
end
