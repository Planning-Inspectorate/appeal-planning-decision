environment = "dev"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-appeals"
  use_tooling = true
}

linux_app_config = {
  name     = "pins-app-appeals-service-appeals-wfe-dev-ukw-001"
  rg       = "pins-rg-appeals-service-dev-ukw-001"
  hostname = "pins-app-appeals-service-appeals-wfe-dev-ukw-001.azurewebsites.net"
}

# odt_config = {
#   subscription_id = "962e477c-0f3b-4372-97fc-a198a58e259e"
# }

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "appeals-service-dev.planninginspectorate.gov.uk"
