module FHIR
  class Client
    attr_accessor :oauth_credentials

    def need_to_refresh?
      oauth_credentials&.need_to_refresh?
    end

    def able_to_refresh?
      oauth_credentials&.able_to_refresh?
    end
  end
end
