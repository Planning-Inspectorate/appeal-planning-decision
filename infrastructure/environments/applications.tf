# Applications
#
# Infrastructure-specific configuration data for individual
# applications. This shouldn't have much stuff in there, but
# it will be useful for putting configuration data into
# Key Vault

resource "random_string" "fwa-session-key" {
  length = 32
  special = false
  upper = true
  lower = true
  number = true
}

resource "azurerm_key_vault_secret" "fwa-session-key" {
  key_vault_id = azurerm_key_vault.key_vault.id
  name = "fwa-session-key"
  value = random_string.fwa-session-key.result
}
