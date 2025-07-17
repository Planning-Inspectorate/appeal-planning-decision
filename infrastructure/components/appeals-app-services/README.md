# Appeals service App Services

This module contains the App Services resources for the appeals service. These are placed in a sub-module as they need to be deployed to multiple Locations.

This module also contains some resources such as Service Bus and Function Apps required to connect to Horizon.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | > 3.107.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | > 3.107.0 |
| <a name="provider_azurerm.tooling"></a> [azurerm.tooling](#provider\_azurerm.tooling) | > 3.107.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_app_service"></a> [app\_service](#module\_app\_service) | github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-app-service | 1.40 |
| <a name="module_azure_region"></a> [azure\_region](#module\_azure\_region) | claranet/regions/azurerm | 4.2.1 |
| <a name="module_front_office_subscribers"></a> [front\_office\_subscribers](#module\_front\_office\_subscribers) | github.com/Planning-Inspectorate/infrastructure-modules.git//modules/node-function-app | 1.40 |

## Resources

| Name | Type |
|------|------|
| [azurerm_container_group.clamav](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_group) | resource |
| [azurerm_monitor_metric_alert.clamav_cpu](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_metric_alert.clamav_memory](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_private_dns_a_record.clamav](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_a_record) | resource |
| [azurerm_role_assignment.app_configuration_access](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeal_fo_representation_submission_send_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeal_representation_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_docs_api_bo_storage_account_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_docs_api_bo_storage_container_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_api_send_appellant_submission_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_api_send_lpa_submission_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_document_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_event_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_has_case_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_s78_case_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_send_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_fo_service_user_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.documents_access](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.listed_building_service_bus_role](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.write_dns_access](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_servicebus_subscription.appeals_fo_appeal_representation_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_document_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_event_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_has_case_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_listed_building_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_s78_case_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_servicebus_subscription.appeals_fo_service_user_topic_subscription](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/servicebus_subscription) | resource |
| [azurerm_storage_account.clamav](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) | resource |
| [azurerm_storage_share.clamav](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_share) | resource |
| [azurerm_client_config.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/client_config) | data source |
| [azurerm_private_dns_zone.internal](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/private_dns_zone) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_action_group_ids"></a> [action\_group\_ids](#input\_action\_group\_ids) | The IDs of the Azure Monitor action groups for different alert types | <pre>object({<br/>    tech            = string,<br/>    service_manager = string,<br/>    iap             = string,<br/>    its             = string,<br/>    info_sec        = string<br/>  })</pre> | n/a | yes |
| <a name="input_allow_testing_overrides"></a> [allow\_testing\_overrides](#input\_allow\_testing\_overrides) | A switch to determine if testing overrides are enabled to allow easier manual testing | `bool` | `false` | no |
| <a name="input_api_timeout"></a> [api\_timeout](#input\_api\_timeout) | The timeout in milliseconds for API calls in the frontend apps | `string` | n/a | yes |
| <a name="input_app_insights_instrument_key"></a> [app\_insights\_instrument\_key](#input\_app\_insights\_instrument\_key) | App Insights instrument key, for the function apps | `string` | n/a | yes |
| <a name="input_app_service_plan_id"></a> [app\_service\_plan\_id](#input\_app\_service\_plan\_id) | The id of the app service plan | `string` | n/a | yes |
| <a name="input_app_service_private_dns_zone_id"></a> [app\_service\_private\_dns\_zone\_id](#input\_app\_service\_private\_dns\_zone\_id) | The id of the private DNS zone for App services | `string` | n/a | yes |
| <a name="input_appeal_documents_primary_blob_host"></a> [appeal\_documents\_primary\_blob\_host](#input\_appeal\_documents\_primary\_blob\_host) | The full URI for the storage account used for Appeal Documents | `string` | n/a | yes |
| <a name="input_appeal_documents_storage_container_name"></a> [appeal\_documents\_storage\_container\_name](#input\_appeal\_documents\_storage\_container\_name) | The name of the Storage Container for Appeal Documents | `string` | n/a | yes |
| <a name="input_appeals_api_service_bus_enabled"></a> [appeals\_api\_service\_bus\_enabled](#input\_appeals\_api\_service\_bus\_enabled) | A switch to determine if service bus integration is enabled for the appeals api | `bool` | `true` | no |
| <a name="input_appeals_easy_auth_config"></a> [appeals\_easy\_auth\_config](#input\_appeals\_easy\_auth\_config) | Easy Authentication configuration for the web front end | <pre>object({<br/>    client_id        = string<br/>    web_auth_enabled = bool<br/>    application_id   = string<br/>  })</pre> | n/a | yes |
| <a name="input_appeals_feature_back_office_subscriber_enabled"></a> [appeals\_feature\_back\_office\_subscriber\_enabled](#input\_appeals\_feature\_back\_office\_subscriber\_enabled) | Feature toggle for appeals back office to front office service topic susbcription using azure functions | `bool` | `false` | no |
| <a name="input_appeals_frontend_file_upload_debug_logging_enabled"></a> [appeals\_frontend\_file\_upload\_debug\_logging\_enabled](#input\_appeals\_frontend\_file\_upload\_debug\_logging\_enabled) | Toggles debug logging for file upload middleware | `bool` | `true` | no |
| <a name="input_appeals_service_public_url"></a> [appeals\_service\_public\_url](#input\_appeals\_service\_public\_url) | The public URL for the Appeals Service frontend web app | `string` | n/a | yes |
| <a name="input_back_office_document_storage_api_host"></a> [back\_office\_document\_storage\_api\_host](#input\_back\_office\_document\_storage\_api\_host) | The full URI for the storage account used for back office documents | `string` | n/a | yes |
| <a name="input_back_office_service_bus_namespace_name"></a> [back\_office\_service\_bus\_namespace\_name](#input\_back\_office\_service\_bus\_namespace\_name) | Namespace of Back Office Service Bus instance | `string` | n/a | yes |
| <a name="input_bo_appeals_document_container_id"></a> [bo\_appeals\_document\_container\_id](#input\_bo\_appeals\_document\_container\_id) | ID of the Back Office storage container for appeals docs | `string` | n/a | yes |
| <a name="input_bo_appeals_document_container_name"></a> [bo\_appeals\_document\_container\_name](#input\_bo\_appeals\_document\_container\_name) | Name of the Back Office storage container for appeals docs | `string` | n/a | yes |
| <a name="input_bo_storage_account_id"></a> [bo\_storage\_account\_id](#input\_bo\_storage\_account\_id) | Id of the Back Office storage account | `string` | n/a | yes |
| <a name="input_clamav_subnet_id"></a> [clamav\_subnet\_id](#input\_clamav\_subnet\_id) | The id of the subnet to use for clamav | `string` | n/a | yes |
| <a name="input_comments_enabled"></a> [comments\_enabled](#input\_comments\_enabled) | A switch to determine if commenting on an appeal journeys are enabled | `bool` | `false` | no |
| <a name="input_common_integration_functions_subnet_id"></a> [common\_integration\_functions\_subnet\_id](#input\_common\_integration\_functions\_subnet\_id) | The id of the subnet for common integration functions app service plan | `string` | n/a | yes |
| <a name="input_container_registry_name"></a> [container\_registry\_name](#input\_container\_registry\_name) | The name of the container registry that hosts the image | `string` | n/a | yes |
| <a name="input_container_registry_rg"></a> [container\_registry\_rg](#input\_container\_registry\_rg) | The resource group of the container registry that hosts the image | `string` | n/a | yes |
| <a name="input_endpoint_subnet_id"></a> [endpoint\_subnet\_id](#input\_endpoint\_subnet\_id) | The id of the private endpoint subnet the app service is linked to for ingress traffic | `string` | n/a | yes |
| <a name="input_function_apps_storage_account"></a> [function\_apps\_storage\_account](#input\_function\_apps\_storage\_account) | The name of the storage account used by the Function Apps | `string` | n/a | yes |
| <a name="input_function_apps_storage_account_access_key"></a> [function\_apps\_storage\_account\_access\_key](#input\_function\_apps\_storage\_account\_access\_key) | The access key for the storage account | `string` | n/a | yes |
| <a name="input_google_analytics_id"></a> [google\_analytics\_id](#input\_google\_analytics\_id) | The id used to connect the frontend app to Google Analytics | `string` | n/a | yes |
| <a name="input_google_tag_manager_id"></a> [google\_tag\_manager\_id](#input\_google\_tag\_manager\_id) | The id used to connect the frontend app to Google Tag Manager | `string` | n/a | yes |
| <a name="input_horizon_url"></a> [horizon\_url](#input\_horizon\_url) | The URL used to connect to Horizon | `string` | n/a | yes |
| <a name="input_integration_functions_app_service_plan_id"></a> [integration\_functions\_app\_service\_plan\_id](#input\_integration\_functions\_app\_service\_plan\_id) | The id of the integration functions app service plan | `string` | n/a | yes |
| <a name="input_integration_subnet_id"></a> [integration\_subnet\_id](#input\_integration\_subnet\_id) | The id of the vnet integration subnet the app service is linked to for egress traffic | `string` | n/a | yes |
| <a name="input_internal_dns_name"></a> [internal\_dns\_name](#input\_internal\_dns\_name) | The name of the internal private dns zone | `string` | n/a | yes |
| <a name="input_key_vault_id"></a> [key\_vault\_id](#input\_key\_vault\_id) | The ID of the key vault so the App Service can pull secret values | `string` | n/a | yes |
| <a name="input_key_vault_uri"></a> [key\_vault\_uri](#input\_key\_vault\_uri) | The URI of the Key Vault | `string` | n/a | yes |
| <a name="input_location"></a> [location](#input\_location) | The location the App Services are deployed to in slug format e.g. 'uk-south' | `string` | n/a | yes |
| <a name="input_log_analytics_workspace_id"></a> [log\_analytics\_workspace\_id](#input\_log\_analytics\_workspace\_id) | The ID of the Azure Monitor Log Analytics Workspace | `string` | n/a | yes |
| <a name="input_logger_level"></a> [logger\_level](#input\_logger\_level) | The level of logging enabled for applications in the environment e.g. info | `string` | `"info"` | no |
| <a name="input_max_file_upload_size_in_bytes"></a> [max\_file\_upload\_size\_in\_bytes](#input\_max\_file\_upload\_size\_in\_bytes) | Max number of bytes allowed in a file upload | `string` | `"26214400"` | no |
| <a name="input_monitoring_alerts_enabled"></a> [monitoring\_alerts\_enabled](#input\_monitoring\_alerts\_enabled) | Indicates whether Azure Monitor alerts are enabled for App Service | `bool` | `false` | no |
| <a name="input_node_environment"></a> [node\_environment](#input\_node\_environment) | The node environment to be used for applications in this environment e.g. development | `string` | `"development"` | no |
| <a name="input_private_endpoint_enabled"></a> [private\_endpoint\_enabled](#input\_private\_endpoint\_enabled) | A switch to determine if Private Endpoint should be enabled for backend App Services | `bool` | `true` | no |
| <a name="input_resource_group_id"></a> [resource\_group\_id](#input\_resource\_group\_id) | The ID of the resource group that will contain the App Services | `string` | n/a | yes |
| <a name="input_resource_group_name"></a> [resource\_group\_name](#input\_resource\_group\_name) | The name of the resource group that will contain the App Services | `string` | n/a | yes |
| <a name="input_resource_suffix"></a> [resource\_suffix](#input\_resource\_suffix) | The suffix for resource naming | `string` | n/a | yes |
| <a name="input_rule_6_enabled"></a> [rule\_6\_enabled](#input\_rule\_6\_enabled) | A switch to determine if rule 6 journeys are enabled | `bool` | `false` | no |
| <a name="input_scoping_opinion_enabled"></a> [scoping\_opinion\_enabled](#input\_scoping\_opinion\_enabled) | A switch to determine if scoping opinion questions are enabled | `bool` | `false` | no |
| <a name="input_service_bus_appeal_fo_representation_submission_topic_id"></a> [service\_bus\_appeal\_fo\_representation\_submission\_topic\_id](#input\_service\_bus\_appeal\_fo\_representation\_submission\_topic\_id) | ID for the appeals fo representation submission topic | `string` | n/a | yes |
| <a name="input_service_bus_appeal_representation_topic_id"></a> [service\_bus\_appeal\_representation\_topic\_id](#input\_service\_bus\_appeal\_representation\_topic\_id) | ID for the appeals fo representation topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_bo_document_topic_id"></a> [service\_bus\_appeals\_bo\_document\_topic\_id](#input\_service\_bus\_appeals\_bo\_document\_topic\_id) | ID for the appeals case data topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_bo_event_topic_id"></a> [service\_bus\_appeals\_bo\_event\_topic\_id](#input\_service\_bus\_appeals\_bo\_event\_topic\_id) | ID for the appeals event case data topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_bo_has_case_topic_id"></a> [service\_bus\_appeals\_bo\_has\_case\_topic\_id](#input\_service\_bus\_appeals\_bo\_has\_case\_topic\_id) | ID for the appeals HAS case data topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_bo_s78_case_topic_id"></a> [service\_bus\_appeals\_bo\_s78\_case\_topic\_id](#input\_service\_bus\_appeals\_bo\_s78\_case\_topic\_id) | ID for the appeals s78 case data topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_bo_service_user_topic_id"></a> [service\_bus\_appeals\_bo\_service\_user\_topic\_id](#input\_service\_bus\_appeals\_bo\_service\_user\_topic\_id) | ID for the appeals service user case data topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_fo_appellant_submission_topic_id"></a> [service\_bus\_appeals\_fo\_appellant\_submission\_topic\_id](#input\_service\_bus\_appeals\_fo\_appellant\_submission\_topic\_id) | ID for the appeals fo front office LPA response submission topic | `string` | n/a | yes |
| <a name="input_service_bus_appeals_fo_lpa_response_submission_topic_id"></a> [service\_bus\_appeals\_fo\_lpa\_response\_submission\_topic\_id](#input\_service\_bus\_appeals\_fo\_lpa\_response\_submission\_topic\_id) | ID for the appeals fo front office LPA response submission topic | `string` | n/a | yes |
| <a name="input_service_bus_config"></a> [service\_bus\_config](#input\_service\_bus\_config) | service bus configuration | <pre>object({<br/>    default_topic_ttl            = string<br/>    bo_internal_subscription_ttl = string<br/>    bo_subscription_ttl          = string<br/>    fo_subscription_ttl          = string<br/>  })</pre> | n/a | yes |
| <a name="input_service_bus_listed_building_topic_id"></a> [service\_bus\_listed\_building\_topic\_id](#input\_service\_bus\_listed\_building\_topic\_id) | ID for the listed building topic | `string` | n/a | yes |
| <a name="input_service_name"></a> [service\_name](#input\_service\_name) | The name of the service the Azure App Services are part of | `string` | n/a | yes |
| <a name="input_srv_admin_monitoring_email"></a> [srv\_admin\_monitoring\_email](#input\_srv\_admin\_monitoring\_email) | Email for the Horizon failure team | `string` | n/a | yes |
| <a name="input_srv_notify_appeal_received_notification_email_to_appellant_template_id"></a> [srv\_notify\_appeal\_received\_notification\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_appeal\_received\_notification\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appeal_submission_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appeal_submission_confirmation_email_to_appellant_template_id_v1_1"></a> [srv\_notify\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id\_v1\_1](#input\_srv\_notify\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id\_v1\_1) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appeal_submission_notification_email_to_lpa_template_id"></a> [srv\_notify\_appeal\_submission\_notification\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_appeal\_submission\_notification\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appeal_submission_received_notification_email_to_lpa_template_id"></a> [srv\_notify\_appeal\_submission\_received\_notification\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_appeal\_submission\_received\_notification\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appellant_final_comment_submission_email_to_appellant_template_id"></a> [srv\_notify\_appellant\_final\_comment\_submission\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_appellant\_final\_comment\_submission\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appellant_login_confirm_registration_template_id"></a> [srv\_notify\_appellant\_login\_confirm\_registration\_template\_id](#input\_srv\_notify\_appellant\_login\_confirm\_registration\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_appellant_proof_evidence_submission_email_to_appellant_template_id"></a> [srv\_notify\_appellant\_proof\_evidence\_submission\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_appellant\_proof\_evidence\_submission\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_base_url"></a> [srv\_notify\_base\_url](#input\_srv\_notify\_base\_url) | The base URL for the Notifications service | `string` | n/a | yes |
| <a name="input_srv_notify_confirm_email_template_id"></a> [srv\_notify\_confirm\_email\_template\_id](#input\_srv\_notify\_confirm\_email\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_failure_to_upload_to_horizon_template_id"></a> [srv\_notify\_failure\_to\_upload\_to\_horizon\_template\_id](#input\_srv\_notify\_failure\_to\_upload\_to\_horizon\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_final_comment_submission_confirmation_email_template_id"></a> [srv\_notify\_final\_comment\_submission\_confirmation\_email\_template\_id](#input\_srv\_notify\_final\_comment\_submission\_confirmation\_email\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_front_office_generic_template_id"></a> [srv\_notify\_front\_office\_generic\_template\_id](#input\_srv\_notify\_front\_office\_generic\_template\_id) | Generic notify template ID required by the Appeals Service | `string` | n/a | yes |
| <a name="input_srv_notify_full_appeal_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_full\_appeal\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_full\_appeal\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_full_appeal_received_notification_email_to_lpa_template_id"></a> [srv\_notify\_full\_appeal\_received\_notification\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_full\_appeal\_received\_notification\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_full_appeal_submission_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_full\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_full\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_has_appeal_submission_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_has\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_has\_appeal\_submission\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_ip_comment_submission_confirmation_email_to_ip_template_id"></a> [srv\_notify\_ip\_comment\_submission\_confirmation\_email\_to\_ip\_template\_id](#input\_srv\_notify\_ip\_comment\_submission\_confirmation\_email\_to\_ip\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_lpa_dashboard_invite_template_id"></a> [srv\_notify\_lpa\_dashboard\_invite\_template\_id](#input\_srv\_notify\_lpa\_dashboard\_invite\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_lpa_final_comment_submission_email_to_lpa_template_id"></a> [srv\_notify\_lpa\_final\_comment\_submission\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_lpa\_final\_comment\_submission\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_lpa_has_questionnaire_submission_email_template_id"></a> [srv\_notify\_lpa\_has\_questionnaire\_submission\_email\_template\_id](#input\_srv\_notify\_lpa\_has\_questionnaire\_submission\_email\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_lpa_proof_evidence_submission_email_to_lpa_template_id"></a> [srv\_notify\_lpa\_proof\_evidence\_submission\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_lpa\_proof\_evidence\_submission\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_lpa_statement_submission_email_to_lpa_template_id"></a> [srv\_notify\_lpa\_statement\_submission\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_lpa\_statement\_submission\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_rule_6_proof_evidence_submission_email_to_rule_6_party_template_id"></a> [srv\_notify\_rule\_6\_proof\_evidence\_submission\_email\_to\_rule\_6\_party\_template\_id](#input\_srv\_notify\_rule\_6\_proof\_evidence\_submission\_email\_to\_rule\_6\_party\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_rule_6_statement_submission_email_to_rule_6_party_template_id"></a> [srv\_notify\_rule\_6\_statement\_submission\_email\_to\_rule\_6\_party\_template\_id](#input\_srv\_notify\_rule\_6\_statement\_submission\_email\_to\_rule\_6\_party\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_save_and_return_continue_with_appeal_template_id"></a> [srv\_notify\_save\_and\_return\_continue\_with\_appeal\_template\_id](#input\_srv\_notify\_save\_and\_return\_continue\_with\_appeal\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_save_and_return_enter_code_into_service_template_id"></a> [srv\_notify\_save\_and\_return\_enter\_code\_into\_service\_template\_id](#input\_srv\_notify\_save\_and\_return\_enter\_code\_into\_service\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_service_id"></a> [srv\_notify\_service\_id](#input\_srv\_notify\_service\_id) | The ID of the Notifications service | `string` | n/a | yes |
| <a name="input_srv_notify_start_email_to_lpa_template_id"></a> [srv\_notify\_start\_email\_to\_lpa\_template\_id](#input\_srv\_notify\_start\_email\_to\_lpa\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_v1_appeal_submission_follow_up_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_v1\_appeal\_submission\_follow\_up\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_v1\_appeal\_submission\_follow\_up\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_v1_appeal_submission_initial_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_v1\_appeal\_submission\_initial\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_v1\_appeal\_submission\_initial\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_v2_appeal_submission_follow_up_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_v2\_appeal\_submission\_follow\_up\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_v2\_appeal\_submission\_follow\_up\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_srv_notify_v2_appeal_submission_initial_confirmation_email_to_appellant_template_id"></a> [srv\_notify\_v2\_appeal\_submission\_initial\_confirmation\_email\_to\_appellant\_template\_id](#input\_srv\_notify\_v2\_appeal\_submission\_initial\_confirmation\_email\_to\_appellant\_template\_id) | A template ID required by the Appeals Service API | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | The tags applied to all resources | `map(string)` | n/a | yes |
| <a name="input_task_submit_to_horizon_cron_string"></a> [task\_submit\_to\_horizon\_cron\_string](#input\_task\_submit\_to\_horizon\_cron\_string) | Task to submit to horizon cron string | `string` | n/a | yes |
| <a name="input_task_submit_to_horizon_trigger_active"></a> [task\_submit\_to\_horizon\_trigger\_active](#input\_task\_submit\_to\_horizon\_trigger\_active) | Task to submit to horizon trigger active | `string` | n/a | yes |
| <a name="input_tooling_network_rg"></a> [tooling\_network\_rg](#input\_tooling\_network\_rg) | The resource group of the pins.internal private dns zone | `string` | n/a | yes |
| <a name="input_tooling_subscription_id"></a> [tooling\_subscription\_id](#input\_tooling\_subscription\_id) | The subscription containing the shared tooling resources | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_app_service_ids"></a> [app\_service\_ids](#output\_app\_service\_ids) | A map of App Service IDs |
| <a name="output_app_service_principal_ids"></a> [app\_service\_principal\_ids](#output\_app\_service\_principal\_ids) | A map of App Service principal IDs |
| <a name="output_app_service_urls"></a> [app\_service\_urls](#output\_app\_service\_urls) | A map of App Service URLs |
| <a name="output_secrets_manual"></a> [secrets\_manual](#output\_secrets\_manual) | List of Key Vault secrets required for this component |
| <a name="output_web_frontend_url"></a> [web\_frontend\_url](#output\_web\_frontend\_url) | The URL of the web frontend App Service |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
