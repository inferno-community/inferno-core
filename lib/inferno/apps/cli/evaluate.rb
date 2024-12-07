require_relative '../../../inferno/dsl/fhir_evaluator/evaluator'

module Inferno
  module CLI
    class Evaluate
      def run(ig_path, data_path, _log_level)
        validate_args(ig_path, data_path)

        # IG Import, rule execution, and result output below will be integrated at phase 2 and 3.

        # @ig = File.join(__dir__, 'ig', ig_path)
        # if data_path
        #   DatasetLoader.from_path(File.join(__dir__, data_path))
        # else
        #   ig.examples
        # end

        # config = Config.new
        # evaluator = Inferno::DSL::FHIREvaluation::Evaluator.new(data, config)

        # results = evaluate()
        # output_results(results, options[:output])
      end

      def validate_args(ig_path, data_path)
        raise 'A path to an IG is required!' unless ig_path

        return unless data_path && (!File.directory? data_path)

        raise "Provided path '#{data_path}' is not a directory"
      end

      def output_results(results, output)
        if output&.end_with?('json')
          oo = FhirEvaluator::EvaluationResult.to_operation_outcome(results)
          File.write(output, oo.to_json)
          puts "Results written to #{output}"
        else
          counts = results.group_by(&:severity).transform_values(&:count)
          print(counts, 'Result Count')
          puts "\n"
          puts results
        end
      end

      def print(output_fields, title)
        puts("╔══════════════ #{title} ═══════════════╗")
        puts('║ ╭────────────────┬──────────────────────╮ ║')
        output_fields.each_with_index do |(key, value), i|
          field_name = pad(key, 14)
          field_value = pad(value.to_s, 20)
          puts("║ │ #{field_name} │ #{field_value} │ ║")
          puts('║ ├────────────────┼──────────────────────┤ ║') unless i == output_fields.length - 1
        end
        puts('║ ╰────────────────┴──────────────────────╯ ║')
        puts('╚═══════════════════════════════════════════╝')
      end

      def pad(string, length)
        format("%#{length}.#{length}s", string)
      end
    end
  end
end
