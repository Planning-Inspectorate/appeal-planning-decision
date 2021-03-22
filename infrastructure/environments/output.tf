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

output "containers_password" {
  description = "Password for the container registry"
  sensitive = true
  value = data.azurerm_container_registry.pins.admin_password
}

output "containers_server" {
  description = "Server URL for the container registry"
  value = data.azurerm_container_registry.pins.login_server
}

output "containers_username" {
  description = "Username for the container registry"
  value = data.azurerm_container_registry.pins.admin_username
}

/*
  Groups
 */

output "group_admin_id" {
  description = "ID of the Admin AAD group"
  value = azuread_group.admin.object_id
}

output "group_user_id" {
  description = "ID of the User AAD group"
  value = azuread_group.user.object_id
}

/*
  Horizon
 */

output "horizon_public_ip" {
  description = "IP of the incoming Horizon VPN connection"
  value = try(azurerm_public_ip.horizon.0.ip_address, null)
}

output "horizon_address_spaces" {
  description = "Horizon incoming address spaces"
  value = try(azurerm_subnet.horizon.0.address_prefixes, [])
}

/*
  Key Vault
 */

output "key_vault_name" {
  description = "Key vault name"
  value = azurerm_key_vault.key_vault.name
}

output "key_vault_secrets" {
  description = "Secrets JSON key/value pairs to be ingested into Key Vault - done externally to avoid Terraform refresh permissions errors. Values must be strings."
  sensitive = true
  value = jsonencode(merge({
    fwa-session-key = random_string.fwa-session-key.result
    docs-blob-storage-connection-string = azurerm_storage_account.documents.primary_connection_string
    lpa-questionnaire-session-key = random_string.lpa-questionnaire-session-key.result
    message-queue = {
      password = azurerm_servicebus_namespace.message_queue.default_primary_key
      username = "RootManageSharedAccessKey"
    }
    mongodb-connection-url = azurerm_cosmosdb_account.mongodb.connection_strings[0]
  }, { for id, db in var.mongodb_databases :
    "mongodb-${db.name}-store" => {
      url = replace("${azurerm_cosmosdb_account.mongodb.connection_strings[0]}&retrywrites=false", "/?", "/${db.name}?")
    }
  }))
}

/*
  Kubernetes
 */

output "kubeconfig" {
  description = "The Kubernetes config file"
  sensitive = true
  value = try(var.k8s_rbac_enabled ? azurerm_kubernetes_cluster.k8s.kube_admin_config_raw : azurerm_kubernetes_cluster.k8s.kube_config_raw, null)
}

output "kube_load_balancer_domain_label" {
  description = "The DNS label of the load balancer for the Kubernetes cluster"
  value = try(azurerm_public_ip.k8s.domain_name_label, null)
}

output "kube_load_balancer_ip" {
  description = "The IP of the load balancer for the Kubernetes cluster"
  value = try(azurerm_public_ip.k8s.ip_address, null)
}

output "kube_load_balancer_rg" {
  description = "The rosource group the load balancer IP exists in"
  value = try(azurerm_resource_group.k8s.name, null)
}

output "message_queue_host" {
  value = "${azurerm_servicebus_namespace.message_queue.name}.servicebus.windows.net"
}

/*
  MongoDB
 */

output "mongodb_connection_strings" {
  description = "MongoDB connection strings for each database"
  sensitive = true
  value = try({ for id, db in var.mongodb_databases :
  db.name => {
    url = replace("${azurerm_cosmosdb_account.mongodb.connection_strings[0]}&retrywrites=false", "/?", "/${db.name}?")
  }
  }, {})
}

output "mongodb_id" {
  description = "ID of the MongoDB instance"
  sensitive = true
  value = azurerm_cosmosdb_account.mongodb.id
}
