resource "azurerm_resource_group" "storage" {
  location = var.location
  name = format(local.name_format, "storage")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "storage" {
  max = 9999
  min = 1000
}

resource "azurerm_storage_account" "documents" {
  name = substr(replace(format(local.name_format, "docs${random_integer.storage.result}"), "-", ""), 0, 24)
  account_replication_type = "LRS"
  account_tier = "Standard"
  access_tier = "Hot"
  account_kind = "StorageV2"
  location = azurerm_resource_group.storage.location
  resource_group_name = azurerm_resource_group.storage.name

  blob_properties {
    delete_retention_policy {
      days = var.documents_soft_delete_retention
    }
  }
}

resource "azurerm_storage_account_network_rules" "documents" {
  resource_group_name = azurerm_resource_group.storage.name
  storage_account_name = azurerm_storage_account.documents.name

  default_action = "Deny"
  bypass = [
    "Logging",
    "Metrics"
  ]
  ip_rules = [
    local.current_ip
  ]
  virtual_network_subnet_ids = [
    azurerm_subnet.network.id
  ]
}

//locals {
//  storage_endpoints = toset([
//    "blob",
//    "file"
//  ])
//}
//
//resource "azurerm_private_endpoint" "storage" {
//  for_each = local.storage_endpoints
//
//  name = format(local.name_format, "storage-${each.value}")
//  location = azurerm_resource_group.storage.location
//  resource_group_name = azurerm_resource_group.network.name
//  subnet_id = azurerm_subnet.private_endpoints.id
//
//  private_service_connection {
//    is_manual_connection = false
//    subresource_names = [each.value]
//    name = azurerm_storage_account.documents.name
//    private_connection_resource_id = azurerm_storage_account.documents.id
//  }
//}
//
//resource "azurerm_private_dns_zone" "storage" {
//  for_each = local.storage_endpoints
//
//  name = azurerm_storage_account.documents["primary_${each.value}_host"]
//  resource_group_name = azurerm_resource_group.network.name
//}
