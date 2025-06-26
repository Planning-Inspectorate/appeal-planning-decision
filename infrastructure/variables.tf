# variables should be sorted A-Z

variable "environment" {
  description = "The name of the environment in which resources will be deployed"
  type        = string
}

variable "front_door_config" {
  description = "Config for the frontdoor in tooling subscription"
  type = object({
    name        = string
    rg          = string
    ep_name     = string
    use_tooling = bool

    managed_rule_set         = string
    managed_rule_set_version = string
  })
}

variable "web_app_config" {
  description = "Config to retrive web app details for forntdoor"
  type = object({
    name = string
    rg   = string
  })
}

variable "tags" {
  description = "A collection of tags to assign to taggable resources"
  type        = map(string)
  default     = {}
}

variable "tooling_config" {
  description = "Config for the tooling subscription resources"
  type = object({
    container_registry_name = string
    container_registry_rg   = string
    network_name            = string
    network_rg              = string
    subscription_id         = string
  })
}


variable "waf_rate_limits" {
  description = "variables used to set the WAF limits for custom rule"
  type = object({
    enabled             = bool
    duration_in_minutes = number
    threshold           = number
  })
}

variable "web_domain" {
  description = "Settings for the web app"
  type        = string
}
