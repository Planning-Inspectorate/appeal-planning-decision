output "app_service_urls" {
  description = "A map of frontend app service URLs"
  value       = module.app_services.app_service_urls
}

output "web_frontend_url" {
  description = "The URL of the web frontend app service"
  value       = module.app_services.web_frontend_url
}

output "appeal_documents_storage_container_name" {
  description = "The Appeal Documents Storage Account container name"
  value       = azurerm_storage_account.appeal_documents.name
}

output "appeal_documents_primary_blob_host" {
  description = "The full URI for the storage account used for Appeal Documents"
  value       = azurerm_storage_account.appeal_documents.primary_blob_endpoint
}

output "appeal_documents_primary_blob_connection_string" {
  description = "The Appeal Documents Storage Account blob connection string associated with the primary location"
  sensitive   = true
  value       = azurerm_storage_account.appeal_documents.primary_blob_connection_string
}

output "cosmosdb_connection_string" {
  description = "The connection string used to connect to the MongoDB"
  sensitive   = true
  value       = azurerm_cosmosdb_account.appeals_database.primary_mongodb_connection_string
}

output "cosmosdb_id" {
  description = "The ID of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.appeals_database.id
}

output "function_apps_storage_account" {
  description = "The name of the storage account used by the Function Apps"
  value       = azurerm_storage_account.function_apps.name
}

output "function_apps_storage_account_access_key" {
  description = "The access key for the storage account used by the Function Apps"
  sensitive   = true
  value       = azurerm_storage_account.function_apps.primary_access_key
}

output "primary_appeals_sql_server_id" {
  description = "ID of the primary (ukw) Appeals SQL Server"
  value       = azurerm_mssql_server.appeals_sql_server.id
}

output "primary_appeals_sql_database_id" {
  description = "ID of the primary (ukw) Appeals SQL Database"
  value       = azurerm_mssql_database.appeals_sql_db.id
}

output "primary_appeals_sql_database_name" {
  description = "Name of the primary (ukw) Appeals SQL Database"
  value       = azurerm_mssql_database.appeals_sql_db.name
}

output "sql_server_password_admin" {
  description = "The SQL server administrator password"
  sensitive   = true
  value       = random_password.appeals_sql_server_password_admin.result
}

output "sql_server_password_app" {
  description = "The SQL server app password"
  sensitive   = true
  value       = random_password.appeals_sql_server_password_app.result
}

output "sql_server_username_admin" {
  description = "The SQL server administrator username"
  sensitive   = true
  value       = local.sql_server_username_admin
}

output "sql_server_username_app" {
  description = "The SQL server app username"
  sensitive   = true
  value       = local.sql_server_username_app
}
