module Inferno
  module Exceptions
    class TestResultException < RuntimeError
    end

    class AssertionException < TestResultException
      def result
        'fail'
      end
    end

    class SkipException < TestResultException
      def result
        'skip'
      end
    end

    class OmitException < TestResultException
      def result
        'omit'
      end
    end

    class PassException < TestResultException
      def result
        'pass'
      end
    end

    class WaitException < TestResultException
      def result
        'wait'
      end
    end

    class CancelException < TestResultException
      def result
        'cancel'
      end
    end

    class ParentNotLoadedException < RuntimeError
      def initialize(klass, id)
        super("No #{klass.name.demodulize} found with id '#{id}'")
      end
    end

    class ValidatorNotFoundException < RuntimeError
      def initialize(validator_name)
        super("No '#{validator_name}' validator found")
      end
    end
  end
end
