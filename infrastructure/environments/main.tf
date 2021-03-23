/**
 * # Environments
 *
 * Infrastructure which the applications are deployed to
 */

terraform {
  required_version = "0.14.0"

  backend "azurerm" {
    resource_group_name = "pins-uk-terraform-rg"
    storage_account_name = "pinsodtterraform"
    container_name = "tfstate"
    key = "environments.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# Controls access to the main PINS subscription - "read" access is required
provider "azurerm" {
  alias = "pins-main"
  subscription_id = var.pins_key_vault_subscription_id
  features {}
}

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "pins" {
  name = var.container_registry_name
  resource_group_name = var.container_registry_rg_name
}

data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}
