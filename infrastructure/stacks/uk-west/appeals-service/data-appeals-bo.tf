# config and data blocks for the Appeals Back Office resources
# defined and managed in https://github.com/Planning-Inspectorate/appeals-back-office

locals {
  appeals_bo_config = {
    resource_group_name   = "pins-rg-appeals-bo-${var.environment}"
    service_bus_namespace = "pins-sb-appeals-bo-${var.environment}"
    documents_container   = "appeals-bo-documents"
  }

  # build up the Service Bus ID since the data block does not export it
  # see https://github.com/hashicorp/terraform-provider-azurerm/issues/22468
  appeals_bo_service_bus_id = join("/", [
    data.azurerm_resource_group.appeals_bo.id,
    "providers",
    "Microsoft.ServiceBus",
    "namespaces",
    local.appeals_bo_config.service_bus_namespace
  ])

  appeals_bo_topics = {
    appeal_has                             = data.azurerm_servicebus_topic.appeal_has.id
    appeal_s78                             = data.azurerm_servicebus_topic.appeal_s78.id
    appeal_document                        = data.azurerm_servicebus_topic.appeal_document.id
    appeal_event                           = data.azurerm_servicebus_topic.appeal_event.id
    appeal_event_estimate                  = data.azurerm_servicebus_topic.appeal_event_estimate.id
    appeal_service_user                    = data.azurerm_servicebus_topic.appeal_service_user.id
    appeal_fo_appellant_submission         = data.azurerm_servicebus_topic.appeal_fo_appellant_submission.id
    appeal_fo_lpa_questionnaire_submission = data.azurerm_servicebus_topic.appeal_fo_lpa_questionnaire_submission.id
    listed_building                        = data.azurerm_servicebus_topic.listed_building.id
    appeal_fo_representation_submission    = data.azurerm_servicebus_topic.appeal_fo_representation_submission.id
    appeal_representation                  = data.azurerm_servicebus_topic.appeal_representation.id
  }
}

data "azurerm_resource_group" "appeals_bo" {
  name = local.appeals_bo_config.resource_group_name
}

# storage
data "azurerm_storage_account" "appeals_bo" {
  # max length 24, so trim off the end - will only apply to training environment!
  name                = substr("pinsstdocsappealsbo${var.environment}", 0, 24)
  resource_group_name = local.appeals_bo_config.resource_group_name
}

data "azurerm_storage_container" "appeal_bo_documents" {
  name                 = local.appeals_bo_config.documents_container
  storage_account_name = data.azurerm_storage_account.appeals_bo.name
}

# service bus
data "azurerm_servicebus_topic" "appeal_has" {
  name         = "appeal-has"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_s78" {
  name         = "appeal-s78"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_document" {
  name         = "appeal-document"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_event" {
  name         = "appeal-event"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_event_estimate" {
  name         = "appeal-event-estimate"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_service_user" {
  name         = "appeal-service-user"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_fo_appellant_submission" {
  name         = "appeal-fo-appellant-submission"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_fo_lpa_questionnaire_submission" {
  name         = "appeal-fo-lpa-questionnaire-submission"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "listed_building" {
  name         = "listed-building"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_fo_representation_submission" {
  name         = "appeal-fo-representation-submission"
  namespace_id = local.appeals_bo_service_bus_id
}

data "azurerm_servicebus_topic" "appeal_representation" {
  name         = "appeal-representation"
  namespace_id = local.appeals_bo_service_bus_id
}
