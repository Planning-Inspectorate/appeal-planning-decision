# Horizon
#
# Horizon is the internal PINS software. We may need to
# connect it as an external network.
#
# This uses a Virtual Network Gateway which can take up-to
# 60 minutes to create. Do **NOT** create this if you don't
# have to. To complete the connection, someone must create
# a connection in the PINS subscription back to this VPN
# using the same shared secret.
#
# The values for the shared key and the resource ID of the
# Horizon gateway are stored in the PINS Key Vault which this
# Service Principle **MUST** have GET access for.

resource "azurerm_public_ip" "horizon" {
  count = local.horizon_count

  name = format(local.name_format, "horizon")
  location = azurerm_resource_group.network.location
  resource_group_name = azurerm_resource_group.network.name
  allocation_method = "Static"
  sku = "Standard"
}

resource "azurerm_subnet" "horizon" {
  count = local.horizon_count

  name = "GatewaySubnet"
  resource_group_name = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.network.name
  address_prefixes = ["10.30.253.0/24"]
}

resource "azurerm_virtual_network_gateway" "horizon" {
  count = local.horizon_count

  name = format(local.name_format, "horizon")
  location = azurerm_resource_group.network.location
  resource_group_name = azurerm_resource_group.network.name
  sku = var.horizon_gateway_sku
  type = "Vpn"
  vpn_type = "RouteBased"
  private_ip_address_enabled = true

  ip_configuration {
    public_ip_address_id = azurerm_public_ip.horizon[count.index].id
    private_ip_address_allocation = "Dynamic"
    subnet_id = azurerm_subnet.horizon[count.index].id
  }
}

data "azurerm_key_vault_secret" "horizon_gateway_shared_key" {
  count = local.horizon_count

  key_vault_id = var.pins_key_vault
  name = var.horizon_shared_key_secret
  provider = azurerm.pins-main
}

data "azurerm_key_vault_secret" "horizon_gateway_ip" {
  count = local.horizon_count

  key_vault_id = var.pins_key_vault
  name = var.horizon_gateway_ip_secret
  provider = azurerm.pins-main
}

data "azurerm_key_vault_secret" "horizon_gateway_subnets" {
  count = local.horizon_count

  key_vault_id = var.pins_key_vault
  name = var.horizon_gateway_subnets_secret
  provider = azurerm.pins-main
}

locals {
  # Get subnets string, remove any spaces and convert to list
  horizon_subnets = try(split(",", replace(data.azurerm_key_vault_secret.horizon_gateway_subnets.0.value, "/\\s/", "")), [])
}

# Connect to the local network gateway - this is a facade for Horizon
resource "azurerm_virtual_network_gateway_connection" "horizon" {
  count = local.horizon_count

  name = format(local.name_format, "horizon")
  resource_group_name = azurerm_resource_group.network.name
  location = azurerm_resource_group.network.location

  type = "IPsec"
  virtual_network_gateway_id = azurerm_virtual_network_gateway.horizon[count.index].id
  local_network_gateway_id = azurerm_local_network_gateway.horizon[count.index].id

  shared_key = data.azurerm_key_vault_secret.horizon_gateway_shared_key[count.index].value
}

# This acts as a facade for the Horizon VPN Gateway
resource "azurerm_local_network_gateway" "horizon" {
  count = local.horizon_count

  name = format(local.name_format, "horizon")
  resource_group_name = azurerm_resource_group.network.name
  location = azurerm_resource_group.network.location
  gateway_address = data.azurerm_key_vault_secret.horizon_gateway_ip[count.index].value
  address_space = local.horizon_subnets
}

resource "azurerm_servicebus_queue" "horizon_has_publisher" {
  name = "horizon-householder-appeal-publish"
  namespace_name = azurerm_servicebus_namespace.message_queue.name
  resource_group_name = azurerm_resource_group.message_queue.name
}
