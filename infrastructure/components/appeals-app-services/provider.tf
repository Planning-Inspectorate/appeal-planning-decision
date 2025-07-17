terraform {
  required_providers {
    azurerm = {
      source                = "hashicorp/azurerm"
      version               = "> 4"
      configuration_aliases = [azurerm, azurerm.tooling]
    }
  }
}
