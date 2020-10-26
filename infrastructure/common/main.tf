terraform {
  backend "azurerm" {
    resource_group_name = "pins-uk-terraform-rg"
    storage_account_name = "pinsf4terraform"
    container_name = "tfstate"
    key = "common.tfstate"
  }
}

provider "azurerm" {
  version = "~> 2.31.1"
  features {}
}

provider "github" {
  version = "~> 2.9"
  organization = var.github_org_name
  token = var.github_token
}

data "azurerm_client_config" "current" {}
