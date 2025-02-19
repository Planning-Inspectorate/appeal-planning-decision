locals {
  org              = "pins"
  service_name     = "appeals"
  primary_location = "uk-south"
  # secondary_location = "uk-west"

  # resource_suffix           = "${local.service_name}-${var.environment}"
  # secondary_resource_suffix = "${local.service_name}-secondary-${var.environment}"

  tags = merge(
    var.tags,
    {
      CreatedBy   = "terraform"
      Environment = var.environment
      ServiceName = local.service_name
      location    = local.primary_location
    }
  )
}
