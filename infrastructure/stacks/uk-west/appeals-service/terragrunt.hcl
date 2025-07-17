include {
  path = "../../../../config/terragrunt.hcl"
}

dependency "common_ukw" {
  config_path                             = "../common"
  mock_outputs_allowed_terraform_commands = ["validate", "plan"]
  mock_outputs_merge_with_state           = true

  mock_outputs = {
    action_group_ids = {
      "appeals-fo-tech"                 = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "appeals-bo-tech"                 = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "applications-fo-tech"            = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "applications-bo-tech"            = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "appeals-fo-service-manager"      = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "appeals-bo-service-manager"      = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "applications-fo-service-manager" = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "applications-bo-service-manager" = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "iap"                             = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "its"                             = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock",
      "info-sec"                        = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/microsoft.insights/actionGroups/mock"
    }
    action_group_names = {
      "appeals-bo-service-manager"      = "pins-ag-odt-appeals-bo-service-manager-dev"
      "appeals-bo-tech"                 = "pins-ag-odt-appeals-bo-tech-dev"
      "appeals-fo-service-manager"      = "pins-ag-odt-appeals-fo-service-manager-dev"
      "appeals-fo-tech"                 = "pins-ag-odt-appeals-fo-tech-dev"
      "applications-bo-service-manager" = "pins-ag-odt-applications-bo-service-manager-dev"
      "applications-bo-tech"            = "pins-ag-odt-applications-bo-tech-dev"
      "applications-fo-service-manager" = "pins-ag-odt-applications-fo-service-manager-dev"
      "applications-fo-tech"            = "pins-ag-odt-applications-fo-tech-dev"
      "iap"                             = "pins-ag-odt-iap-dev"
      "info-sec"                        = "pins-ag-odt-info-sec-dev"
      "its"                             = "pins-ag-odt-its-dev"
    }
    app_service_plan_id                       = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pins-rg-common-dev-ukw-001/providers/Microsoft.Web/serverfarms/mock_id"
    common_resource_group_name                = "mock_resource_group_name"
    integration_functions_app_service_plan_id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pins-rg-common-dev-ukw-001/providers/Microsoft.Web/serverfarms/mock_id"
    common_vnet_cidr_blocks = {
      app_service_integration   = "10.1.1.0/24"
      appeals_service_endpoints = "10.1.2.0/24"
      cosmosdb_endpoint         = "10.1.3.1/25"
    }
    common_vnet_name                       = "mock_vnet_name"
    clamav_subnet_id                       = "/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.Network/virtualNetworks/virtualNetworksValue/subnets/subnetValue"
    cosmosdb_subnet_id                     = "/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.Network/virtualNetworks/virtualNetworksValue/subnets/subnetValue"
    integration_subnet_id                  = "/s/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.Network/virtualNetworks/virtualNetworksValue/subnets/subnetValue"
    key_vault_id                           = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock_resource_group/providers/Microsoft.KeyVault/vaults/mockvault"
    key_vault_uri                          = "https://mockvault.vault.azure.net/"
    common_integration_functions_subnet_id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mock-resource-group/providers/Microsoft.Network/virtualNetworks/virtualNetworksValue/subnets/subnetValue"
  }
}

dependency "back_office_ukw" {
  config_path                             = "../back-office"
  mock_outputs_allowed_terraform_commands = ["validate", "plan"]
  mock_outputs_merge_with_state           = true

  mock_outputs = {

  }
}

inputs = {
  action_group_ids = {
    tech            = dependency.common_ukw.outputs.action_group_ids["appeals-fo-tech"]
    service_manager = dependency.common_ukw.outputs.action_group_ids["appeals-fo-service-manager"]
    iap             = dependency.common_ukw.outputs.action_group_ids["iap"]
    its             = dependency.common_ukw.outputs.action_group_ids["its"]
    info_sec        = dependency.common_ukw.outputs.action_group_ids["info-sec"]
  }
  action_group_names = {
    tech            = dependency.common_ukw.outputs.action_group_names["appeals-fo-tech"]
    service_manager = dependency.common_ukw.outputs.action_group_names["appeals-fo-service-manager"]
    iap             = dependency.common_ukw.outputs.action_group_names["iap"]
    its             = dependency.common_ukw.outputs.action_group_names["its"]
    info_sec        = dependency.common_ukw.outputs.action_group_names["info-sec"]
  }
  app_service_plan_id                       = dependency.common_ukw.outputs.app_service_plan_id
  clamav_subnet_id                          = dependency.common_ukw.outputs.back_office_clamav_subnet_id
  common_integration_functions_subnet_id    = dependency.common_ukw.outputs.common_integration_functions_subnet_id
  common_resource_group_name                = dependency.common_ukw.outputs.common_resource_group_name
  common_vnet_cidr_blocks                   = dependency.common_ukw.outputs.common_vnet_cidr_blocks
  common_vnet_name                          = dependency.common_ukw.outputs.common_vnet_name
  cosmosdb_subnet_id                        = try(dependency.common_ukw.outputs.cosmosdb_subnet_id, null)
  integration_functions_app_service_plan_id = dependency.common_ukw.outputs.integration_functions_app_service_plan_id
  integration_subnet_id                     = dependency.common_ukw.outputs.integration_subnet_id
  key_vault_id                              = dependency.common_ukw.outputs.key_vault_id
  key_vault_uri                             = dependency.common_ukw.outputs.key_vault_uri
}
