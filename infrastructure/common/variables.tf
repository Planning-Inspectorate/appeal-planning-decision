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
  default = "pinscommon"
  type = string
}

/*
  Container
 */

variable "container_sku_type" {
  description = "SKU for registry - 'Basic' (10GB), 'Standard' (100GB) or 'Premium' (500GB)"
  default = "Standard"
  type = string
}

/*
  GitHub
 */

variable "github_token" {
  description = "Token to access the GitHub API"
  type = string
  sensitive = true
}

variable "github_org_name" {
  description = "Name of the GitHub organisation"
  default = "foundry4"
  type = string
}

variable "github_repo_name" {
  description = "Name of the GitHub repository"
  default = "appeal-planning-decision"
  type = string
}
