environment = "staging"

front_door_config = {
  name        = "pins-fd-common-tooling"
  rg          = "pins-rg-common-tooling"
  ep_name     = "pins-fde-appeals"
  use_tooling = true

  managed_rule_set         = "DefaultRuleSet"
  managed_rule_set_version = "1.0"
}

web_app_config = {
  name = "pins-app-appeals-service-appeals-wfe-staging-ukw-001"
  rg   = "pins-rg-appeals-service-staging-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "appeals-service-staging.planninginspectorate.gov.uk"
