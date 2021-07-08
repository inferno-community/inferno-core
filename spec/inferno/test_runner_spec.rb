# NOTE: These are basic placeholder specs to make sure we don't break this as we
#   refactor.
RSpec.describe Inferno::TestRunner do
  let(:runner) { described_class.new(test_session: test_session, test_run: test_run) }
  let(:test_session) { repo_create(:test_session, test_suite_id: 'demo') }
  let(:test_run) do
    repo_create(:test_run, runnable: { test_group_id: group.id }, test_session_id: test_session.id)
  end

  def error_results_message(error_results)
    error_results.map do |r|
      "#{r.runnable.title}: #{r.result_message}"
    end.join("\n")
  end

  describe 'when running demo group' do
    let(:base_url) { 'http://hapi.fhir.org/baseR4' }
    let(:patient_id) { 1215072 }
    let(:group) { Inferno::Repositories::TestSuites.new.find('demo').groups.first.groups.first }
    let(:patient) { FHIR::Patient.new(id: patient_id) }
    let(:observation_bundle) do
      FHIR::Bundle.new(
        entry: [
          {
            resource: FHIR::Observation.new(id: 123)
          }
        ]
      )
    end

    before do
      stub_request(:get, "#{base_url}/Patient/#{patient_id}")
        .to_return(status: 200, body: patient.to_json)
      stub_request(:get, "#{base_url}/Observation")
        .with(query: { 'patient' => patient_id })
        .to_return(status: 200, body: observation_bundle.to_json)
      stub_request(:post, "#{ENV.fetch('VALIDATOR_URL')}/validate")
        .with(query: hash_including({}))
        .to_return(status: 200, body: FHIR::OperationOutcome.new.to_json)
      stub_request(:get, 'http://example.com')
        .to_return(status: 200)
    end

    it 'runs' do
      expect do
        runner.run(group, { url: base_url, patient_id: patient_id })
      end.to_not raise_error
    end

    it 'creates results' do
      test_count = group.tests.length

      results = runner.run(group, { url: base_url, patient_id: patient_id })

      expect(results.length).to eq(test_count + 1)
    end

    it 'only contains no "error" results apart from the "error test"' do
      results = runner.run(group, { url: base_url, patient_id: patient_id })
      error_results =
        results
          .reject { |result| result.test&.title == 'error test' }
          .reject { |result| result.test_group&.title == 'Demo Group Instance 1' }
          .select { |result| result.result == 'error' }

      expect(error_results).to be_empty, error_results_message(error_results)
    end
  end

  describe 'when running wait group' do
    let(:group) { Inferno::Repositories::TestSuites.new.find('demo').groups.last }

    it 'gives a wait result' do
      results = runner.run(group, {})
      group_result = results.find { |result| result.test_group_id.present? }

      expect(group_result.result).to eq('wait')
    end

    it 'does not run the last test' do
      results = runner.run(group, {})

      expect(results.length).to eq(3)
    end
  end
end
