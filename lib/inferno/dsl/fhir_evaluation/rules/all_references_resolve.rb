# frozen_string_literal: true

require_relative '../reference_extractor'

module Inferno
  module DSL
    module FHIREvaluation
      module Rules
        class AllReferencesResolve < Rule
          def check(context)
            extractor = Inferno::DSL::FHIREvaluation::ReferenceExtractor.new
            resource_path_ids = extractor.extract_resource_path_ids(context.data)
            references = extractor.extract_references(context.data, resource_path_ids)

            unresolved_references = Hash.new { |h, k| h[k] = [] }
            references.each do |id, reference_values|
              reference_values.each do |reference|
                if reference[1] == ''
                  unresolved_references[id] << reference unless resource_ids.include?(reference[2])
                elsif !resource_path_ids[reference[1]].include?(reference[2])
                  unresolved_references[id] << reference
                end
              end
            end

            if unresolved_references.any?
              message = gen_reference_fail_message(unresolved_references)
              result = EvaluationResult.new(message, rule: self)
            else
              message = 'All references resolve'
              result = EvaluationResult.new(message, severity: 'success', rule: self)
            end

            result
          end

          def gen_reference_fail_message(unresolved_references)
            result_message = unresolved_references.map do |k, v|
              "\n Resource (id): #{k}  #{v.each_with_index.map do |val, _idx|
                                           val.each_with_index.map do |value, index|
                                             case index
                                             when 0
                                               " \n\tpath: #{value}"
                                             when 1
                                               " type: #{value}"
                                             when 2
                                               " id: #{value}"
                                             end
                                           end
                                         end.join(',')}"
            end.join(',')

            "Found unresolved references: #{result_message}"
          end
        end
      end
    end
  end
end
