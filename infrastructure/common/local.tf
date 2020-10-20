locals {
  app_name = "pins-common"
  location = substr(var.location, 0, 3)
  lock_delete = "CanNotDelete"
  lock_none = null # Doesn't add tag
  lock_readonly = "ReadOnly"
  name_format = join("-", [
    var.prefix,
    local.location,
    "%s", # name
    replace(terraform.workspace, "/[\\W\\-]/", "") # alphanumeric workspace name
  ])
}
