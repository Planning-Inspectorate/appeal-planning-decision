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
