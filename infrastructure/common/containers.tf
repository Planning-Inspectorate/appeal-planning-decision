resource "azurerm_resource_group" "containers" {
  location = var.location
  name = format(local.name_format, "containers")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "azurerm_container_registry" "containers" {
  location = azurerm_resource_group.containers.location
  name = replace(format(local.name_format, "containers"), "-", "")
  resource_group_name = azurerm_resource_group.containers.name
  admin_enabled = true
  sku = var.container_sku_type
}
