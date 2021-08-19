require_relative 'hash_values_extractor'

module Inferno
  module Web
    module Serializers
      class TestGroup < Serializer
        identifier :id

        # TODO: fill out test group
        field :title
        field :description
        field :test_count
        # field :run_as_group

        association :groups, name: :test_groups, blueprint: TestGroup
        association :tests, blueprint: Test
        field :inputs, extractor: HashValuesExtractor, blueprint: Input
        field :outputs, extractor: HashValuesExtractor
      end
    end
  end
end
