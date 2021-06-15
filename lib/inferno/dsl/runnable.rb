module Inferno
  module DSL
    # This module contains the DSL for defining child entities in the test
    # definition framework.
    module Runnable
      attr_accessor :parent

      # When a class (e.g. TestSuite/TestGroup) uses this module, set it up
      # so that subclassing it works correctly.
      # - add the subclass to the relevant repository when it is created
      # - copy the class instance variables from the superclass
      # - add a hook to the subclass so that its subclasses do the same
      # @api private
      def self.extended(extending_class)
        super

        extending_class.define_singleton_method(:inherited) do |subclass|
          copy_instance_variables(subclass)

          # Whenever the definition of a Runnable class ends, keep track of the
          # file it came from. Once the Suite loader successfully loads a file,
          # it will add all of the Runnable classes from that file to the
          # appropriate repositories.
          TracePoint.trace(:end) do |trace|
            if trace.self == subclass
              subclass.add_self_to_repository
              trace.disable
            end
          end
        end
      end

      # Class instance variables are used to hold the metadata for Runnable
      # classes. When inheriting from a Runnable class, these class instance
      # variables need to be copied. Any child Runnable classes will themselves
      # need to be subclassed so that their parent can be updated.
      # @api private
      def copy_instance_variables(subclass)
        instance_variables.each do |variable|
          next if [:@id, :@groups, :@tests, :@parent, :@children].include?(variable)

          subclass.instance_variable_set(variable, instance_variable_get(variable).dup)
        end

        child_types.each do |child_type|
          new_children = send(child_type).map do |child|
            Class.new(child).tap do |subclass_child|
              subclass_child.parent = subclass
            end
          end

          subclass.instance_variable_set(:"@#{child_type}", new_children)
          subclass.children.concat(new_children)
        end
      end

      # @api private
      def add_self_to_repository
        repository.insert(self)
      end

      # An instance of the repository for the class using this module
      def repository
        nil
      end

      # This method defines a child entity. Classes using this module should
      # alias the method name they wish to use to define child entities to this
      # method.
      # @api private
      def define_child(*args, &block)
        hash_args = process_args(args)

        klass = create_child_class(hash_args)

        klass.parent = self

        child_metadata[:collection] << klass
        children << klass

        configure_child_class(klass, hash_args)

        handle_child_definition_block(klass, &block)

        klass.add_self_to_repository

        klass
      end

      # @api private
      def process_args(args)
        hash_args =
          if args[0].is_a? Hash
            args[0]
          elsif args[1].is_a? Hash
            args[1]
          else
            {}
          end

        hash_args[:title] = args[0] if args[0].is_a? String

        hash_args
      end

      # @api private
      def child_metadata(metadata = nil)
        @child_metadata = metadata if metadata
        @child_metadata
      end

      # @api private
      def create_child_class(hash_args)
        superclass_id = hash_args.delete :from

        return Class.new(child_metadata[:class]) if superclass_id.blank?

        superclass = child_metadata[:repo].find(superclass_id)

        raise Exceptions::ParentNotLoadedException.new(child_metadata[:class], superclass_id) unless superclass

        Class.new(superclass)
      end

      # @api private
      def configure_child_class(klass, hash_args) # rubocop:disable Metrics/CyclomaticComplexity
        inputs.each do |input_definition|
          next if klass.inputs.include? input_definition

          klass.input input_definition
        end

        outputs.each do |output_definition|
          next if klass.outputs.include? output_definition

          klass.output output_definition
        end

        new_fhir_client_definitions = klass.instance_variable_get(:@fhir_client_definitions) || {}
        fhir_client_definitions.each do |name, definition|
          next if new_fhir_client_definitions.include? name

          new_fhir_client_definitions[name] = definition.dup
        end
        klass.instance_variable_set(:@fhir_client_definitions, new_fhir_client_definitions)

        new_http_client_definitions = klass.instance_variable_get(:@http_client_definitions) || {}
        http_client_definitions.each do |name, definition|
          next if new_http_client_definitions.include? name

          new_http_client_definitions[name] = definition.dup
        end
        klass.instance_variable_set(:@http_client_definitions, new_http_client_definitions)

        hash_args.each do |key, value|
          klass.send(key, *value)
        end

        klass.children.each do |child_class|
          klass.configure_child_class(child_class, {})
          child_class.add_self_to_repository
        end
      end

      # @api private
      def handle_child_definition_block(klass, &block)
        klass.class_eval(&block) if block_given?
      end

      def id(new_id = nil)
        return @id if new_id.nil? && @id.present?

        prefix =
          if parent
            "#{parent.id}-"
          else
            ''
          end

        @base_id = new_id || @base_id || default_id

        @id = "#{prefix}#{@base_id}"
      end

      def title(new_title = nil)
        return @title if new_title.nil?

        @title = new_title
      end

      def description(new_description = nil)
        return @description if new_description.nil?

        @description = new_description
      end

      # Define inputs
      #
      # @param inputs [Symbol]
      # @return [void]
      # @example
      #   input :patient_id, :bearer_token
      def input(*input_definitions)
        inputs.concat(input_definitions)
      end

      # Define outputs
      #
      # @param output_definitions [Symbol]
      # @return [void]
      # @example
      #   output :patient_id, :bearer_token
      def output(*output_definitions)
        outputs.concat(output_definitions)
      end

      # @api private
      def default_id
        to_s
      end

      # @api private
      def inputs
        @inputs ||= []
      end

      # @api private
      def outputs
        @outputs ||= []
      end

      def child_types
        return [] if ancestors.include? Inferno::Entities::Test
        return [:groups] if ancestors.include? Inferno::Entities::TestSuite

        [:groups, :tests]
      end

      def children
        @children ||= []
      end

      def validator_url(url = nil)
        return @validator_url ||= parent&.validator_url if url.nil?

        @validator_url = url
      end
    end
  end
end
