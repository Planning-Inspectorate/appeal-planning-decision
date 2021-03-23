/**
 * # Common Infrastructure
 *
 * Infrastructure which is common to the subscription, regardless of which environment
 */

terraform {
  required_version = "0.14.0"

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

provider "github" {
  organization = var.github_org_name
  token = var.github_token
}

data "azurerm_client_config" "current" {}
