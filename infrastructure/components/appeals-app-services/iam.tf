resource "azurerm_role_assignment" "documents_access" {
  scope                = var.resource_group_id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = module.app_service["appeal_documents_service_api"].principal_id
}

resource "azurerm_role_assignment" "app_configuration_access" {
  scope                = var.resource_group_id
  role_definition_name = "App Configuration Data Reader"
  principal_id         = module.app_service["appeal_documents_service_api"].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_has_case_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_has_case_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_s78_case_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_s78_case_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_document_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_document_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_event_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_event_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_event_estimate_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_event_estimate_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_service_user_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_service_user_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "listed_building_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_listed_building_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeal_representation_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = azurerm_servicebus_subscription.appeals_fo_appeal_representation_topic_subscription[0].id
  role_definition_name = "Azure Service Bus Data Receiver"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_send_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = var.service_bus_listed_building_topic_id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = module.front_office_subscribers[0].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_api_send_lpa_submission_service_bus_role" {
  scope                = var.service_bus_appeals_fo_lpa_response_submission_topic_id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = module.app_service["appeals_service_api"].principal_id
}

resource "azurerm_role_assignment" "appeals_fo_api_send_appellant_submission_service_bus_role" {
  scope                = var.service_bus_appeals_fo_appellant_submission_topic_id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = module.app_service["appeals_service_api"].principal_id
}

resource "azurerm_role_assignment" "appeal_fo_representation_submission_send_service_bus_role" {
  count = var.appeals_feature_back_office_subscriber_enabled ? 1 : 0

  scope                = var.service_bus_appeal_fo_representation_submission_topic_id
  role_definition_name = "Azure Service Bus Data Sender"
  principal_id         = module.app_service["appeals_service_api"].principal_id
}

resource "azurerm_role_assignment" "appeals_docs_api_bo_storage_account_role" {
  # access to appeal documents on back office for docs api
  # allows generation of user delgation key for the account
  # https://learn.microsoft.com/en-us/rest/api/storageservices/get-user-delegation-key#permissions
  scope                = var.bo_storage_account_id
  role_definition_name = "Storage Blob Delegator"
  principal_id         = module.app_service["appeal_documents_service_api"].principal_id
}

resource "azurerm_role_assignment" "appeals_docs_api_bo_storage_container_role" {
  # access to appeal documents on back office for docs api
  # allows read access to the appeals container only
  #https://learn.microsoft.com/en-us/rest/api/storageservices/get-user-delegation-key#permissions
  scope                = var.bo_appeals_document_container_id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = module.app_service["appeal_documents_service_api"].principal_id
}
