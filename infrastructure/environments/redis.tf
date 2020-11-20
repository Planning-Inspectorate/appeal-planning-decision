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
  max = 9999
  min = 1000
}

resource "azurerm_redis_cache" "redis" {
  name = format(local.name_format, "redis-${random_integer.redis.result}")
  location = azurerm_resource_group.redis.location
  resource_group_name = azurerm_resource_group.redis.name
  capacity = var.redis_capacity
  family = var.redis_family
  sku_name = var.redis_sku
  minimum_tls_version = "1.2"
}

resource "azurerm_key_vault_secret" "fwa-session-redis" {
  key_vault_id = azurerm_key_vault.key_vault.id
  name = "redis-fwa-session-store"
  value = jsonencode({
    host = tostring(azurerm_redis_cache.redis.hostname)
    pass = tostring(azurerm_redis_cache.redis.primary_access_key)
    port = tostring(azurerm_redis_cache.redis.ssl_port)
    use_tls = "true"
  })
}
