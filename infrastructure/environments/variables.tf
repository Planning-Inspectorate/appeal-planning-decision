/*
  Common
 */

variable "location" {
  description = "Default location for resources"
  default = "uksouth"
  type = string
}

variable "pins_key_vault_subscription_id" {
  description = "Subscription ID for the Key Vault"
  type = string
  default = null
}

variable "pins_key_vault" {
  description = "ID of the PINS Key Vault - used to securely share secrets with this infrastructure"
  type = string
  default = null
}

variable "prefix" {
  description = "Resource prefix"
  default = "pins"
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
  Horizon
 */

variable "horizon_enabled" {
  description = "Enable the connection to the Horizon instance over a virtual network gateway"
  type = bool
  default = false
}

variable "horizon_gateway_sku" {
  description = "SKU of the Horizon gateway"
  type = string
  default = "VpnGw1"
}

variable "horizon_gateway_ip_secret" {
  description = "Public IP address of the Horizon VPN gateway"
  type = string
  default = "horizon-gateway-ip"
}

variable "horizon_gateway_subnets_secret" {
  description = "CSV of subnets to use for the Horizon VPN gateway"
  type = string
  default = null
}

variable "horizon_shared_key_secret" {
  description = "Name of the Horizon shared key in the PINS key vault"
  type = string
  default = null
}

/*
  Kubernetes
 */

variable "k8s_availability_zones" {
  description = "Zones to run the node pools in"
  type = list(string)
  default = null
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
  Message Queue
 */

variable "message_queue_sku" {
  description = "SKU for the message queue"
  default = "Basic"
}

variable "message_queue_capacity" {
  description = "Message queue capacity - SKU must be premium if non-0"
  type = number
  default = 0
}

variable "message_queue_zone_redundancy_enabled" {
  description = "Enable message queue redundancy - SKY must be premium if true"
  type = bool
  default = false
}

/*
  MongoDB defaults

  These are used as base settings
 */

variable "mongodb_auto_failover" {
  description = "Enable auto failover between regions"
  type = bool
  default = false
}

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
  default = []
}

variable "mongodb_failover_locations" {
  description = "Locations where failover replicas are created for MongoDB"
  type = list(object({
    location = string
    redundancy = bool
  }))
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

variable "mongodb_multi_write_locations" {
  description = "Enable multiple write locations"
  type = bool
  default = false
}

variable "mongodb_primary_zone_redundancy" {
  description = "Enable redundancy in the primary zone"
  type = bool
  default = false
}

/*
  Storage
 */

variable "documents_soft_delete_retention" {
  description = "Number of days to allow for data recovery"
  type = number
  default = 30
}
