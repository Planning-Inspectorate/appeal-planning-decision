# Common Infrastructure

Infrastructure which is common to the subscription, regardless of which environment

## Requirements

| Name | Version |
|------|---------|
| terraform | 0.14.0 |

## Providers

| Name | Version |
|------|---------|
| azurerm | n/a |
| github | n/a |
| random | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| container\_sku\_type | SKU for registry - 'Basic' (10GB), 'Standard' (100GB) or 'Premium' (500GB) | `string` | `"Standard"` | no |
| github\_org\_name | Name of the GitHub organisation | `string` | `"foundry4"` | no |
| github\_repo\_name | Name of the GitHub repository | `string` | `"appeal-planning-decision"` | no |
| github\_token | Token to access the GitHub API | `string` | n/a | yes |
| location | Default location for resources | `string` | `"uksouth"` | no |
| prefix | Resource prefix | `string` | `"pinscommon"` | no |

## Outputs

| Name | Description |
|------|-------------|
| app-name | The application name - used for identifying resource groups |
| containers\_location | Location of the container registry |
| containers\_name | Name of the container registry |
| containers\_password | Password for the container registry |
| containers\_rg\_name | Resource group name for the container registry |
| containers\_server | Server URL for the container registry |
| containers\_username | Username for the container registry |

