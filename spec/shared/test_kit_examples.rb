RSpec.shared_examples 'platform_deployable_test_kit' do
  let(:test_kit_location) do
    Object.const_source_location(described_class.name).first
  end
  let(:test_kit_gem) do
    Bundler.definition.specs.find { |gem| test_kit_location.start_with? gem.full_gem_path }
  end
  let(:base_path) do
    test_kit_gem.full_gem_path
  end
  let(:test_kit) do
    described_class.const_get('Metadata')
  rescue NameError
    skip 'TestKit must be defined first'
  end

  describe 'TestKit' do
    it 'defines test kit in the Metadata class' do
      error_message =
        "Define #{described_class.name}::Metadata at " \
        "lib/#{described_class.name.underscore}/metadata.rb and require it in " \
        "lib/#{described_class.name.underscore}.rb\n"

      expect { described_class.const_get('Metadata') }.to_not raise_error(NameError), error_message

      expect(described_class.const_get('Metadata')).to be_a(Inferno::Entities::TestKit)
    end

    it 'relies on the test kit version rather than defining the version in the suites' do
      suites = test_kit.suite_ids.map { |id| Inferno::Repositories::TestSuites.new.find(id) }
      suite_paths = suites.map { |suite| Object.const_source_location(suite.name) }
      suite_contents = suite_paths.map { |path| File.read(path) }

      suite_contents.each_with_index do |suite, i|
        error_message =
          "Suite at #{suite_paths[i]} should not explicitly declare a version, as " \
          'its version can now be determined by the version of its Test Kit.' \
          "Remove the `version` method call in the suite definition.\n"

        expect(suite).to_not match(/^\s+version(\s|\()\S+\)?/), error_message
      end
    end

    it 'defines all required fields' do
      required_fields = [
        :id,
        :title,
        :description,
        :suite_ids,
        :version,
        :maturity
      ]

      required_fields.each do |field_name|
        expect(test_kit.send(field_name)).to be_present
      end
    end

    it 'has a description with a <!-- break -->' do
      error_message =
        'The test kit description must begin with one paragraph followed by "<!-- ' \
        'break -->". The portion of the description above the break is displayed ' \
        "on the test kit listing page.\n"

      expect(test_kit.description).to include('<!-- break -->'), error_message
    end

    it 'has a maturity of "Low", "Medium", or "High"' do
      expect(['Low', 'Medium', 'High']).to include(test_kit.maturity) # rubocop:disable RSpec/ExpectActual
    end
  end

  describe 'presets' do
    it 'includes presets in the gem' do
      presets = Dir[
        File.join(base_path, 'config', 'presets', '*.json'),
        File.join(base_path, 'config', 'presets', '*.json.erb')
      ].map { |file_path| file_path.delete_prefix "#{Dir.pwd}/" }

      missing_presets = presets - test_kit_gem.files

      error_message =
        "The following presets are not included in the gem: #{missing_presets.join(', ')}\n" \
        "Ensure that config/presets is included in spec.files in #{test_kit_gem.name}.gemspec"

      expect(missing_presets).to be_empty, error_message
    end
  end

  describe 'gemspec' do
    it 'uses git to determine files to include in the gem' do
      gemspec_contents = File.read(File.join(base_path, "#{test_kit_gem.name}.gemspec"))

      error_message =
        'Use git to determine which files to include in the gem. In ' \
        "#{test_kit_gem.name}.gemspec, use: " \
        "spec.files = `[ -d .git ] && git ls-files -z lib config/presets LICENSE`.split(\"\\x0\")\n"

      expect(gemspec_contents).to include('[ -d .git ] && git ls-files'), error_message
    end

    it 'includes the inferno test kit metadata tag' do
      error_message =
        %(Add "spec.metadata['inferno_test_kit'] = 'true'" to #{test_kit_gem.name}.gemspec)

      expect(test_kit_gem.metadata['inferno_test_kit']).to eq('true'), error_message
    end
  end
end
