/*
  Misc
 */

output "app-name" {
  description = "The application name - used for identifying resource groups"
  value = local.app_name
}

/*
  Containers
 */

output "containers_password" {
  description = "Password for the container registry"
  sensitive = true
  value = data.azurerm_container_registry.pins.admin_password
}

output "containers_server" {
  description = "Server URL for the container registry"
  value = data.azurerm_container_registry.pins.login_server
}

output "containers_username" {
  description = "Username for the container registry"
  value = data.azurerm_container_registry.pins.admin_username
}

/*
  Kubernetes
 */

output "kubeconfig" {
  description = "The Kubernetes config file"
  sensitive = true
  value = try(azurerm_kubernetes_cluster.k8s.kube_config_raw, null)
}

output "kube_load_balancer_domain_label" {
  description = "The DNS label of the load balancer for the Kubernetes cluster"
  value = try(azurerm_public_ip.k8s.domain_name_label, null)
}

output "kube_load_balancer_ip" {
  description = "The IP of the load balancer for the Kubernetes cluster"
  value = try(azurerm_public_ip.k8s.ip_address, null)
}

output "kube_load_balancer_rg" {
  description = "The rosource group the load balancer IP exists in"
  value = try(azurerm_resource_group.k8s.name, null)
}
