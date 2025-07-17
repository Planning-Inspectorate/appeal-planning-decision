# Appeal front office integration functions
module "front_office_subscribers" {
  #checkov:skip=CKV_TF_1: Use of commit hash are not required for our Terraform modules
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  source = "github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-function-app?ref=1.49"

  action_group_ids                         = var.action_group_ids
  app_name                                 = "fo-integration"
  app_service_plan_id                      = var.integration_functions_app_service_plan_id
  app_insights_instrument_key              = var.app_insights_instrument_key
  function_apps_storage_account            = var.function_apps_storage_account
  function_apps_storage_account_access_key = var.function_apps_storage_account_access_key
  integration_subnet_id                    = var.common_integration_functions_subnet_id
  key_vault_id                             = var.key_vault_id
  location                                 = var.location
  log_analytics_workspace_id               = var.log_analytics_workspace_id
  monitoring_alerts_enabled                = var.monitoring_alerts_enabled
  outbound_vnet_connectivity               = true
  resource_group_name                      = var.resource_group_name
  resource_suffix                          = var.resource_suffix
  service_name                             = "appeals"
  function_node_version                    = 22

  app_settings = {
    ServiceBusConnection__fullyQualifiedNamespace = "${var.back_office_service_bus_namespace_name}.servicebus.windows.net"

    FO_APPEALS_API          = "${module.app_service["appeals_service_api"].default_site_hostname}/api/v1"
    FO_APPEALS_API_HOSTNAME = "https://${module.app_service["appeals_service_api"].default_site_hostname}"
    FO_APPEALS_API_TIMEOUT  = 10000 # 10 seconds

    CLIENT_ID     = local.secret_refs["appeals-function-client-id"]
    CLIENT_SECRET = local.secret_refs["appeals-function-client-secret"]
    AUTH_BASE_URL = "https://${module.app_service["auth_server"].default_site_hostname}"

  }

  tags = var.tags
}

# Appeals HAS case data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_has_case_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-has-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_has_case_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals s78 case data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_s78_case_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-s78-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_s78_case_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo document data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_document_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-document-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_document_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo event data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_event_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-event-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_event_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo event estimate data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_event_estimate_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-event-estimate-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_event_estimate_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo service user data topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_service_user_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-service-user-fo-sub"
  topic_id                             = var.service_bus_appeals_bo_service_user_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo listed building topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_listed_building_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "listed-building-fo-sub"
  topic_id                             = var.service_bus_listed_building_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}

# Appeals fo representation topic subscription
resource "azurerm_servicebus_subscription" "appeals_fo_appeal_representation_topic_subscription" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  name                                 = "appeal-representation-fo-sub"
  topic_id                             = var.service_bus_appeal_representation_topic_id
  max_delivery_count                   = 1
  default_message_ttl                  = var.service_bus_config.fo_subscription_ttl
  dead_lettering_on_message_expiration = true
}
