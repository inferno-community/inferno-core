module Inferno
  module Utils
    # @private
    module Middleware
      class IncomingRequestRecorder
        attr_reader :app

        def initialize(app)
          @app = app
        end


        def call(env)
          begin
            if request_should_be_recorded?(env)

              # figure out the session id & result id here:
              # env['inferno.test_session_id'] = test_session_id
              # env['inferno.result_id'] = result_id
              # env['inferno.tags'] = tags || []

              env['rack.after_reply'] ||= []
              env['rack.after_reply'] << proc do
                # response and env are in scope

                # convert the env/response to Request and persist
              end
            end
            response = app.call(env)
          rescue StandardError => e
            logger.error(e.full_message)

            response
          end
        end

        def request_should_be_recorded?(env)
          # make requests to be recorded have an easily distinguishable path?
          false
        end
      end
    end
  end
end
