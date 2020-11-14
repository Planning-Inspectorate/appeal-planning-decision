resource "azurerm_resource_group" "k8s" {
  location = var.location
  name = format(local.name_format, "k8s")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "k8s" {
  max = 9999
  min = 1000
}

resource "azurerm_log_analytics_workspace" "k8s" {
  name = format(local.name_format, "kubernetes-${random_integer.k8s.result}")
  location = azurerm_resource_group.k8s.location
  resource_group_name = azurerm_resource_group.k8s.name
  sku = "PerGB2018"
}

resource "azurerm_log_analytics_solution" "k8s" {
  solution_name = "ContainerInsights"
  location = azurerm_resource_group.k8s.location
  resource_group_name = azurerm_resource_group.k8s.name
  workspace_name = azurerm_log_analytics_workspace.k8s.name
  workspace_resource_id = azurerm_log_analytics_workspace.k8s.id

  plan {
    publisher = "Microsoft"
    product = "OMSGallery/ContainerInsights"
  }
}

data "azurerm_kubernetes_service_versions" "k8s" {
  location = azurerm_resource_group.k8s.location
  include_preview = false
  version_prefix = var.k8s_version_prefix
}

resource "azurerm_kubernetes_cluster" "k8s" {
  name = format(local.name_format, "k8s")
  location = azurerm_resource_group.k8s.location
  resource_group_name = azurerm_resource_group.k8s.name
  dns_prefix = "${var.prefix}-${terraform.workspace}"

  kubernetes_version = data.azurerm_kubernetes_service_versions.k8s.latest_version

  default_node_pool {
    name = "default"
    vm_size = var.k8s_vm_size
    availability_zones = var.k8s_availability_zones

    enable_auto_scaling = true
    min_count = var.k8s_min_nodes
    max_count = var.k8s_max_nodes
    orchestrator_version = data.azurerm_kubernetes_service_versions.k8s.latest_version
    type = "VirtualMachineScaleSets"
  }

  role_based_access_control {
    enabled = var.k8s_rbac_enabled
//    azure_active_directory {
//      tenant_id = data.azurerm_client_config.current.tenant_id
//      managed = true
//      admin_group_object_ids = var.k8s_rbac_admin_groups
//    }
  }

  network_profile {
    network_plugin = "kubenet"
    load_balancer_sku = "Standard"
  }

  addon_profile {
    kube_dashboard {
      enabled = false
    }

    oms_agent {
      enabled = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.k8s.id
    }
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_key_vault_access_policy" "k8s" {
  key_vault_id = var.key_vault_id
  object_id = azurerm_kubernetes_cluster.k8s.identity.0.principal_id
  tenant_id = azurerm_kubernetes_cluster.k8s.identity.0.tenant_id

  secret_permissions = [
    "get"
  ]
}

resource "azurerm_public_ip" "k8s" {
  name = format(local.name_format, "k8s")
  location = azurerm_resource_group.k8s.location
  resource_group_name = azurerm_resource_group.k8s.name
  allocation_method = "Static"
  sku = "Standard"
  domain_name_label = "${var.prefix}-${terraform.workspace}"
}

resource "azurerm_role_assignment" "k8s" {
  for_each = toset([
    "Reader",
    "Network Contributor"
  ])
  principal_id = azurerm_kubernetes_cluster.k8s.identity.0.principal_id
  scope = azurerm_resource_group.k8s.id
  role_definition_name = each.value
}

// @todo work out a way for this to be done in helm/k8s
resource "random_string" "k8s-fwa-session-key" {
  length = 32
  special = false
  upper = true
  lower = true
  number = true
}
