resource "azurerm_resource_group" "monitoring" {
  location = var.location
  name = format(local.name_format, "monitoring")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

module "monitoring_rg_roles" {
  source = "../modules/resource-group-aad-roles"

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.monitoring.id
  user_group_id = azuread_group.user.id
}

resource "azurerm_log_analytics_workspace" "monitoring" {
  name = format(local.name_format, "monitoring")
  location = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  sku = "PerGB2018"
}

resource "azurerm_log_analytics_solution" "monitoring" {
  solution_name = "ContainerInsights"
  location = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  workspace_name = azurerm_log_analytics_workspace.monitoring.name
  workspace_resource_id = azurerm_log_analytics_workspace.monitoring.id

  plan {
    publisher = "Microsoft"
    product = "OMSGallery/ContainerInsights"
  }
}

resource "azurerm_application_insights" "monitoring" {
  name = format(local.name_format, "monitoring")
  application_type = "web"
  location = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
}

resource "azurerm_application_insights_web_test" "ping_test" {
  count = local.monitoring_ping_tests_count

  name = var.monitoring_ping_urls[count.index].name
  location = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  application_insights_id = azurerm_application_insights.monitoring.id
  description = "Perform a ping test for ${var.monitoring_ping_urls[count.index].url}"
  geo_locations = var.monitoring_ping_locations
  kind = "ping"
  frequency = var.monitoring_ping_frequency
  enabled = true

  configuration = <<XML
<WebTest
  Name="${var.monitoring_ping_urls[count.index].name}"
  Id="ABD48585-0831-40CB-9069-682EA6BB3583"
  Enabled="True"
  CssProjectStructure=""
  CssIteration=""
  Timeout="0"
  WorkItemIds=""
  xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010"
  Description=""
  CredentialUserName=""
  CredentialPassword=""
  PreAuthenticate="True"
  Proxy="default"
  StopOnError="False"
  RecordedResultFile=""
  ResultsLocale="">
  <Items>
    <Request
      Method="GET"
      Guid="a5f10126-e4cd-570d-961c-cea43999a200"
      Version="1.1"
      Url="${var.monitoring_ping_urls[count.index].url}"
      ThinkTime="0"
      Timeout="${var.monitoring_ping_frequency}"
      ParseDependentRequests="True"
      FollowRedirects="True"
      RecordResult="True"
      Cache="False"
      ResponseTimeGoal="0"
      Encoding="utf-8"
      ExpectedHttpStatusCode="200"
      ExpectedResponseUrl=""
      ReportingName=""
      IgnoreHttpStatusCode="False" />
  </Items>
</WebTest>
XML

  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_monitor_action_group" "monitoring" {
  count = local.monitoring_alert_email_count

  name = format(local.name_format, "monitoring_critical_alert")
  resource_group_name = azurerm_resource_group.monitoring.name
  short_name = substr("PINS ${local.workspace_name}", 0, 12)
  enabled = true

  email_receiver {
    email_address = var.monitoring_alert_email
    name = "PINS DevOps"
    use_common_alert_schema = true
  }
}

resource "azurerm_monitor_metric_alert" "web_ping_test" {
  count = local.monitoring_ping_tests_count

  name = var.monitoring_ping_urls[count.index].name
  resource_group_name = azurerm_resource_group.monitoring.name
  scopes = [
    azurerm_application_insights_web_test.ping_test[count.index].id,
    azurerm_application_insights.monitoring.id
  ]
  description = "Alert for errors on ${var.monitoring_ping_urls[count.index].url}"
  severity = 0

  application_insights_web_test_location_availability_criteria {
    web_test_id = azurerm_application_insights_web_test.ping_test[count.index].id
    component_id = azurerm_application_insights.monitoring.id
    failed_location_count = 2
  }

  action {
    action_group_id = azurerm_monitor_action_group.monitoring[count.index].id
  }
}

resource "azurerm_monitor_scheduled_query_rules_alert" "horizon_ping_test" {
  count = local.monitoring_alert_email_count

  name = "horizon-ping-test"
  location = azurerm_resource_group.monitoring.location
  resource_group_name = azurerm_resource_group.monitoring.name
  data_source_id = azurerm_log_analytics_workspace.monitoring.id
  severity = 1
  frequency = 5
  time_window = 5
  query = <<-EOT
InsightsMetrics
| where parse_json(Tags).service == "horizon_ping"
| where Name == "application_health"
| where Val == 0
| summarize AggregatedValue=count(Val) by bin(TimeGenerated, 5m)
| order by TimeGenerated desc
EOT

  trigger  {
    operator = "GreaterThan"
    threshold = 0
  }

  description = "Checks logs for Horizon connectivity failure"
  enabled = true

  action {
    action_group = [azurerm_monitor_action_group.monitoring[count.index].id]
    email_subject = "Horizon Ping Test Failed: ${local.workspace_name}"
  }
}

# Saved searched

resource "azurerm_log_analytics_saved_search" "horizon_ping" {
  name = format(local.name_format, "monitoring_horizon_ping")
  display_name = "Horizon Ping"

  log_analytics_workspace_id = azurerm_log_analytics_workspace.monitoring.id
  category = "PINS"
  query = <<EOT
InsightsMetrics
| where parse_json(Tags).service == "horizon_ping"
| where Name == "application_health"
| summarize AggregatedValue=avg(Val) by bin(TimeGenerated, 1m)
| order by TimeGenerated desc
| render scatterchart
EOT
}
