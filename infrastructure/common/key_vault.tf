resource "azurerm_resource_group" "key_vault" {
  location = var.location
  name = format(local.name_format, "vault")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "azurerm_key_vault" "key_vault" {
  location = azurerm_resource_group.containers.location
  name = substr(format(local.name_format, "vault"), 0, 24)
  resource_group_name = azurerm_resource_group.key_vault.name
  sku_name = "standard"
  enabled_for_disk_encryption = true
  tenant_id = data.azurerm_client_config.current.tenant_id
  soft_delete_enabled = true
  soft_delete_retention_days  = 7
  purge_protection_enabled = false

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "backup",
      "delete",
      "get",
      "list",
      "recover",
      "restore",
      "set"
    ]
  }

  network_acls {
    default_action = "Deny"
    bypass = "AzureServices"
  }
}
