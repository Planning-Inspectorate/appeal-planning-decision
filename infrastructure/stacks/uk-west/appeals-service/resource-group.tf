resource "azurerm_resource_group" "appeals_service_stack" {
  name     = "pins-rg-${local.service_name}-${local.resource_suffix}"
  location = module.azure_region_primary.location

  tags = local.tags
}
