/*
  Misc
 */

output "app-name" {
  description = "The application name - used for identifying resource groups"
  value = local.app_name
}

/*
  Containers
 */

output "containers_location" {
  description = "Location of the container registry"
  value = azurerm_resource_group.containers.location
}

output "containers_name" {
  description = "Name of the container registry"
  value = azurerm_container_registry.containers.name
}

output "containers_password" {
  description = "Password for the container registry"
  sensitive = true
  value = azurerm_container_registry.containers.admin_password
}

output "containers_rg_name" {
  description = "Resource group name for the container registry"
  value = azurerm_resource_group.containers.name
}

output "containers_server" {
  description = "Server URL for the container registry"
  value = azurerm_container_registry.containers.login_server
}

output "containers_username" {
  description = "Username for the container registry"
  value = azurerm_container_registry.containers.admin_username
}

/*
  Key Vault
 */

output "key_vault_id" {
  description = "ID of the key vault"
  value = azurerm_key_vault.key_vault.id
}
