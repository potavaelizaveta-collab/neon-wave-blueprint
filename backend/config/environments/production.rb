Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.force_ssl = false
  config.log_level = :info
  config.active_storage.service = :local
end
