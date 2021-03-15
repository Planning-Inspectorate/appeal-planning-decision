resource "azurerm_resource_group" "k8s" {
  location = var.location
  name = format(local.name_format, "k8s")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

module "k8s_rg_roles" {
  source = "../modules/resource-group-aad-roles"

  admin_group_id = azuread_group.admin.id
  resource_group_id = azurerm_resource_group.k8s.id
  user_group_id = azuread_group.user.id
}

resource "random_integer" "k8s" {
  max = 9999
  min = 1000
}

data "azurerm_kubernetes_service_versions" "k8s" {
  location = azurerm_resource_group.k8s.location
  include_preview = false
  version_prefix = var.k8s_version_prefix
}

resource "azurerm_kubernetes_cluster" "k8s" {
  name = format(local.name_format, "k8s-${random_integer.k8s.result}")
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

    vnet_subnet_id = azurerm_subnet.network.id
  }

  role_based_access_control {
    enabled = var.k8s_rbac_enabled
    azure_active_directory {
      tenant_id = data.azurerm_client_config.current.tenant_id
      managed = true
      admin_group_object_ids = [
        azuread_group.admin.id
      ]
    }
  }

  network_profile {
    network_plugin = "kubenet"
    load_balancer_sku = "Standard"
  }

  addon_profile {
    http_application_routing {
      enabled = false
    }

    kube_dashboard {
      enabled = false
    }

    oms_agent {
      enabled = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.monitoring.id
    }
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_key_vault_access_policy" "k8s" {
  key_vault_id = azurerm_key_vault.key_vault.id
  object_id = azurerm_kubernetes_cluster.k8s.kubelet_identity.0.object_id
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

resource "azurerm_role_assignment" "admin" {
  principal_id = azuread_group.admin.id
  scope = azurerm_resource_group.k8s.id
  role_definition_name = "Azure Kubernetes Service Cluster Admin Role"
}

resource "azurerm_role_assignment" "user" {
  principal_id = azuread_group.user.id
  scope = azurerm_resource_group.k8s.id
  role_definition_name = "Azure Kubernetes Service Cluster User Role"
}
