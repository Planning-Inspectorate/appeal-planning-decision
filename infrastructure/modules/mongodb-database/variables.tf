variable "account_name" {}
variable "auto_scale" {
  type = bool
  default = true
}
variable "collections" {
  type = list(object({
    name = string
    default_ttl_seconds = number
    indexes = list(object({
      keys = set(string)
      unique = bool
    }))
  }))
  default = []
}
variable "name" {}
variable "resource_group_name" {}
variable "throughput" {}
