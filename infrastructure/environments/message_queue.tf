resource "azurerm_resource_group" "message_queue" {
  location = var.location
  name = format(local.name_format, "message-queue")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "azurerm_servicebus_namespace" "message_queue" {
  name = format(local.name_format, "message-queue")
  location = azurerm_resource_group.message_queue.location
  resource_group_name = azurerm_resource_group.message_queue.name
  sku = var.message_queue_sku
  capacity = var.message_queue_capacity
  zone_redundant = var.message_queue_zone_redundancy_enabled
}

