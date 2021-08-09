require 'json'

module Inferno
  module Web
    module Serializers
      class Result < Serializer
        identifier :id

        field :test_id, if: :field_present?
        field :test_group_id, if: :field_present?
        field :test_suite_id, if: :field_present?

        field :test_run_id
        field :test_session_id
        field :result
        field :result_message, if: :field_present?
        field :created_at
        field :updated_at

        field :outputs do |result, _options|
          result.output_json.present? ? JSON.parse(result.output_json) : []
        end

        association :messages, blueprint: Message, if: :field_present?
        association :requests, blueprint: Request, view: :summary, if: :field_present?
      end
    end
  end
end
