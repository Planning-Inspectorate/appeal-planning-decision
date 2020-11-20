/**
 * # Environments
 *
 * Infrastructure which the applications are deployed to
 */

terraform {
  backend "azurerm" {
    resource_group_name = "pins-uk-terraform-rg"
    storage_account_name = "pinsf4terraform"
    container_name = "tfstate"
    key = "environments.tfstate"
  }
}

provider "azurerm" {
  version = "~> 2.31.1"
  features {}
}

provider "http" {
  version = "~> 2.0.0"
}

provider "random" {
  version = "~> 3.0.0"
}

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "pins" {
  name = var.container_registry_name
  resource_group_name = var.container_registry_rg_name
}

data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}
