resource "azurerm_resource_group" "monitoring" {
  count = local.monitoring_ping_tests_count

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
  count = local.monitoring_ping_tests_count

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.monitoring[count.index].id
  user_group_id = azuread_group.user.id
}

resource "azurerm_application_insights" "monitoring" {
  count = local.monitoring_ping_tests_count

  name = format(local.name_format, "monitoring")
  application_type = "web"
  location = azurerm_resource_group.monitoring[count.index].location
  resource_group_name = azurerm_resource_group.monitoring[count.index].name
}

resource "azurerm_application_insights_web_test" "ping_test" {
  count = local.monitoring_ping_tests_count

  name = var.monitoring_ping_urls[count.index].name
  location = azurerm_resource_group.monitoring[count.index].location
  resource_group_name = azurerm_resource_group.monitoring[count.index].name
  application_insights_id = azurerm_application_insights.monitoring[count.index].id
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
  count = local.monitoring_ping_tests_count == 1 && local.monitoring_alert_email_count == 1 ? 1 : 0

  name = "Critical alert"
  resource_group_name = azurerm_resource_group.monitoring[count.index].name
  short_name = "PINS Alert"
  enabled = true

  email_receiver {
    email_address = var.monitoring_alert_email
    name = "PINS DevOps"
    use_common_alert_schema = true
  }
}

resource "azurerm_monitor_metric_alert" "monitoring" {
  count = local.monitoring_ping_tests_count == 1 && local.monitoring_alert_email_count == 1 ? 1 : 0

  name = var.monitoring_ping_urls[count.index].name
  resource_group_name = azurerm_resource_group.monitoring[count.index].name
  scopes = [
    azurerm_application_insights_web_test.ping_test[count.index].id,
    azurerm_application_insights.monitoring[count.index].id
  ]
  description = "Alert for errors on ${var.monitoring_ping_urls[count.index].url}"

  application_insights_web_test_location_availability_criteria {
    web_test_id = azurerm_application_insights_web_test.ping_test[count.index].id
    component_id = azurerm_application_insights.monitoring[count.index].id
    failed_location_count = 2
  }

  action {
    action_group_id = azurerm_monitor_action_group.monitoring[count.index].id
  }
}
