resource "azurerm_resource_group" "redis" {
  location = var.location
  name = format(local.name_format, "redis")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "redis" {
  min = 1000
  max = 9999
}

resource "azurerm_redis_cache" "redis" {
  name = format(local.name_format, "redis-${random_integer.redis.result}")
  location = azurerm_resource_group.redis.location
  resource_group_name = azurerm_resource_group.redis.name
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}
