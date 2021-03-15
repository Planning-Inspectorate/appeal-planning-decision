resource "azurerm_resource_group" "key_vault" {
  location = var.location
  name = format(local.name_format, "vault")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

module "key_vault_rg_roles" {
  source = "../modules/resource-group-aad-roles"

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.key_vault.id
  user_group_id = azuread_group.user.id
}

resource "random_integer" "key_vault" {
  max = 9999
  min = 1000
}

resource "azurerm_key_vault" "key_vault" {
  location = azurerm_resource_group.key_vault.location
  name = substr(format(local.name_format, "vault-${random_integer.key_vault.result}"), 0, 24)
  resource_group_name = azurerm_resource_group.key_vault.name
  sku_name = "standard"
  enabled_for_disk_encryption = true
  tenant_id = data.azurerm_client_config.current.tenant_id
  soft_delete_enabled = true
  soft_delete_retention_days  = 7
  purge_protection_enabled = false

  network_acls {
    default_action = "Deny"
    bypass = "AzureServices"
    ip_rules = [
      "${local.current_ip}/32"
    ]
    virtual_network_subnet_ids = [
      azurerm_subnet.network.id
    ]
  }
}

resource "azurerm_key_vault_access_policy" "current-sp" {
  key_vault_id = azurerm_key_vault.key_vault.id
  object_id = data.azurerm_client_config.current.object_id
  tenant_id = data.azurerm_client_config.current.tenant_id

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
