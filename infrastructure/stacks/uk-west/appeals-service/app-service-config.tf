resource "azurerm_app_configuration" "appeals_service" {
  #checkov:skip=CKV_AZURE_184: "Ensure 'local_auth_enabled' is set to 'False'"
  #checkov:skip=CKV_AZURE_185: "Ensure 'Public Access' is not Enabled for App configuration"
  #checkov:skip=CKV_AZURE_186: "Ensure App configuration encryption block is set."
  #checkov:skip=CKV_AZURE_187: "Ensure App configuration purge protection is enabled"

  name                  = "pins-asc-appeals-${local.resource_suffix}"
  resource_group_name   = azurerm_resource_group.appeals_service_stack.name
  location              = module.azure_region_primary.location
  sku                   = "standard"
  public_network_access = "Enabled"

  tags = local.tags
}

resource "azurerm_app_configuration_feature" "appeals_service" {
  for_each = { for feature in var.appeals_feature_flags : feature.name => feature }

  configuration_store_id = azurerm_app_configuration.appeals_service.id
  name                   = each.value["name"]
  description            = try(each.value["description"], null)
  enabled                = try(each.value["enabled"], true)
  label                  = try(each.value["label"], null)

  targeting_filter {
    default_rollout_percentage = try(each.value["targeting"]["percentage"], 100)
    users                      = try(each.value["targeting"]["users"], [])
  }

  tags = local.tags

  depends_on = [
    azurerm_role_assignment.appeals_app_configuration_terraform
  ]
}

resource "azurerm_private_endpoint" "appeals_app_config" {
  name                = "pins-pe-${local.service_name}-asc-${local.resource_suffix}"
  location            = azurerm_resource_group.appeals_service_stack.location
  resource_group_name = azurerm_resource_group.appeals_service_stack.name
  subnet_id           = azurerm_subnet.appeals_service_ingress.id

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [data.azurerm_private_dns_zone.app_config.id]
  }

  private_service_connection {
    name                           = "pins-pe-${local.service_name}-asc-${local.resource_suffix}"
    private_connection_resource_id = azurerm_app_configuration.appeals_service.id
    subresource_names              = ["configurationStores"]
    is_manual_connection           = false
  }

  tags = local.tags
}

resource "azurerm_role_assignment" "appeals_app_configuration_terraform" {
  scope                = azurerm_app_configuration.appeals_service.id
  role_definition_name = "App Configuration Data Owner"
  principal_id         = data.azurerm_client_config.current.object_id
}
