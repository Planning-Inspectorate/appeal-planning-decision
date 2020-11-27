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
  address_space = ["10.30.0.0/16"]
}

resource "azurerm_subnet" "network" {
  name = format(local.name_format, "network")
  resource_group_name = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.network.name
  address_prefixes = ["10.30.1.0/24"]

  service_endpoints = [
    "Microsoft.AzureCosmosDB",
    "Microsoft.KeyVault",
    "Microsoft.Storage"
  ]
}

//resource "azurerm_subnet" "private_endpoints" {
//  name = format(local.name_format, "private-endpoints")
//  resource_group_name = azurerm_resource_group.network.name
//  virtual_network_name = azurerm_virtual_network.network.name
//  address_prefixes = ["10.30.2.0/24"]
//  enforce_private_link_endpoint_network_policies = true
//}
