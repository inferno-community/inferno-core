RSpec.describe Inferno::Web::Serializers::TestSession do
  let(:test_session) { repo_create(:test_session, test_suite_id: 'options', suite_options: suite_options) }
  let(:suite_options) { { ig_version: '1' } }

  it 'serializes a test session' do
    serialized_session = JSON.parse(described_class.render(test_session))

    expected_keys = ['id', 'suite_options', 'test_suite', 'test_suite_id']

    expect(serialized_session.keys).to match_array(expected_keys)
    (expected_keys - ['suite_options', 'test_suite']).each do |key|
      expect(serialized_session[key]).to eq(test_session.send(key))
    end

    expect(serialized_session['suite_options']).to eq([{ 'id' => 'ig_version', 'value' => '1' }])

    serialized_suite = JSON.parse(
      Inferno::Web::Serializers::TestSuite.render(
        test_session.test_suite,
        view: :full,
        suite_options: test_session.suite_options
      )
    )

    expect(serialized_session['test_suite']).to eq(serialized_suite)
    expect(serialized_session['test_suite']['test_groups'].length).to eq(2)
  end
end
