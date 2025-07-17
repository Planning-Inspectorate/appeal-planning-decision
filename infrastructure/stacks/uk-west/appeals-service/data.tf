data "azurerm_client_config" "current" {}

data "azurerm_private_dns_zone" "app_config" {
  name = "privatelink.azconfig.io"

  provider = azurerm.tooling
}

data "azurerm_private_dns_zone" "app_service" {
  name = "privatelink.azurewebsites.net"

  provider = azurerm.tooling
}

data "azurerm_private_dns_zone" "cosmosdb" {
  name = "privatelink.mongo.cosmos.azure.com"

  provider = azurerm.tooling
}

data "azurerm_private_dns_zone" "database" {
  name = "privatelink.database.windows.net"

  provider = azurerm.tooling
}

data "azurerm_monitor_action_group" "tech" {
  resource_group_name = var.common_resource_group_name
  name                = var.action_group_names.tech
}
