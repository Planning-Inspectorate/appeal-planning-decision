resource "azurerm_container_group" "clamav" {
  #checkov:skip=CKV_AZURE_98: The properties covering this rule are deprecated
  name                = "pins-ci-${var.service_name}-clamav-${var.resource_suffix}"
  location            = var.location
  resource_group_name = var.resource_group_name
  ip_address_type     = "Private"
  os_type             = "Linux"
  subnet_ids          = [var.clamav_subnet_id]

  identity {
    type = "SystemAssigned"
  }

  container {
    name   = "clamav"
    image  = "clamav/clamav:1.4_base"
    cpu    = "1"
    memory = "6"

    volume {
      name       = "clamav-db"
      mount_path = "/var/lib/clamav"

      storage_account_key  = azurerm_storage_account.clamav.primary_access_key
      storage_account_name = azurerm_storage_account.clamav.name
      share_name           = azurerm_storage_share.clamav.name
    }

    ports {
      port     = 3310
      protocol = "TCP"
    }

    ports {
      port     = 7357
      protocol = "TCP"
    }
  }

  # run a CLI container to fetch the IP of the container group and update the private DNS zone
  container {
    name   = "azurecli"
    image  = "mcr.microsoft.com/azure-cli:latest"
    cpu    = "0.5"
    memory = "0.5"
    commands = [
      "/bin/sh",
      "-c",
      join(";", [
        "sleep 60", # delay to allow permissions to be set before first run
        "echo \"run: $(date +'%H:%M:%S')\"",
        "az login --identity",
        "tdnf install -y awk iproute",
        "IP_ADDRESS=$(ip route get 1.2.3.4 | awk '{print $7}')",
        "echo IP_ADDRESS: $IP_ADDRESS",
        # "RECORD_SET=$(az network private-dns record-set a show --subscription ${var.tooling_subscription_id} --resource-group ${var.tooling_network_rg} --zone-name ${var.internal_dns_name} --name ${local.clamv_host_name})",
        # "echo RECORD_SET: $RECORD_SET",
        "az network private-dns record-set a update --subscription ${var.tooling_subscription_id} --resource-group ${var.tooling_network_rg} --zone-name ${var.internal_dns_name} --name ${local.clamv_host_name} --set \"aRecords[0].ipv4Address=$IP_ADDRESS\"",
        "echo \"done: $(date +'%H:%M:%S')\"",
        "sleep 3600" # run once an hour
      ])
    ]
  }

  exposed_port {
    port     = 3310
    protocol = "TCP"
  }

  exposed_port {
    port     = 7357
    protocol = "TCP"
  }

  diagnostics {
    log_analytics {
      workspace_id  = var.log_analytics_workspace_uuid
      workspace_key = var.log_analytics_workspace_key
    }
  }

  tags = var.tags
}

locals {
  clamv_host_name = "${var.service_name}-clamav-${var.resource_suffix}"
}

# Allow the container to write to the DNS, for IP changes (on restart)
resource "azurerm_role_assignment" "write_dns_access" {
  scope                = data.azurerm_private_dns_zone.internal.id
  role_definition_name = "Private DNS Zone Contributor"
  principal_id         = azurerm_container_group.clamav.identity[0].principal_id
}

# alerts
# crude alert to check memory usage drops (which seem to indicate failures)
resource "azurerm_monitor_metric_alert" "clamav_memory" {
  name                = "pins-ci-${var.service_name}-clamav-${var.resource_suffix}-memory-alert"
  resource_group_name = var.resource_group_name
  scopes              = [azurerm_container_group.clamav.id]
  description         = "Trigger alert when memory usage drops"
  window_size         = "PT30M"
  frequency           = "PT15M"
  severity            = 1

  criteria {
    metric_namespace = "Microsoft.ContainerInstance/containerGroups"
    metric_name      = "MemoryUsage"
    aggregation      = "Average"
    operator         = "LessThan"
    threshold        = 100 * 1024 * 1024 # 100 MB

    dimension {
      name     = "containerName"
      operator = "Include"
      values   = ["clamav"]
    }
  }

  action {
    action_group_id = var.action_group_ids.tech
  }

  action {
    action_group_id = var.action_group_ids.service_manager
  }

  tags = var.tags
}

resource "azurerm_monitor_metric_alert" "clamav_cpu" {
  name                = "pins-ci-${var.service_name}-clamav-${var.resource_suffix}-cpu-alert"
  resource_group_name = var.resource_group_name
  scopes              = [azurerm_container_group.clamav.id]
  description         = "Trigger alert when CPU usage drops"
  window_size         = "PT30M"
  frequency           = "PT15M"
  severity            = 1

  criteria {
    metric_namespace = "Microsoft.ContainerInstance/containerGroups"
    metric_name      = "CPUUsage"
    aggregation      = "Minimum"
    operator         = "LessThan"
    threshold        = 0.01

    dimension {
      name     = "containerName"
      operator = "Include"
      values   = ["clamav"]
    }
  }

  action {
    action_group_id = var.action_group_ids.tech
  }

  action {
    action_group_id = var.action_group_ids.service_manager
  }

  tags = var.tags
}

# storage
resource "azurerm_storage_account" "clamav" {
  #TODO: Customer Managed Keys
  #checkov:skip=CKV2_AZURE_1: Customer Managed Keys not implemented yet
  #checkov:skip=CKV2_AZURE_18: Customer Managed Keys not implemented yet
  #TODO: Logging
  #checkov:skip=CKV_AZURE_33: Logging not implemented yet
  #checkov:skip=CKV2_AZURE_8: Logging not implemented yet
  #TODO: Access restrictions
  #checkov:skip=CKV_AZURE_35: Network access restrictions
  #checkov:skip=CKV_AZURE_59: TODO: Ensure that Storage accounts disallow public access
  #checkov:skip=CKV_AZURE_190: TODO: Ensure that Storage blobs restrict public access
  #checkov:skip=CKV_AZURE_206: Replication not required
  #checkov:skip=CKV2_AZURE_40: "Ensure storage account is not configured with Shared Key authorization"
  #checkov:skip=CKV2_AZURE_41: "Ensure storage account is configured with SAS expiration policy"
  #checkov:skip=CKV2_AZURE_47: "Ensure storage account is configured without blob anonymous access"
  #checkov:skip=CKV2_AZURE_33: "Ensure storage account is configured with private endpoint"
  #checkov:skip=CKV2_AZURE_38: "Ensure soft-delete is enabled on Azure storage account"

  # max length 24, so trim off the end - will only apply to training environment!
  name                             = substr(replace("pinsstclamav${var.resource_suffix}", "-", ""), 0, 24)
  location                         = var.location
  resource_group_name              = var.resource_group_name
  account_tier                     = "Standard"
  account_replication_type         = "LRS"
  min_tls_version                  = "TLS1_2"
  cross_tenant_replication_enabled = true

  tags = var.tags
}

resource "azurerm_storage_share" "clamav" {
  name                 = "clamav-db"
  storage_account_name = azurerm_storage_account.clamav.name
  quota                = 50
}

# networking
resource "azurerm_private_dns_a_record" "clamav" {
  name                = local.clamv_host_name
  zone_name           = data.azurerm_private_dns_zone.internal.name
  resource_group_name = data.azurerm_private_dns_zone.internal.resource_group_name
  ttl                 = 60
  records             = [azurerm_container_group.clamav.ip_address]

  provider = azurerm.tooling
}
