require 'forwardable'
require_relative '../exceptions'

module Inferno
  module Repositories
    class InMemoryRepository
      extend Forwardable

      def_delegators 'self.class', :all, :all_by_id

      def insert(entity)
        raise Exceptions::DuplicateEntityIdException, entity.id if id_exists?(entity.id)

        all << entity
        entity
      end

      def find(id)
        all_by_id[id.to_s]
      end

      def exists?(id)
        all_by_id.include? id
      end

      class << self
        def all
          @all ||= []
        end

        # @private
        def all_by_id
          @all_by_id ||= {}
          @all_by_id.length == all.length ? @all_by_id : index_by_id
        end

        def index_by_id
          @all_by_id = {}
          all.each { |klass| @all_by_id[klass.id] = klass }
          @all_by_id
        end
      end

      private

      def id_exists?(id)
        all.any? { |klass| klass.id == id }
      end
    end
  end
end
