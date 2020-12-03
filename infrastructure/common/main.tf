/**
 * # Common Infrastructure
 *
 * Infrastructure which is common to the subscription, regardless of which environment
 */

terraform {
  backend "azurerm" {
    resource_group_name = "pins-uk-terraform-rg"
    storage_account_name = "pinsodtterraform"
    container_name = "tfstate"
    key = "common.tfstate"
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_client_config" "current" {}
