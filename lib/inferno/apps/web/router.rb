require 'erb'

Dir.glob(File.join(__dir__, 'controllers', '**', '*.rb')).each { |path| require_relative path }

module Inferno
  module Web
    client_page = ERB.new(File.read(File.join(Inferno::Application.root, 'lib', 'inferno', 'apps', 'web',
                                              'index.html.erb'))).result

    base_path = Application['base_path']
    base_path = "/#{base_path.delete_prefix('/')}" if base_path.present?

    route_block = proc do
      scope 'api' do
        scope 'test_runs' do
          post '/', to: Inferno::Web::Controllers::TestRuns::Create, as: :create
          get '/:id', to: Inferno::Web::Controllers::TestRuns::Show, as: :show
          delete '/:id', to: Inferno::Web::Controllers::TestRuns::Destroy, as: :destroy

          get '/results', to: Inferno::Web::Controllers::TestRuns::Results::Index, as: :results
        end

        scope 'test_sessions' do
          post '/', to: Inferno::Web::Controllers::TestSessions::Create, as: :create
          get '/:id', to: Inferno::Web::Controllers::TestSessions::Show, as: :show

          get '/:id/last_test_run',
              to: Inferno::Web::Controllers::TestSessions::LastTestRun,
              as: :last_test_run
          get '/:id/results',
              to: Inferno::Web::Controllers::TestSessions::Results::Index,
              as: :results
          get '/:id/session_data',
              to: Inferno::Web::Controllers::TestSessions::SessionData::Index
          put '/:id/session_data/apply_preset',
              to: Inferno::Web::Controllers::TestSessions::SessionData::ApplyPreset,
              as: :session_data_apply_preset
        end

        scope 'test_suites' do
          get '/', to: Inferno::Web::Controllers::TestSuites::Index, as: :index
          get '/:id', to: Inferno::Web::Controllers::TestSuites::Show, as: :show

          put '/:id/check_configuration',
              to: Inferno::Web::Controllers::TestSuites::CheckConfiguration,
              as: :check_configuration
        end

        get '/requests/:id', to: Inferno::Web::Controllers::Requests::Show, as: :requests_show

        get '/version', to: ->(_env) { [200, {}, [{ 'version' => Inferno::VERSION.to_s }.to_json]] }, as: :version
      end

      # Should not need Content-Type header but GitHub Codespaces will not work without them.
      # This could be investigated and likely removed if addressed properly elsewhere.
      get '/', to: ->(_env) { [200, { 'Content-Type' => 'text/html' }, [client_page]] }
      get '/test_sessions/:id', to: ->(_env) { [200, { 'Content-Type' => 'text/html' }, [client_page]] }

      Inferno.routes.each do |route|
        cleaned_id = route[:suite].id.gsub(/[^a-zA-Z\d\-._~]/, '_')
        path = "/custom/#{cleaned_id}#{route[:path]}"
        Application['logger'].info("Registering custom route: #{path}")
        if route[:method] == :all
          mount route[:handler], at: path
        else
          send(route[:method], path, to: route[:handler])
        end
      end

      Inferno::Repositories::TestSuites.all.map { |suite| "/#{suite.id}" }.each do |suite_path|
        Application['logger'].info("Registering suite route: #{suite_path}")
        get suite_path, to: ->(_env) { [200, {}, [client_page]] }
      end
    end

    Router = # rubocop:disable Naming/ConstantName
      if base_path.present?
        Hanami::Router.new(prefix: base_path, &route_block)
      else
        Hanami::Router.new(&route_block)
      end
  end
end
