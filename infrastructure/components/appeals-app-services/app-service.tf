module "app_service" {
  #checkov:skip=CKV_TF_1: Use of commit hash are not required for our Terraform modules
  for_each = local.app_services

  source = "github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-app-service?ref=1.49"

  action_group_ids                = var.action_group_ids
  app_name                        = each.value["app_name"]
  app_service_plan_id             = var.app_service_plan_id
  app_service_private_dns_zone_id = can(each.value["app_service_private_dns_zone_id"]) ? each.value["app_service_private_dns_zone_id"] : null
  app_settings                    = each.value["app_settings"]
  slot_setting_overrides          = can(each.value["slot_setting_overrides"]) ? each.value["slot_setting_overrides"] : {}
  container_registry_name         = var.container_registry_name
  container_registry_rg           = var.container_registry_rg
  endpoint_subnet_id              = can(each.value["endpoint_subnet_id"]) ? each.value["endpoint_subnet_id"] : null
  front_door_restriction          = can(each.value["front_door_restriction"]) ? each.value["front_door_restriction"] : null
  image_name                      = each.value["image_name"]
  inbound_vnet_connectivity       = each.value["inbound_vnet_connectivity"]
  public_network_access           = each.value["public_network_access"]
  integration_subnet_id           = can(each.value["integration_subnet_id"]) ? each.value["integration_subnet_id"] : null
  key_vault_id                    = each.value["key_vault_access"] ? var.key_vault_id : null
  location                        = var.location
  log_analytics_workspace_id      = var.log_analytics_workspace_id
  monitoring_alerts_enabled       = var.monitoring_alerts_enabled
  outbound_vnet_connectivity      = each.value["outbound_vnet_connectivity"]
  resource_group_name             = var.resource_group_name
  resource_suffix                 = var.resource_suffix
  service_name                    = var.service_name

  tags = var.tags

  providers = {
    azurerm         = azurerm
    azurerm.tooling = azurerm.tooling
  }

  #Easy Auth setting
  auth_config = {
    auth_enabled           = each.value["auth_enabled"]
    require_authentication = each.value["auth_enabled"]
    auth_client_id         = var.appeals_easy_auth_config.client_id
    #checkov:skip=CKV_SECRET_6: "Base64 High Entropy String"
    auth_provider_secret = "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET"
    auth_tenant_endpoint = "https://login.microsoftonline.com/${data.azurerm_client_config.current.tenant_id}/v2.0"
    allowed_applications = var.appeals_easy_auth_config.application_id
    allowed_audiences    = "https://${var.appeals_service_public_url}/.auth/login/aad/callback"
  }
}
