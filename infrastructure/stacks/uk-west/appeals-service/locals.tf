locals {
  service_name    = "appeals-service"
  resource_suffix = "${var.environment}-${module.azure_region_primary.location_short}-${var.instance}"
  # keep the suffix short for training env, as it can only be upto 24 characters total for azurerm_storage_account
  storage_resource_suffix = var.environment == "training" ? "${var.environment}-${module.azure_region_primary.location_short}" : local.resource_suffix

  sql_server_username_admin = "pins-sql-${local.service_name}-${local.resource_suffix}-admin-${random_id.username_suffix_admin.id}"
  sql_server_username_app   = "pins-sql-${local.service_name}-${local.resource_suffix}-app-${random_id.username_suffix_app.id}"
  sql_connection_string_admin = join(
    ";",
    [
      "sqlserver://${azurerm_mssql_server.appeals_sql_server.fully_qualified_domain_name}",
      "database=${azurerm_mssql_database.appeals_sql_db.name}",
      "user=${azurerm_mssql_server.appeals_sql_server.administrator_login}",
      "password=${azurerm_mssql_server.appeals_sql_server.administrator_login_password}",
      "trustServerCertificate=false",
      "encrypt=true"
    ]
  )
  sql_connection_string_app = join(
    ";",
    [
      "sqlserver://${azurerm_mssql_server.appeals_sql_server.fully_qualified_domain_name}",
      "database=${azurerm_mssql_database.appeals_sql_db.name}",
      "user=${local.sql_server_username_app}",
      "password=${random_password.appeals_sql_server_password_app.result}",
      "trustServerCertificate=false",
      "encrypt=true"
    ]
  )

  session_mongodb_collection = "sessions"
  forms_web_app_mongodb      = "forms-web-app"
  appeals_cosmosdb_id = join(
    "/",
    [
      "/subscriptions",
      data.azurerm_client_config.current.subscription_id,
      "resourceGroups",
      "pins-rg-${local.service_name}-${local.resource_suffix}",
      "providers",
      "Microsoft.DocumentDB",
      "databaseAccounts",
      "pins-cosmos-${local.service_name}-${local.resource_suffix}",
      "mongodbDatabases",
      local.forms_web_app_mongodb
    ]
  )
  appeals_session_collection_id = join(
    "/",
    [
      local.appeals_cosmosdb_id,
      "collections",
      local.session_mongodb_collection
    ]
  )

  tags = merge(
    var.common_tags,
    {
      Region      = module.azure_region_primary.location
      ServiceName = local.service_name
    }
  )

  tech_emails = [for rec in data.azurerm_monitor_action_group.tech.email_receiver : rec.email_address]
}
