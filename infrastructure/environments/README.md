# Environments

Infrastructure which the applications are deployed to

## Service Principal permissions:

### Subscription IAM
- Contributor
- User Access Administrator

### Active Directory API Permissions
- Delegation:
  - Directory.ReadWrite.All
  - Group.ReadWrite.All
- Application
  - Application.ReadWrite.All

[Read more](https://simonemms.com/blog/2021/01/10/setting-terraform-service-principal-to-work-with-azure-active-directory)

## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| azuread | n/a |
| azurerm | n/a |
| azurerm.pins-acphzn-prod | n/a |
| azurerm.pins-odt | n/a |
| http | n/a |
| random | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| container\_registry\_name | Name of the container registry | `string` | n/a | yes |
| container\_registry\_rg\_name | Name of the registry's resource group | `string` | n/a | yes |
| documents\_soft\_delete\_retention | Number of days to allow for data recovery | `number` | `30` | no |
| horizon\_enabled | Enable the connection to the Horizon instance over a virtual network gateway | `bool` | `false` | no |
| horizon\_gateway\_ip\_secret | Public IP address of the Horizon VPN gateway | `string` | `"horizon-gateway-ip"` | no |
| horizon\_gateway\_sku | SKU of the Horizon gateway | `string` | `"VpnGw1"` | no |
| horizon\_gateway\_subnets\_secret | CSV of subnets to use for the Horizon VPN gateway | `string` | `null` | no |
| horizon\_shared\_key\_secret | Name of the Horizon shared key in the PINS key vault | `string` | `null` | no |
| k8s\_availability\_zones | Zones to run the node pools in | `list(string)` | `null` | no |
| k8s\_max\_nodes | Maximum number of nodes per pool | `number` | `3` | no |
| k8s\_min\_nodes | Minimum number of nodes per pool | `number` | `1` | no |
| k8s\_rbac\_enabled | Enable RBAC on cluster | `bool` | `true` | no |
| k8s\_version\_prefix | Version prefix to use - ensure you end with dot (.) | `string` | `"1.18."` | no |
| k8s\_vm\_size | VM size | `string` | `"Standard_DS2_v2"` | no |
| location | Default location for resources | `string` | `"uksouth"` | no |
| mongodb\_auto\_failover | Enable auto failover between regions | `bool` | `false` | no |
| mongodb\_consistency\_max\_interval\_in\_seconds | Represents the amount of staleness that is tolerated (in seconds) - min 5 mins for global replication | `number` | `300` | no |
| mongodb\_consistency\_policy | Cosmos consistency policy | `string` | `"BoundedStaleness"` | no |
| mongodb\_databases | List of databases and collections to provision | <pre>list(object({<br>    name = string<br>    collections = list(object({<br>      name = string<br>      default_ttl_seconds = number<br>      indexes = list(object({<br>        keys = set(string)<br>        unique = bool<br>      }))<br>    }))<br>  }))</pre> | `[]` | no |
| mongodb\_failover\_locations | Locations where failover replicas are created for MongoDB | <pre>list(object({<br>    location = string<br>    redundancy = bool<br>  }))</pre> | `[]` | no |
| mongodb\_max\_staleness\_prefix | Represents the number of state requests that are tolerated - min 100,000 for global replication | `number` | `100000` | no |
| mongodb\_max\_throughput | Max throughput of the MongoDB database - set in increments of 100 between 400 and 100,000 | `number` | `400` | no |
| mongodb\_multi\_write\_locations | Enable multiple write locations | `bool` | `false` | no |
| mongodb\_primary\_zone\_redundancy | Enable redundancy in the primary zone | `bool` | `false` | no |
| network\_create\_own | Create our own network resources - this will require a VPN to Horizon if true | `bool` | `true` | no |
| network\_pins\_name | Name of the PINS network | `string` | `"VNPRD-192.168.0.0-16"` | no |
| network\_pins\_resource\_group | Resource group of the PINS network | `string` | `"PRDHZN"` | no |
| network\_subnet | Subnet to use for the primary network | `list(string)` | <pre>[<br>  "10.30.1.0/24"<br>]</pre> | no |
| pins\_key\_vault | ID of the PINS Key Vault - used to securely share secrets with this infrastructure | `string` | `null` | no |
| pins\_key\_vault\_subscription\_id | Subscription ID for the Key Vault | `string` | `null` | no |
| prefix | Resource prefix | `string` | `"pins"` | no |
| target\_subscription\_id | Subscription ID for the resources - if not set, will use the $ARM\_SUBSCRIPTION\_ID | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| app-name | The application name - used for identifying resource groups |
| containers\_password | Password for the container registry |
| containers\_server | Server URL for the container registry |
| containers\_username | Username for the container registry |
| group\_admin\_id | ID of the Admin AAD group |
| group\_user\_id | ID of the User AAD group |
| key\_vault\_name | Key vault name |
| key\_vault\_secrets | Secrets JSON key/value pairs to be ingested into Key Vault - done externally to avoid Terraform refresh permissions errors. Values must be strings. |
| kube\_load\_balancer\_domain\_label | The DNS label of the load balancer for the Kubernetes cluster |
| kube\_load\_balancer\_ip | The IP of the load balancer for the Kubernetes cluster |
| kube\_load\_balancer\_rg | The rosource group the load balancer IP exists in |
| kubeconfig | The Kubernetes config file |
| mongodb\_connection\_strings | MongoDB connection strings for each database |

