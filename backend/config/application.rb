require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module SoundSketch
  class Application < Rails::Application
    config.load_defaults 8.1
    config.paths['public'] = File.expand_path('../../frontend', __dir__)
    config.autoload_lib(ignore: %w[assets tasks])
  end
end

