resource "azurerm_key_vault_secret" "app_secret" {
  #checkov:skip=CKV_AZURE_41: TODO: Secret rotation
  #checkov:skip=CKV_AZURE_114: No need to set content type via Terraform, as secrets to be updated in Portal
  for_each = toset(module.app_services.secrets_manual)

  key_vault_id = var.key_vault_id
  name         = each.value
  value        = "<enter_value>"

  tags = local.tags

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

resource "time_offset" "secret_expire_date" {
  offset_years = 5
}

resource "azurerm_key_vault_secret" "appeals_app_config_endpoint_kv_secret" {
  name            = "appeals-app-config-connection-string"
  value           = azurerm_app_configuration.appeals_service.primary_write_key[0].connection_string
  key_vault_id    = var.key_vault_id
  content_type    = "text/plain"
  expiration_date = time_offset.secret_expire_date.rfc3339

  tags = local.tags
}

resource "azurerm_key_vault_secret" "applications_insights_connection_kv_secret" {
  name            = "appeals-app-insights-connection-string"
  value           = azurerm_application_insights.web_app_insights.connection_string
  key_vault_id    = var.key_vault_id
  content_type    = "text/plain"
  expiration_date = time_offset.secret_expire_date.rfc3339

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_mongo_db_connection_secret" {
  name            = "appeals-mongo-db-connection-string"
  value           = azurerm_cosmosdb_account.appeals_database.primary_mongodb_connection_string
  key_vault_id    = var.key_vault_id
  content_type    = "text/plain"
  expiration_date = time_offset.secret_expire_date.rfc3339

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_documents_primary_blob_connection_string" {
  name            = "appeals-documents-primary-blob-connection-string"
  value           = azurerm_storage_account.appeal_documents.primary_blob_connection_string
  key_vault_id    = var.key_vault_id
  content_type    = "text/plain"
  expiration_date = time_offset.secret_expire_date.rfc3339

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_password_admin" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-service-sql-server-password-admin"
  value        = azurerm_mssql_server.appeals_sql_server.administrator_login_password

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_password_app" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-service-sql-server-password-app"
  value        = random_password.appeals_sql_server_password_app.result

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_username_admin" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-service-sql-server-username-admin"
  value        = azurerm_mssql_server.appeals_sql_server.administrator_login

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_username_app" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-service-sql-server-username-app"
  value        = local.sql_server_username_app

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_connection_string_admin" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-sql-server-connection-string-admin"
  value        = local.sql_connection_string_admin

  tags = local.tags
}

resource "azurerm_key_vault_secret" "appeals_sql_server_connection_string_app" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-sql-server-connection-string-app"
  value        = local.sql_connection_string_app

  tags = local.tags
}

resource "random_uuid" "appeals_forms_web_app_client_id" {
}

resource "azurerm_key_vault_secret" "appeals_forms_web_app_client_id" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-forms-web-app-client-id"
  value        = random_uuid.appeals_forms_web_app_client_id.result

  tags = local.tags
}

resource "random_password" "appeals_forms_web_app_client_secret" {
  length           = 32
  special          = true
  override_special = "-_="
  min_lower        = 2
  min_upper        = 2
  min_numeric      = 2
  min_special      = 2
}

resource "azurerm_key_vault_secret" "appeals_forms_web_app_client_secret" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-forms-web-app-client-secret"
  value        = random_password.appeals_forms_web_app_client_secret.result

  tags = local.tags
}

resource "random_uuid" "appeals_function_client_id" {
}

resource "azurerm_key_vault_secret" "appeals_function_client_id" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-function-client-id"
  value        = random_uuid.appeals_function_client_id.result

  tags = local.tags
}

resource "random_password" "appeals_function_client_secret" {
  length           = 32
  special          = true
  override_special = "-_="
  min_lower        = 2
  min_upper        = 2
  min_numeric      = 2
  min_special      = 2
}

resource "azurerm_key_vault_secret" "appeals_function_client_secret" {
  #checkov:skip=CKV_AZURE_41

  content_type = "text/plain"
  key_vault_id = var.key_vault_id
  name         = "appeals-function-client-secret"
  value        = random_password.appeals_function_client_secret.result

  tags = local.tags
}
