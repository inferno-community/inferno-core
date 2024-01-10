require_relative '../controller'
require_relative '../../serializers/test_session'

module Inferno
  module Web
    module Controllers
      module TestSessions
        class Create < Controller
          PARAMS = [:test_suite_id, :suite_options].freeze

          def handle(req, res)
            params = req.params.to_h
            unless req.body.string.blank? || req.env['CONTENT_TYPE'].include?('multipart/form-data')
              params.merge!(JSON.parse(req.body.string).symbolize_keys)
            end

            session = repo.create(create_params(params))

            repo.apply_preset(session, params[:preset_id]) if params[:preset_id].present?

            res.body = serialize(session)
          rescue Sequel::ValidationFailed, Sequel::ForeignKeyConstraintViolation => e
            halt 422, { errors: e.message }.to_json
          rescue StandardError => e
            Application['logger'].error(e.full_message)
            halt 500, { errors: e.message }.to_json
          end

          def create_params(params)
            params.slice(*PARAMS)
          end
        end
      end
    end
  end
end
