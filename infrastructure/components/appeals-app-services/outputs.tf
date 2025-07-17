output "app_service_urls" {
  description = "A map of App Service URLs"
  value       = { for k, v in module.app_service : "${k}_${module.azure_region.location_short}" => v.default_site_hostname }
}

output "app_service_ids" {
  description = "A map of App Service IDs"
  value       = { for k, v in module.app_service : "${k}_${module.azure_region.location_short}" => v.id }
}

output "app_service_principal_ids" {
  description = "A map of App Service principal IDs"
  value       = { for k, v in module.app_service : "${k}_${module.azure_region.location_short}" => v.principal_id }
}

output "secrets_manual" {
  description = "List of Key Vault secrets required for this component"
  value       = local.secrets_manual
}

output "web_frontend_url" {
  description = "The URL of the web frontend App Service"
  value       = module.app_service["appeals_frontend"].default_site_hostname
}
