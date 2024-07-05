module AuthInfoConstants
  AUTH_URL = 'http://example.com/authorization'.freeze
  TOKEN_URL = 'http://example.com/token'.freeze
  REQUESTED_SCOPES = 'launch/patient openid fhirUser patient/*.*'.freeze
  ENCRYPTION_ALGORITHM = 'ES384'.freeze
  KID = '4b49a739d1eb115b3225f4cf9beb6d1b'.freeze
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

  class << self
    def token_info
      {
        access_token: 'SAMPLE_TOKEN',
        refresh_token: 'SAMPLE_REFRESH_TOKEN',
        expires_in: '3600',
        issue_time: Time.now.iso8601
      }
    end

    def public_access_default
      {
        auth_type: 'public',
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_PUBLIC_CLIENT_ID',
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'enabled',
        pkce_code_challenge_method: 'S256',
        auth_request_method: 'GET'
      }.merge(token_info).freeze
    end

    def symmetric_confidential_access_default
      {
        auth_type: 'symmetric',
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        client_secret: 'SAMPLE_CONFIDENTIAL_CLIENT_SECRET',
        auth_url: AUTH_URL,
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'enabled',
        pkce_code_challenge_method: 'S256',
        auth_request_method: 'POST',
        use_discovery: 'false'
      }.merge(token_info).freeze
    end

    def asymmetric_confidential_access_default
      {
        auth_type: 'asymmetric',
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        requested_scopes: REQUESTED_SCOPES,
        pkce_support: 'disabled',
        auth_request_method: 'POST',
        encryption_algorithm: ENCRYPTION_ALGORITHM,
        jwks: JWKS,
        kid: KID
      }.merge(token_info).freeze
    end

    def backend_services_access_default
      {
        auth_type: 'backend_services',
        token_url: TOKEN_URL,
        client_id: 'SAMPLE_CONFIDENTIAL_CLIENT_ID',
        requested_scopes: REQUESTED_SCOPES,
        encryption_algorithm: ENCRYPTION_ALGORITHM,
        jwks: JWKS,
        kid: KID
      }.merge(token_info).freeze
    end
  end
end
