/*
  Common
 */

variable "location" {
  description = "Default location for resources"
  default = "uksouth"
  type = string
}

variable "prefix" {
  description = "Resource prefix"
  default = "pins"
  type = string
}

variable "key_vault_id" {
  description = "Key Vault ID"
  type = string
}

/*
  Container Registry
 */

variable "container_registry_name" {
  description = "Name of the container registry"
  type = string
}

variable "container_registry_rg_name" {
  description = "Name of the registry's resource group"
  type = string
}

/*
  Kubernetes
 */

variable "k8s_availability_zones" {
  description = "Zones to run the node pools in"
  type = list(string)
  default = null
}

variable "k8s_rbac_admin_groups" {
  description = "List of AAD groups that have admin rights on the cluster"
  type = set(string)
  default = []
}

variable "k8s_rbac_enabled" {
  description = "Enable RBAC on cluster"
  type = bool
  default = true
}

variable "k8s_min_nodes" {
  description = "Minimum number of nodes per pool"
  type = number
  default = 1
}

variable "k8s_max_nodes" {
  description = "Maximum number of nodes per pool"
  type = number
  default = 3
}

variable "k8s_version_prefix" {
  description = "Version prefix to use - ensure you end with dot (.)"
  default = "1.18."
}

variable "k8s_vm_size" {
  description = "VM size"
  default = "Standard_DS2_v2"
}

/*
  MongoDB defaults

  These are used as base settings
 */

variable "mongodb_failover_read_locations" {
  description = "Locations where read failover replicas are created for MongoDB"
  type = list(string)
  default = []
}

variable "mongodb_max_throughput" {
  description = "Max throughput of the MongoDB database - set in increments of 1,000 between 4,000 and 1,000,000"
  type = number
  default = 4000
}
