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

resource "azurerm_private_dns_zone" "redis" {
  name = azurerm_redis_cache.redis.hostname
  resource_group_name = azurerm_resource_group.network.name
}

resource "azurerm_private_endpoint" "redis" {
  name = format(local.name_format, "redis")
  location = azurerm_resource_group.redis.location
  resource_group_name = azurerm_resource_group.network.name
  subnet_id = azurerm_subnet.private_endpoints.id

  private_service_connection {
    is_manual_connection = false
    subresource_names = ["redisCache"]
    name = azurerm_redis_cache.redis.name
    private_connection_resource_id = azurerm_redis_cache.redis.id
  }
}
