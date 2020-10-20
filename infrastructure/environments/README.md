# Environments

Infrastructure which the applications are deployed toInfrastructure which is common to the su

## Requirements

| Name | Version |
|------|---------|
| azurerm | ~> 2.31.1 |
| random | ~> 3.0.0 |

## Providers

| Name | Version |
|------|---------|
| azurerm | ~> 2.31.1 |
| random | ~> 3.0.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| container\_registry\_name | Name of the container registry | `string` | n/a | yes |
| container\_registry\_rg\_name | Name of the registry's resource group | `string` | n/a | yes |
| k8s\_availability\_zones | Zones to run the node pools in | `list(string)` | `null` | no |
| k8s\_max\_nodes | Maximum number of nodes per pool | `number` | `3` | no |
| k8s\_min\_nodes | Minimum number of nodes per pool | `number` | `1` | no |
| k8s\_rbac\_admin\_groups | List of AAD groups that have admin rights on the cluster | `set(string)` | `[]` | no |
| k8s\_rbac\_enabled | Enable RBAC on cluster | `bool` | `true` | no |
| k8s\_version\_prefix | Version prefix to use - ensure you end with dot (.) | `string` | `"1.18."` | no |
| k8s\_vm\_size | VM size | `string` | `"Standard_DS2_v2"` | no |
| key\_vault\_id | Key Vault ID | `string` | n/a | yes |
| location | Default location for resources | `string` | `"uksouth"` | no |
| mongodb\_failover\_read\_locations | Locations where read failover replicas are created for MongoDB | `list(string)` | `[]` | no |
| mongodb\_max\_throughput | Max throughput of the MongoDB database - set in increments of 1,000 between 4,000 and 1,000,000 | `number` | `4000` | no |
| prefix | Resource prefix | `string` | `"pins"` | no |

## Outputs

| Name | Description |
|------|-------------|
| app-name | The application name - used for identifying resource groups |
| containers\_password | Password for the container registry |
| containers\_server | Server URL for the container registry |
| containers\_username | Username for the container registry |
| kube\_load\_balancer\_ip | The IP of the load balancer for the Kubernetes cluster |
| kube\_load\_balancer\_rg | The rosource group the load balancer IP exists in |
| kubeconfig | The Kubernetes config file |
