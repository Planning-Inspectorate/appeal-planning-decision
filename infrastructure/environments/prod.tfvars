environment = "prod"

front_door_config = {
  name        = "pins-fd-common-prod"
  rg          = "pins-rg-common-prod"
  ep_name     = "pins-fde-appeals"
  use_tooling = false
}

web_app_config = {
  name = "pins-app-appeals-service-appeals-wfe-prod-ukw-001"
  rg   = "pins-rg-appeals-service-prod-ukw-001"
}

odt_config = {
  subscription_id = "d1d6c393-2fe3-40af-ac27-f5b6bad36735"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "appeal-planning-decision.service.gov.uk"
