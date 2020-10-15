locals {
  app_name = "pins-env"
  location = substr(var.location, 0, 3) # short version of the location
  lock_delete = "CanNotDelete"
  lock_none = null # Doesn't add tag
  lock_readonly = "ReadOnly"
  name_format = join("-", [
    var.prefix,
    local.location,
    "%s", # name
    replace(terraform.workspace, "/[\\W\\-]/", "") # alphanumeric workspace name
  ])
  web_app_subdomain = terraform.workspace == "prod" ? "app" : "${terraform.workspace}-app"
  web_app_url_format = join("-", [
    var.prefix,
    "%s", # name
    local.web_app_subdomain
  ])
}
