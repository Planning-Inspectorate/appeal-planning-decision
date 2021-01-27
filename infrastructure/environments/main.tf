/**
 * # Environments
 *
 * Infrastructure which the applications are deployed to
 *
 * ## Service Principal permissions:
 *
 * ### Subscription IAM
 * - Contributor
 * - User Access Administrator
 *
 * ### Active Directory API Permissions
 * - Delegation:
 *   - Directory.ReadWrite.All
 *   - Group.ReadWrite.All
 * - Application
 *   - Application.ReadWrite.All
 *
 * [Read more](https://simonemms.com/blog/2021/01/10/setting-terraform-service-principal-to-work-with-azure-active-directory)
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
  subscription_id = var.target_subscription_id
  features {}
}

provider "azurerm" {
  alias = "pins-odt"
  features {}
}

# Controls access to the main PINS subscription - "read" access is required
provider "azurerm" {
  alias = "pins-acphzn-prod"
  subscription_id = var.pins_key_vault_subscription_id
  features {}
}

data "azurerm_client_config" "current" {}

data "azurerm_container_registry" "pins" {
  name = var.container_registry_name
  resource_group_name = var.container_registry_rg_name

  provider = azurerm.pins-odt
}

data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}
