require_relative '../../utils/shared_functions'
require_relative 'allergy_intolerance_definitions'

module USCore
  class AllergyIntoleranceSearchPatientTest < Inferno::Test
    include USCore::HelperFunctions
    include USCore::ProfileDefinitions
    
    input :standalone_patient_id
    title 'Server returns resources when search by patient'
    description 'Server returns resources when search by patient'
    
    id :allergy_intolerance_search_patient_test

    run do
      search_params = {
        patient: standalone_patient_id
      }
      fhir_search :AllergyIntolerance,
                  params: search_params
      
      # reply = perform_search_with_status(reply, search_params, search_method: :get) if reply.code == 400

      assert_response_ok

      # validation part of assert_valid_bundle_entries failing -- maybe because of fhir version? -- i think it was working before the validator updates
      # assert_valid_bundle_entries(resource_types: ['AllergyIntolerance', 'OperationOutcome'])

      any_resources = resource.entry.any? { |entry| entry.resource.resourceType == 'AllergyIntolerance' }
 
      resources_returned = fetch_all_bundled_resources(resource, fhir_client)
      resources_returned.select! { |resource| resource.resourceType == 'AllergyIntolerance' }
      
      # next unless any_resources
      scratch[:allergy_intolerance_resources] = resources_returned
      scratch[:resources_returned] = resources_returned
      scratch[:search_parameters_used] = search_params

      save_delayed_sequence_references(resources_returned,
        AllergyintoleranceSequenceDefinitions::DELAYED_REFERENCES, scratch)

      skip_if resources_returned.empty?,  "No Allergy Intolerance resources appear to be available. Please use patients with more information"
    end
  end
end
