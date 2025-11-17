# Base class for all service objects in Core
# Pattern: ServiceClass.call(params) returning OpenStruct with success?, data, and errors
require "ostruct"

module Core
  class ApplicationService
    class << self
      def call(*args, **kwargs, &block)
        new(*args, **kwargs).call(&block)
      end
    end

    def initialize(*args, **kwargs)
      @args = args
      @kwargs = kwargs
    end

    def call
      raise NotImplementedError, "Subclasses must implement #call"
    end

    protected

    attr_reader :args, :kwargs

    def success(data = nil)
      OpenStruct.new(success?: true, data: data, errors: [])
    end

    def failure(errors, data = nil)
      errors = [errors] unless errors.is_a?(Array)
      OpenStruct.new(success?: false, data: data, errors: errors)
    end
  end
end
