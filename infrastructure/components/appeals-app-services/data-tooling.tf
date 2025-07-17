data "azurerm_private_dns_zone" "internal" {
  name = var.internal_dns_name

  provider = azurerm.tooling
}

data "azurerm_client_config" "current" {}
