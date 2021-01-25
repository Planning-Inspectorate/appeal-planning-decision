/**
  Networks

  There are two logical states that the network can be in.
  1) Create everything (default behaviour, used in PINS-ODT subscription)
  2) Use existing network, create subnet (used in PINS-ACPHAZ-PROD subscription)

  If doing the former then, if a Horizon connection is desired, it must
  be done over a VPN. If the latter, this is connected to the same network
  as Horizon so can access over that.
 */

/* Option 1 - create everything */
resource "azurerm_resource_group" "network" {
  count = var.network_create_own ? 1 : 0

  location = var.location
  name = format(local.name_format, "network")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "azurerm_virtual_network" "network" {
  count = var.network_create_own ? 1 : 0

  name = format(local.name_format, "network")
  location = azurerm_resource_group.network[count.index].location
  resource_group_name = azurerm_resource_group.network[count.index].name
  address_space = ["10.30.0.0/16"]
}

/* Option 2 - use existing PINS network */
data "azurerm_resource_group" "network" {
  count = var.network_create_own ? 0 : 1

  name = var.network_pins_resource_group
}

data "azurerm_virtual_network" "network" {
  count = var.network_create_own ? 0 : 1

  name = var.network_pins_name
  resource_group_name = data.azurerm_resource_group.network[count.index].name
}

/* Common */
resource "azurerm_subnet" "network" {
  name = format(local.name_format, "network")
  resource_group_name = var.network_create_own ? azurerm_resource_group.network.0.name : data.azurerm_resource_group.network.0.name
  virtual_network_name = var.network_create_own ? azurerm_virtual_network.network.0.name : data.azurerm_virtual_network.network.0.name
  address_prefixes = var.network_subnet

  service_endpoints = [
    "Microsoft.AzureCosmosDB",
    "Microsoft.KeyVault",
    "Microsoft.Storage"
  ]
}
