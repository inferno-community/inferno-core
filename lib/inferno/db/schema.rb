Sequel.migration do
  change do
    create_table(:schema_info) do
      Integer :version, :default=>0, :null=>false
    end
    
    create_table(:test_sessions) do
      String :id, :size=>255, :null=>false
      String :test_suite_id, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      primary_key [:id]
    end
    
    create_table(:session_data, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      foreign_key :test_session_id, :test_sessions, :type=>String, :size=>255
      String :name, :size=>255
      String :value, :text=>true
      
      index [:id], :unique=>true
      index [:test_session_id]
      index [:test_session_id, :name], :unique=>true
    end
    
    create_table(:test_runs, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      String :status, :size=>255
      foreign_key :test_session_id, :test_sessions, :type=>String, :size=>255
      String :test_suite_id, :size=>255
      String :test_group_id, :size=>255
      String :test_id, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      String :identifier, :text=>true
      DateTime :wait_timeout
      
      primary_key [:id]
      
      index [:status, :identifier, :wait_timeout, :updated_at]
      index [:test_group_id]
      index [:test_id]
      index [:test_session_id]
      index [:test_session_id, :status]
      index [:test_suite_id]
    end
    
    create_table(:results, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      foreign_key :test_run_id, :test_runs, :type=>String, :size=>255
      foreign_key :test_session_id, :test_sessions, :type=>String, :size=>255
      String :result, :size=>255
      String :result_message, :size=>255
      String :test_suite_id, :size=>255
      String :test_group_id, :size=>255
      String :test_id, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      String :input_json, :text=>true
      String :output_json, :text=>true
      
      primary_key [:id]
      
      index [:test_run_id]
      index [:test_session_id]
      index [:test_session_id, :test_group_id]
      index [:test_session_id, :test_id]
      index [:test_session_id, :test_suite_id]
    end
    
    create_table(:messages, :ignore_index_errors=>true) do
      primary_key :index
      String :id, :size=>255, :null=>false
      foreign_key :result_id, :results, :type=>String, :size=>255
      String :type, :size=>255
      String :message, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      index [:id]
      index [:result_id]
    end
    
    create_table(:requests, :ignore_index_errors=>true) do
      primary_key :index
      String :id, :size=>255, :null=>false
      String :verb, :size=>255
      String :url, :size=>255
      String :direction, :size=>255
      Integer :status
      String :name, :size=>255
      String :request_body, :text=>true
      String :response_body, :text=>true
      foreign_key :result_id, :results, :type=>String, :size=>255
      foreign_key :test_session_id, :test_sessions, :type=>String, :size=>255
      String :"[:test_session_id, :name]"
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      index [:id]
      index [:result_id]
      index [:test_session_id]
    end
    
    create_table(:result_outputs, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      foreign_key :result_id, :results, :type=>String, :size=>255
      String :test_output_id, :size=>255
      String :value, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      primary_key [:id]
      
      index [:result_id]
    end
    
    create_table(:result_prompt_values, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      foreign_key :result_id, :results, :type=>String, :size=>255
      String :test_prompt_id, :size=>255, :null=>false
      String :value, :size=>255, :null=>false
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      primary_key [:id]
      
      index [:result_id]
    end
    
    create_table(:headers, :ignore_index_errors=>true) do
      String :id, :size=>255, :null=>false
      foreign_key :request_id, :requests, :type=>String, :size=>255
      String :type, :size=>255
      String :name, :size=>255
      String :value, :size=>255
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      
      index [:id]
      index [:request_id]
    end
    
    create_table(:requests_results, :ignore_index_errors=>true) do
      foreign_key :results_id, :results, :type=>String, :size=>255, :null=>false
      foreign_key :requests_id, :requests, :type=>String, :size=>255, :null=>false
      
      index [:requests_id]
      index [:results_id]
    end
  end
end
