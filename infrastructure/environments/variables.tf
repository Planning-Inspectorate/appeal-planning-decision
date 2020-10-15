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

/*
  Container Registry
 */

variable "container_registry_name" {
  description = "Name of the container registry"
  default = "pinscommonukscontainersprod"
  type = string
}

variable "container_registry_rg_name" {
  description = "Name of the registry's resource group"
  default = "pinscommon-uks-containers-prod"
  type = string
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
