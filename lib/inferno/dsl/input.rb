require_relative '../entities/attributes'
require_relative '../exceptions'

module Inferno
  module DSL
    class Input
      ATTRIBUTES = [
        :name,
        :title,
        :description,
        :type,
        :default,
        :optional,
        :options,
        :locked
      ].freeze
      include Entities::Attributes

      # These attributes require special handling when merging input
      # definitions.
      UNINHERITABLE_ATTRIBUTES = [
        # Locking an input only has meaning at the level it is locked.
        # Consider:
        # - ParentGroup
        #   - Group 1, input :a
        #   - Group 2, input :a, locked: true
        # The input 'a' should be only be locked when running Group 2 in
        # isolation. It should not be locked when running Group 1 or the
        # ParentGroup.
        :locked,
        # Input type is sometimes only a UI concern (e.g. text vs. textarea), so
        # it is common to not redeclare the type everywhere it's used and needs
        # special handling to avoid clobbering the type with the default (text)
        # type.
        :type
      ].freeze

      INHERITABLE_ATTRIBUTES = (ATTRIBUTES - UNINHERITABLE_ATTRIBUTES).freeze

      def initialize(**params)
        bad_params = params.keys - ATTRIBUTES

        raise Exceptions::UnknownAttributeException.new(bad_params, self.class) if bad_params.present?

        params
          .compact
          .each { |key, value| send("#{key}=", value) }

        self.name = name.to_s if params[:name].present?
      end

      def merge_with_child(child_input)
        return self if child_input.nil?

        INHERITABLE_ATTRIBUTES.each do |attribute|
          value = send(attribute)
          value = child_input.send(attribute) if value.nil?

          next if value.nil?

          send("#{attribute}=", value)
        end

        if child_input.type != 'text'
          self.type ||= child_input.type
        end

        self
      end

      def merge(other_input)
        return self if other_input.nil?

        ATTRIBUTES.each do |attribute|
          next if attribute == :type

          value = other_input.send(attribute)
          value = send(attribute) if value.nil?

          next if value.nil?

          send("#{attribute}=", value)
        end

        if other_input.type != 'text'
          self.type ||= other_input.type
        end

        self
      end

      def to_hash
        ATTRIBUTES.each_with_object({}) do |attribute, hash|
          value = send(attribute)
          next if value.nil?

          hash[attribute] = value
        end
      end

      def ==(other)
        return false unless other.is_a? Input

        ATTRIBUTES.all? { |attribute| send(attribute) == other.send(attribute) }
      end
    end
  end
end
