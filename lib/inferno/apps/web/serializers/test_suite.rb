module Inferno
  module Web
    module Serializers
      class TestSuite < Serializer
        view :summary do
          identifier :id
          field :title
          field :short_title
          field :description
          field :short_description
          field :input_instructions
          field :test_count
          field :version
          field :suite_options do |option|
            option.suite_options.to_a.map{|a| {id: a[0]}.merge(a[1])}
          end
          association :presets, view: :summary, blueprint: Preset
        end

        view :full do
          include_view :summary
          association :groups, name: :test_groups, blueprint: TestGroup
          field :configuration_messages
          field :available_inputs, name: :inputs, extractor: HashValueExtractor, blueprint: Input
        end
      end
    end
  end
end
