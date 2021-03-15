/**
 * # Resource Group AAD Roles
 *
 * Provides base ActiveDirectory roles for a resource group
 */

terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.31.1"
    }
  }
}

resource "azurerm_role_assignment" "admin_logs" {
  principal_id = var.admin_group_id
  scope = var.resource_group_id
  role_definition_name = "Log Analytics Contributor"
}

resource "azurerm_role_assignment" "user_logs" {
  principal_id = var.user_group_id
  scope = var.resource_group_id
  role_definition_name = "Log Analytics Reader"
}
