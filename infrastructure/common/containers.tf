resource "azurerm_resource_group" "containers" {
  location = var.location
  name = format(local.name_format, "containers")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "containers" {
  max = 9999
  min = 1000
}

resource "azurerm_container_registry" "containers" {
  location = azurerm_resource_group.containers.location
  name = replace(format(local.name_format, "containers-${random_integer.containers.result}"), "-", "")
  resource_group_name = azurerm_resource_group.containers.name
  admin_enabled = true
  sku = var.container_sku_type
}
