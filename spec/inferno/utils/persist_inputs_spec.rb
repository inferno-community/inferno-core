require_relative '../../../lib/inferno/utils/persist_inputs'

RSpec.describe Inferno::Utils::PersistInputs do
  describe '#persist_inputs' do
    let(:dummy_class) do
      Class.new do
        include Inferno::Utils::PersistInputs
      end
    end
    let(:dummy) { dummy_class.new }
    let(:suite) { BasicTestSuite::Suite }
    let(:test_sessions_repo) { Inferno::Repositories::TestSessions.new }
    let(:session_data_repo) { Inferno::Repositories::SessionData.new }

    it 'is defined' do
      expect(described_class.method_defined?(:persist_inputs)).to eq(true)
    end

    it 'saves inputs to db' do
      test_session = test_sessions_repo.create(test_suite_id: suite.id)

      test_run = create(:test_run, test_session:)
      test_run.test_session_id = test_session.id

      print "\ntest_run: ", test_run
      print "\ntest_session: ", test_session
      print "\ntest_run.test_session: ", test_run.test_session
      print "\ntest_session.id: ", test_session.id
      print "\ntest_run.test_session_id: ", test_run.test_session_id
      print "\n"

      params = {
        test_session_id: test_session.id,
        test_suite_id: suite.id,
        inputs: [
          { name: 'input1', value: 'persist me' }
        ]
      }

      dummy.persist_inputs(session_data_repo, params, test_run)
      persisted_data = session_data_repo.load(test_session_id: test_run.test_session_id, name: 'input1')

      expect(persisted_data).to eq('persist me')
    end
  end
end
