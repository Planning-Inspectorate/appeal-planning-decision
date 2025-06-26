environment = "dev"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-appeals"
  use_tooling = true

  managed_rule_set         = "Microsoft_DefaultRuleSet"
  managed_rule_set_version = "2.1"
}

web_app_config = {
  name = "pins-app-appeals-service-appeals-wfe-dev-ukw-001"
  rg   = "pins-rg-appeals-service-dev-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "appeals-service-dev.planninginspectorate.gov.uk"

