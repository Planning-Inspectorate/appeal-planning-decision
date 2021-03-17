resource "azurerm_resource_group" "message_queue" {
  location = var.location
  name = format(local.name_format, "message-queue")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

module "message_queue_rg_roles" {
  source = "../modules/resource-group-aad-roles"

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.message_queue.id
  user_group_id = azuread_group.user.id
}

resource "azurerm_servicebus_namespace" "message_queue" {
  name = format(local.name_format, "message-queue")
  location = azurerm_resource_group.message_queue.location
  resource_group_name = azurerm_resource_group.message_queue.name
  sku = var.message_queue_sku
  capacity = var.message_queue_capacity
  zone_redundant = var.message_queue_zone_redundancy_enabled
}

resource "azurerm_monitor_metric_alert" "abandoned_message_alert" {
  count = local.monitoring_alert_email_count

  name = azurerm_servicebus_namespace.message_queue.name
  resource_group_name = azurerm_resource_group.message_queue.name
  scopes = [azurerm_servicebus_namespace.message_queue.id]
  description = "Alert for abandoned messages on ${azurerm_servicebus_namespace.message_queue.name}"
  severity = 1
  # Only check once per hour for things in that window
  frequency = "PT1H"
  window_size = "PT1H"

  criteria {
    aggregation = "Total"
    metric_name = "AbandonMessage"
    metric_namespace = "Microsoft.ServiceBus/namespaces"
    operator = "GreaterThanOrEqual"
    threshold = 1
  }

  action {
    action_group_id = azurerm_monitor_action_group.monitoring[count.index].id
  }

}
