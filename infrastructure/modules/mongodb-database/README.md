# MongoDB

Create a new MongoDB instance with the specified collections

## Requirements

| Name | Version |
|------|---------|
| azurerm | ~> 2.31.1 |

## Providers

| Name | Version |
|------|---------|
| azurerm | ~> 2.31.1 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| account\_name | n/a | `any` | n/a | yes |
| auto\_scale | n/a | `bool` | `true` | no |
| collections | n/a | <pre>list(object({<br>    name = string<br>    default_ttl_seconds = number<br>    indexes = list(object({<br>      keys = set(string)<br>      unique = bool<br>    }))<br>  }))</pre> | `[]` | no |
| name | n/a | `any` | n/a | yes |
| resource\_group\_name | n/a | `any` | n/a | yes |
| throughput | n/a | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| db\_name | n/a |
