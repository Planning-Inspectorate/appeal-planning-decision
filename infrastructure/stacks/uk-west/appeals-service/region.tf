module "azure_region_primary" {
  #checkov:skip=CKV_TF_1: Use of commit hash is not required for this module, referencing the official Hashicorp module.
  source  = "claranet/regions/azurerm"
  version = "8.0.2"

  azure_region = var.primary_location
}

module "azure_region_secondary" {
  #checkov:skip=CKV_TF_1: Use of commit hash is not required for this module, referencing the official Hashicorp module.
  source  = "claranet/regions/azurerm"
  version = "8.0.2"

  azure_region = var.secondary_location
}
