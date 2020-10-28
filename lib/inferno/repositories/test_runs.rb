require_relative 'validate_runnable_reference'

module Inferno
  module Repositories
    class TestRuns < Repository
      include Import[results_repo: 'repositories.results']

      def json_serializer_options
        {
          include: {
            results: results_repo.json_serializer_options
          }
        }
      end

      def results_for_test_run(test_run_id)
        test_run_hash =
          self.class::Model
            .find(id: test_run_id)
            .to_json_data(json_serializer_options)
            .deep_symbolize_keys!

        test_run_hash[:results]
          .map! { |result| results_repo.build_entity(result) }
      end

      class Model < Sequel::Model(db)
        include ValidateRunnableReference

        one_to_many :results,
                    eager: [:messages, :requests],
                    class: 'Inferno::Repositories::Results::Model',
                    key: :test_run_id
        many_to_one :test_session, class: 'Inferno::Repositories::TestSessions::Model', key: :test_session_id

        def before_create
          self.id = SecureRandom.uuid
          time = Time.now
          self.created_at ||= time
          self.updated_at ||= time
          super
        end
      end
    end
  end
end
