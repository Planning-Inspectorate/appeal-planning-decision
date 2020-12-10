terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.31.1"
    }
  }
}

resource "azurerm_cosmosdb_mongo_database" "mongodb" {
  name = var.name
  account_name = var.account_name
  resource_group_name = var.resource_group_name
  throughput = var.auto_scale == false ? var.throughput : null

  dynamic "autoscale_settings" {
    for_each = var.auto_scale ? [var.throughput * 10] : []
    content {
      max_throughput = autoscale_settings.value
    }
  }
}

resource "azurerm_cosmosdb_mongo_collection" "mongodb" {
  count = length(var.collections)

  name = var.collections[count.index].name
  default_ttl_seconds = var.collections[count.index].default_ttl_seconds

  dynamic "index" {
    for_each = var.collections[count.index].indexes
    content {
      keys = index.value.keys
      unique = index.value.unique
    }
  }

  account_name = var.account_name
  database_name = azurerm_cosmosdb_mongo_database.mongodb.name
  resource_group_name = var.resource_group_name
}
