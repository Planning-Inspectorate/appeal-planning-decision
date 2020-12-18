/**
 * # Environments
 *
 * Infrastructure which the applications are deployed to
 */

terraform {
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

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "pins" {
  name = var.container_registry_name
  resource_group_name = var.container_registry_rg_name
}

data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}
