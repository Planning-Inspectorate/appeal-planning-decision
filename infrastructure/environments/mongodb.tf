resource "azurerm_resource_group" "mongodb" {
  location = var.location
  name = format(local.name_format, "mongodb")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "mongodb" {
  min = 1000
  max = 9999
}

resource "azurerm_cosmosdb_account" "mongodb" {
  name = format(local.name_format, "mongodb-${random_integer.mongodb.result}")
  location = azurerm_resource_group.mongodb.location
  resource_group_name = azurerm_resource_group.mongodb.name
  offer_type = "Standard"
  kind = "MongoDB"
  enable_automatic_failover = length(var.mongodb_failover_read_locations) > 0

  is_virtual_network_filter_enabled = true
  virtual_network_rule {
    id = azurerm_subnet.network.id
  }

  dynamic "capabilities" {
    for_each = [
      "EnableMongo",
      "mongoEnableDocLevelTTL"
    ]
    content {
      name = capabilities.value
    }
  }

  consistency_policy {
    consistency_level = var.mongodb_consistency_policy
    max_interval_in_seconds = var.mongodb_consistency_max_interval_in_seconds
    max_staleness_prefix = var.mongodb_max_staleness_prefix
  }

  geo_location {
    failover_priority = 0
    location = azurerm_resource_group.mongodb.location
  }

  dynamic "geo_location" {
    for_each = var.mongodb_failover_read_locations
    content {
      location = geo_location.value
      failover_priority = geo_location.key + 1
    }
  }
}

module "mongodb-databases" {
  count = length(var.mongodb_databases)
  source = "../modules/mongodb-database"

  account_name = azurerm_cosmosdb_account.mongodb.name
  auto_scale = true
  resource_group_name = azurerm_resource_group.mongodb.name
  throughput = var.mongodb_max_throughput

  name = var.mongodb_databases[count.index].name
  collections = var.mongodb_databases[count.index].collections
}

//resource "azurerm_private_endpoint" "mongodb" {
//  name = format(local.name_format, "mongodb")
//  location = azurerm_resource_group.mongodb.location
//  resource_group_name = azurerm_resource_group.network.name
//  subnet_id = azurerm_subnet.private_endpoints.id
//
//  private_service_connection {
//    is_manual_connection = false
//    subresource_names = ["MongoDB"]
//    name = azurerm_cosmosdb_account.mongodb.name
//    private_connection_resource_id = azurerm_cosmosdb_account.mongodb.id
//  }
//}
//
//resource "azurerm_private_dns_zone" "mongodb" {
//  name = "${azurerm_cosmosdb_account.mongodb.name}.mongo.cosmos.azure.com"
//  resource_group_name = azurerm_resource_group.network.name
//}
//
//resource "azurerm_private_dns_zone_virtual_network_link" "mongodb" {
//  name = format(local.name_format, "mongodb")
//  private_dns_zone_name = azurerm_private_dns_zone.mongodb.name
//  resource_group_name = azurerm_resource_group.network.name
//  virtual_network_id = azurerm_virtual_network.network.id
//  registration_enabled = false
//}
//
//resource "azurerm_private_dns_a_record" "mongodb" {
//  name = format(local.name_format, "mongodb")
//  records = flatten(azurerm_private_endpoint.mongodb.custom_dns_configs[*].ip_addresses)
//  resource_group_name = azurerm_resource_group.network.name
//  ttl = 0
//  zone_name = azurerm_private_dns_zone.mongodb.name
//}
