resource "azurerm_log_analytics_workspace" "appeals_service" {
  name                = "pins-log-${local.service_name}-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.appeals_service_stack.name
  location            = azurerm_resource_group.appeals_service_stack.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  daily_quota_gb      = 1

  tags = local.tags
}

resource "azurerm_application_insights" "web_app_insights" {
  name                = "pins-ai-${local.service_name}-${local.resource_suffix}-app-insights"
  location            = azurerm_resource_group.appeals_service_stack.location
  resource_group_name = azurerm_resource_group.appeals_service_stack.name
  workspace_id        = azurerm_log_analytics_workspace.appeals_service.id
  application_type    = "web"
}

# availability test for the portal app
resource "azurerm_application_insights_standard_web_test" "portal" {
  count = var.monitoring_config.app_insights_web_test_enabled ? 1 : 0

  name                    = "${local.service_name}-ai-swt-${local.resource_suffix}"
  resource_group_name     = azurerm_resource_group.appeals_service_stack.name
  location                = azurerm_resource_group.appeals_service_stack.location
  application_insights_id = azurerm_application_insights.web_app_insights.id
  geo_locations = [
    "emea-se-sto-edge", # UK West
    "emea-ru-msa-edge", # UK South
    "emea-gb-db3-azr",  # North Europe
    "emea-nl-ams-azr"   # West Europe
  ]
  retry_enabled = true
  enabled       = true

  request {
    url = "https://${var.appeals_service_public_url}"
  }

  validation_rules {
    ssl_check_enabled           = true
    ssl_cert_remaining_lifetime = 7
  }

  tags = local.tags
}

resource "azurerm_monitor_metric_alert" "web_availability" {
  count = var.monitoring_config.app_insights_web_test_enabled ? 1 : 0

  name                = "Web Availablity - ${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.appeals_service_stack.name
  scopes = [
    azurerm_application_insights_standard_web_test.portal[0].id,
    azurerm_application_insights.web_app_insights.id
  ]
  description = "Metric alert for standard web test (availability) for the web app - which also checks the certificate"

  application_insights_web_test_location_availability_criteria {
    web_test_id           = azurerm_application_insights_standard_web_test.portal[0].id
    component_id          = azurerm_application_insights.web_app_insights.id
    failed_location_count = 1
  }

  action {
    action_group_id = var.action_group_ids.tech
  }
  action {
    action_group_id = var.action_group_ids.service_manager
  }
  action {
    action_group_id = var.action_group_ids.its
  }
}

resource "azurerm_monitor_scheduled_query_rules_alert_v2" "web_app_insights" {
  name         = "horizon-submission-failure-alerts"
  display_name = "horizon appeal submission failures"
  description  = "Triggered when the horizon submission process fails more than 3 times in an hour"

  location            = azurerm_resource_group.appeals_service_stack.location
  resource_group_name = azurerm_resource_group.appeals_service_stack.name
  scopes              = [module.app_services.app_service_ids["appeals_service_api_${module.azure_region_primary.location_short}"]]



  enabled                          = var.monitoring_alerts_enabled
  auto_mitigation_enabled          = true
  workspace_alerts_storage_enabled = false

  evaluation_frequency = "PT10M"
  window_duration      = "PT2H"

  criteria {
    query                   = <<-QUERY
      AppServiceConsoleLogs
      | where ResultDescription has "scheduled submission to horizon has errored|failed|uncompleted submissions"
        or ResultDescription has "scheduled submission to horizon has failed"
      QUERY
    time_aggregation_method = "Count"
    threshold               = 2
    operator                = "GreaterThan"
  }

  severity = 1
  action {
    action_groups = [
      var.action_group_ids.tech,
      var.action_group_ids.service_manager,
      var.action_group_ids.its
    ]
  }
}
