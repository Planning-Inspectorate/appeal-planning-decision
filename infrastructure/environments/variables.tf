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

variable "mongodb_consistency_policy" {
  description = "Cosmos consistency policy"
  type = string
  default = "BoundedStaleness"
  validation {
    condition = contains([
      "BoundedStaleness",
      "Eventual",
      "Session",
      "Strong",
      "ConsistentPrefix",
    ], var.mongodb_consistency_policy)
    error_message = "Invalid consistency policy."
  }
}

variable "mongodb_consistency_max_interval_in_seconds" {
  description = "Represents the amount of staleness that is tolerated (in seconds) - min 5 mins for global replication"
  type = number
  default = 300
}

variable "mongodb_databases" {
  description = "List of databases and collections to provision"
  type = list(object({
    name = string
    collections = list(object({
      name = string
      default_ttl_seconds = number
      indexes = list(object({
        keys = set(string)
        unique = bool
      }))
    }))
  }))
}

variable "mongodb_failover_read_locations" {
  description = "Locations where read failover replicas are created for MongoDB"
  type = list(string)
  default = []
}

variable "mongodb_max_staleness_prefix" {
  description = "Represents the number of state requests that are tolerated - min 100,000 for global replication"
  type = number
  default = 100000
}

variable "mongodb_max_throughput" {
  description = "Max throughput of the MongoDB database - set in increments of 100 between 400 and 100,000"
  type = number
  default = 400
}

/*
  Redis defaults
 */

variable "redis_capacity" {
  description = "Capacity of the Redis cluster"
  type = number
  default = 0
}

variable "redis_family" {
  description = "Family - C (Basic/Standard) or P (Premium)"
  type = string
  default = "C"
}

variable "redis_sku" {
  description = "SKU - Basic, Standard or Premium"
  type = string
  default = "Basic"
}
