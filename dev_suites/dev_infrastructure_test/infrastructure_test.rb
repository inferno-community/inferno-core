require_relative 'external_outer_group'

module InfrastructureTest
  class Suite < Inferno::TestSuite
    id 'infra_test'
    title 'Infrastructure Test'
    description 'An internal test suite to verify that inferno infrastructure is working'

    input :suite_input
    output :suite_output

    def suite_helper
      'SUITE_HELPER'
    end

    fhir_client :suite do
      url 'SUITE'
    end

    group 'Outer inline group', id: 'outer_inline_group' do
      input :outer_group_input
      output :outer_group_output

      def outer_inline_group_helper
        'OUTER_INLINE_GROUP_HELPER'
      end

      fhir_client :outer_inline_group do
        url 'OUTER_INLINE_GROUP'
      end

      group 'Inner inline group', id: 'inner_inline_group' do
        input :inner_group_input
        output :inner_group_output

        def inner_inline_group_helper
          'INNER_INLINE_GROUP_HELPER'
        end

        fhir_client :inner_inline_group do
          url 'INNER_INLINE_GROUP'
        end

        test 'Inline test 1', id: 'inline_test_1' do
          input :test_input
          output :test_output

          def inline_test1_helper
            'INLINE_TEST1_HELPER'
          end

          fhir_client :inline_test1 do
            url 'INLINE_TEST1'
          end

          run { assert inline_test1_helper == 'INLINE_TEST1_HELPER' }
        end

        test 'Inline test 2', id: 'inline_test_2' do
          run { assert inner_inline_group_helper == 'INNER_INLINE_GROUP_HELPER' }
        end

        test 'Inline test 3', id: 'inline_test_3' do
          run { assert outer_inline_group_helper == 'OUTER_INLINE_GROUP_HELPER' }
        end

        test 'Inline test 4', id: 'inline_test_4' do
          run { assert suite_helper == 'SUITE_HELPER' }
        end
      end
    end

    group from: 'external_outer_group'
  end
end
