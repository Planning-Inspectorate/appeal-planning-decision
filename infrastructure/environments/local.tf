locals {
  app_name = "pins-env"
  current_ip = chomp(data.http.myip.body)
  horizon_count = var.horizon_enabled && var.network_create_own == false ? 1 : 0
  location = substr(var.location, 0, 3) # short version of the location
  lock_delete = "CanNotDelete"
  lock_none = null # Doesn't add tag
  lock_readonly = "ReadOnly"
  name_format = join("-", [
    var.prefix,
    local.location,
    "%s", # name
    local.workspace_name
  ])
  name_format_global = join("-", [ # Same as name_format but with no location
    var.prefix,
    "%s", # name
    local.workspace_name
  ])
  web_app_subdomain = terraform.workspace == "prod" ? "app" : "${terraform.workspace}-app"
  web_app_url_format = join("-", [
    var.prefix,
    "%s", # name
    local.web_app_subdomain
  ])
  workspace_name = replace(terraform.workspace, "/[\\W\\-]/", "") # alphanumeric workspace name
}
