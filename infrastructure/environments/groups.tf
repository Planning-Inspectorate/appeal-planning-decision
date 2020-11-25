resource "azuread_group" "admin" {
  name = format(local.name_format_global, "admin")
  description = "Admin-level members for ${var.prefix}"
  owners = [
    data.azurerm_client_config.current.object_id
  ]
  prevent_duplicate_names = true
}

resource "azuread_group" "user" {
  name = format(local.name_format_global, "user")
  description = "User-level members for ${var.prefix}"
  owners = [
    data.azurerm_client_config.current.object_id
  ]
  prevent_duplicate_names = true
}
