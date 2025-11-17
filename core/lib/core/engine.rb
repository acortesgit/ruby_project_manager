module Core
  class Engine < ::Rails::Engine
    isolate_namespace Core

    # Load migrations from main app (they're in db/migrate)
    initializer :append_migrations do |app|
      unless app.root.to_s.match root.to_s
        config.paths["db/migrate"].expanded.each do |expanded_path|
          app.config.paths["db/migrate"] << expanded_path
        end
      end
    end
  end
end
