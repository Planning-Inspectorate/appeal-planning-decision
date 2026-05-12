data "azurerm_cdn_frontdoor_profile" "shared" {
  name                = var.front_door_config.name
  resource_group_name = var.front_door_config.rg
  provider            = azurerm.front_door
}

data "azurerm_cdn_frontdoor_endpoint" "shared" {
  name                = var.front_door_config.ep_name
  resource_group_name = var.front_door_config.rg
  profile_name        = var.front_door_config.name
  provider            = azurerm.front_door
}

data "azurerm_linux_web_app" "appeals" {
  name                = var.web_app_config.name
  resource_group_name = var.web_app_config.rg
}
