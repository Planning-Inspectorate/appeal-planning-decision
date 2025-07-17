resource "azurerm_subnet" "appeals_service_ingress" {
  name                              = "pins-snet-appeals-service-ingress-${local.resource_suffix}"
  resource_group_name               = var.common_resource_group_name
  virtual_network_name              = var.common_vnet_name
  address_prefixes                  = [var.common_vnet_cidr_blocks["appeals_service_endpoints"]]
  private_endpoint_network_policies = "Enabled"
}
