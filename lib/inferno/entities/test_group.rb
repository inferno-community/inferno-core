require_relative '../dsl'
require_relative '../repositories/test_groups'
require_relative '../repositories/test_sessions'

module Inferno
  module Entities
    class TestGroup
      extend Forwardable
      extend DSL::FHIRClient::ClassMethods
      extend DSL::HTTPClient::ClassMethods
      extend DSL::Runnable
      include DSL::FHIRValidation

      def_delegators 'self.class', :title, :id, :groups, :inputs, :outputs, :tests

      def method_missing(name, *args, &block)
        parent_instance = self.class.parent&.new
        if parent_instance.respond_to?(name)
          parent_instance.send(name, *args, &block)
        else
          super
        end
      end

      def respond_to_missing?(name, _include_private = false)
        self.class.parent&.new&.respond_to?(name)
      end

      class << self
        def repository
          Inferno::Repositories::TestGroups.new
        end

        def groups(options = nil)
          children(options).select { |child| child < Inferno::Entities::TestGroup }
        end

        def tests(options = nil)
          children(options).select { |child| child < Inferno::Entities::Test }
        end

        # Methods to configure Inferno::DSL::Runnable

        def group(...)
          child_metadata(group_metadata)
          define_child(...)
        end

        def test(...)
          child_metadata(test_metadata)
          define_child(...)
        end

        def group_metadata
          {
            class: TestGroup,
            repo: repository
          }
        end

        def test_metadata
          {
            class: Test,
            repo: Inferno::Repositories::Tests.new
          }
        end

        def short_id
          @short_id ||= begin
            prefix = parent.respond_to?(:short_id) ? "#{parent.short_id}." : ''
            suffix = parent ? (parent.groups.find_index(self) + 1).to_s : 'X'
            "#{prefix}#{suffix}"
          end
        end

        def default_id
          return name if name.present?

          suffix = parent ? (parent.groups.find_index(self) + 1).to_s.rjust(2, '0') : SecureRandom.uuid
          "Group#{suffix}"
        end

        def reference_hash
          {
            test_group_id: id
          }
        end

        def run_as_group(value = true) # rubocop:disable Style/OptionalBooleanParameter
          @run_as_group = value
        end

        def run_as_group?
          @run_as_group || false
        end
      end
    end
  end

  TestGroup = Entities::TestGroup
end
