environment = "prod"

front_door_config = {
  name        = "pins-fd-common-prod"
  rg          = "pins-rg-common-prod"
  ep_name     = "pins-fde-appeals-prod"
  use_tooling = false

  managed_rule_set         = "DefaultRuleSet"
  managed_rule_set_version = "1.0"
}

web_app_config = {
  name = "pins-app-appeals-service-appeals-wfe-prod-ukw-001"
  rg   = "pins-rg-appeals-service-prod-ukw-001"
}

waf_rate_limits = {
  enabled             = true
  duration_in_minutes = 5
  threshold           = 1500
}

web_domain = "appeal-planning-decision.service.gov.uk"
