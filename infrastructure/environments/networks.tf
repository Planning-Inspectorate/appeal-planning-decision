resource "azurerm_resource_group" "network" {
  location = var.location
  name = format(local.name_format, "network")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "azurerm_virtual_network" "network" {
  name = format(local.name_format, "network")
  location = azurerm_resource_group.network.location
  resource_group_name = azurerm_resource_group.network.name
  address_space = [ var.network_subnet_range ]
}

resource "azurerm_subnet" "network" {
  name = format(local.name_format, "network")
  resource_group_name = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.network.name
  address_prefixes = [ cidrsubnet(var.network_subnet_range, 8, 1) ]

  service_endpoints = [
    "Microsoft.AzureCosmosDB",
    "Microsoft.KeyVault",
    "Microsoft.Storage"
  ]
}
