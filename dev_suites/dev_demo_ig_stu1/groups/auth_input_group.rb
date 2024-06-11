module AuthInfoConstants
  RESOURCE_URL = 'https://inferno.healthit.gov/reference-server/r4'.freeze
  AUTH_URL = 'https://inferno-qa.healthit.gov/reference-server/oauth/authorization'.freeze
  TOKEN_URL = 'https://inferno-qa.healthit.gov/reference-server/oauth/token'.freeze
  REQUESTED_SCOPES = 'launch/patient openid fhirUser patient/*.*'.freeze
  REDIRECT_URL = "#{Inferno::Application['base_url']}/custom/smart/redirect".freeze
  ENCRYPTION_ALGORITHM = 'ES384'.freeze
  JWKS =
    {
      keys:
       [
         {
           kty: 'EC',
           crv: 'P-384',
           x: 'JQKTsV6PT5Szf4QtDA1qrs0EJ1pbimQmM2SKvzOlIAqlph3h1OHmZ2i7MXahIF2C',
           y: 'bRWWQRJBgDa6CTgwofYrHjVGcO-A7WNEnu4oJA5OUJPPPpczgx1g2NsfinK-D2Rw',
           use: 'sig',
           key_ops: [
             'verify'
           ],
           ext: true,
           kid: '4b49a739d1eb115b3225f4cf9beb6d1b',
           alg: 'ES384'
         },
         {
           kty: 'EC',
           crv: 'P-384',
           d: 'kDkn55p7gryKk2tj6z2ij7ExUnhi0ngxXosvqa73y7epwgthFqaJwApmiXXU2yhK',
           x: 'JQKTsV6PT5Szf4QtDA1qrs0EJ1pbimQmM2SKvzOlIAqlph3h1OHmZ2i7MXahIF2C',
           y: 'bRWWQRJBgDa6CTgwofYrHjVGcO-A7WNEnu4oJA5OUJPPPpczgx1g2NsfinK-D2Rw',
           key_ops: [
             'sign'
           ],
           ext: true,
           kid: '4b49a739d1eb115b3225f4cf9beb6d1b',
           alg: 'ES384'
         }
       ]
    }.to_json.freeze
  KID = '4b49a739d1eb115b3225f4cf9beb6d1b'.freeze

  class << self
    def public_default
      {
        resource_url: RESOURCE_URL,
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_PUBLIC_CLIENT_ID',
        auth_url: AUTH_URL,
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'enabled',
        pkce_code_challenge_method: 'S256',
        auth_request_method: 'GET'
      }.freeze
    end

    def symmetric_confidential_default
      {
        resource_url: RESOURCE_URL,
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        client_secret: 'SAMPLE_CONFIDENTIAL_CLIENT_SECRET',
        auth_url: AUTH_URL,
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'enabled',
        pkce_code_challenge_method: 'S256',
        auth_request_method: 'POST'
      }.freeze
    end

    def asymmetric_confidential_default
      {
        resource_url: RESOURCE_URL,
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        auth_url: AUTH_URL,
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'disabled',
        auth_request_method: 'POST',
        encryption_algorithm: ENCRYPTION_ALGORITHM,
        jwks: JWKS,
        kid: KID
      }.freeze
    end

    def backend_services_default
      {
        resource_url: RESOURCE_URL,
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        requested_scopes: REQUESTED_SCOPES,
        encryption_algorithm: ENCRYPTION_ALGORITHM,
        jwks: JWKS,
        kid: KID
      }.freeze
    end
  end
end

module DemoIG_STU1 # rubocop:disable Naming/ClassAndModuleCamelCase
  class AuthInputGroup < Inferno::TestGroup
    id :auth_input_demo
    title 'Auth Input Demo'

    test do
      title 'Public Auth'
      id :public_auth
      input :public_auth_input,
            type: :auth_input,
            options: {
              mode: 'auth',
              components: [
                {
                  name: :auth_type,
                  default: 'public',
                  locked: true
                }
              ]
            },
            default: AuthInfoConstants.public_default
      run do
        AuthInfoConstants.public_default.each do |key, original_value|
          received_value = public_auth_input.send(:key)
          assert received_value == original_value,
                 "Expected `#{key}` to equal `#{original_value}`, but received `#{received_value}`"
        end
      end
    end

    test do
      title 'Symmetric Confidential Auth'
      id :symmetric_auth
      input :symmetric_auth_input,
            type: :auth_input,
            options: {
              mode: 'auth',
              components: [
                {
                  name: :auth_type,
                  default: 'symmetric',
                  locked: true
                }
              ]
            },
            default: AuthInfoConstants.symmetric_confidential_default
      run do
        AuthInfoConstants.symmetric_confidential_default.each do |key, original_value|
          received_value = public_auth_input.send(:key)
          assert received_value == original_value,
                 "Expected `#{key}` to equal `#{original_value}`, but received `#{received_value}`"
        end
      end
    end

    test do
      title 'Asymmetric Confidential Auth'
      id :asymmetric_auth
      input :asymmetric_auth_input,
            type: :auth_input,
            options: {
              mode: 'auth',
              components: [
                {
                  name: :auth_type,
                  default: 'asymmetric',
                  locked: true
                }
              ]
            },
            default: AuthInfoConstants.asymmetric_confidential_default
      run do
        AuthInfoConstants.asymmetric_confidential_default.each do |key, original_value|
          received_value = public_auth_input.send(:key)
          assert received_value == original_value,
                 "Expected `#{key}` to equal `#{original_value}`, but received `#{received_value}`"
        end
      end
    end

    test do
      title 'Backend Services Auth'
      id :backend_services_auth
      input :backend_services_auth_input,
            type: :auth_input,
            options: {
              mode: 'auth',
              components: [
                {
                  name: :auth_type,
                  default: 'backend_services',
                  locked: true
                }
              ]
            },
            default: AuthInfoConstants.backend_services_default
      run do
        AuthInfoConstants.backend_services_default.each do |key, original_value|
          received_value = public_auth_input.send(:key)
          assert received_value == original_value,
                 "Expected `#{key}` to equal `#{original_value}`, but received `#{received_value}`"
        end
      end
    end
  end
end
