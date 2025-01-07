module Inferno
  module DSL
    module FHIREvaluation
      module ProfileConformanceChecker
        DEFAULT_OPTIONS = {
          considerMetaProfile: true,
          considerValidationResults: false,
          considerOnlyResourceType: false
        }.freeze

        def conforms_to_profile?(resource, profile, options = DEFAULT_OPTIONS, validator = nil)
          return false if resource.resourceType != profile.type

          return true if options[:considerOnlyResourceType]

          return true if options[:considerMetaProfile] && declares_meta_profile?(resource, profile)

          return true if options[:considerValidationResults] && validates_profile?(resource, profile, validator)

          false
        end

        def declares_meta_profile?(resource, profile)
          declared_profiles = resource&.meta&.profile || []
          profile_url = profile.url
          versioned_url = "#{profile_url}|#{profile.version}"

          declared_profiles.include?(profile_url) || declared_profiles.include?(versioned_url)
        end

        def validates_profile?(_resource, _profile, _validator)
          raise 'Profile validation is not yet implemented. ' \
                'Set considerValidationResults=false.'
        end
      end
    end
  end
end
