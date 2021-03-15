resource "azurerm_resource_group" "mongodb" {
  location = var.location
  name = format(local.name_format, "mongodb")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

module "mongodb_rg_roles" {
  source = "../modules/resource-group-aad-roles"

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.mongodb.id
  user_group_id = azuread_group.user.id
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
  enable_automatic_failover = var.mongodb_auto_failover
  enable_multiple_write_locations = var.mongodb_multi_write_locations

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
    zone_redundant = var.mongodb_primary_zone_redundancy
  }

  dynamic "geo_location" {
    for_each = var.mongodb_failover_locations
    content {
      location = geo_location.value.location
      failover_priority = geo_location.key + 1
      zone_redundant = geo_location.value.redundancy
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
