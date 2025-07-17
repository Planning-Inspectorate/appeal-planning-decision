# Appeals service

This component contains the infrastructure required for the appeals service. This includes App services, CosmosDB, and the required networking resources.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5.7, < 1.12.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | > 3.107.0 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.9 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.28.0 |
| <a name="provider_azurerm.tooling"></a> [azurerm.tooling](#provider\_azurerm.tooling) | 4.28.0 |
| <a name="provider_random"></a> [random](#provider\_random) | 3.7.2 |
| <a name="provider_time"></a> [time](#provider\_time) | 0.13.1 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_app_services"></a> [app\_services](#module\_app\_services) | ../../../components/appeals-app-services | n/a |
| <a name="module_azure_region_primary"></a> [azure\_region\_primary](#module\_azure\_region\_primary) | claranet/regions/azurerm | 4.2.1 |
| <a name="module_azure_region_secondary"></a> [azure\_region\_secondary](#module\_azure\_region\_secondary) | claranet/regions/azurerm | 4.2.1 |

## Resources

| Name | Type |
|------|------|
| [azurerm_advanced_threat_protection.appeal_documents](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/advanced_threat_protection) | resource |
| [azurerm_advanced_threat_protection.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/advanced_threat_protection) | resource |
| [azurerm_app_configuration.appeals_service](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/app_configuration) | resource |
| [azurerm_app_configuration_feature.appeals_service](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/app_configuration_feature) | resource |
| [azurerm_application_insights.web_app_insights](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/application_insights) | resource |
| [azurerm_application_insights_standard_web_test.portal](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/application_insights_standard_web_test) | resource |
| [azurerm_cosmosdb_account.appeals_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_account) | resource |
| [azurerm_cosmosdb_mongo_collection.appeals_session_collection](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_mongo_collection) | resource |
| [azurerm_cosmosdb_mongo_database.appeals_cosmosdb](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cosmosdb_mongo_database) | resource |
| [azurerm_key_vault_secret.app_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_app_config_endpoint_kv_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_documents_primary_blob_connection_string](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_forms_web_app_client_id](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_forms_web_app_client_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_function_client_id](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_function_client_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_mongo_db_connection_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_connection_string_admin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_connection_string_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_password_admin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_password_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_username_admin](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.appeals_sql_server_username_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_key_vault_secret.applications_insights_connection_kv_secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault_secret) | resource |
| [azurerm_log_analytics_workspace.appeals_service](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_workspace) | resource |
| [azurerm_monitor_metric_alert.appeals_sql_db_cpu_alert](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_metric_alert.appeals_sql_db_deadlock_alert](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_metric_alert.appeals_sql_db_dtu_alert](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_metric_alert.appeals_sql_db_log_io_alert](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_metric_alert.web_availability](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_metric_alert) | resource |
| [azurerm_monitor_scheduled_query_rules_alert_v2.web_app_insights](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/monitor_scheduled_query_rules_alert_v2) | resource |
| [azurerm_mssql_database.appeals_sql_db](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_database) | resource |
| [azurerm_mssql_server.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_server) | resource |
| [azurerm_mssql_server_extended_auditing_policy.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_server_extended_auditing_policy) | resource |
| [azurerm_mssql_server_security_alert_policy.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_server_security_alert_policy) | resource |
| [azurerm_mssql_server_vulnerability_assessment.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mssql_server_vulnerability_assessment) | resource |
| [azurerm_private_endpoint.appeals_app_config](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_private_endpoint.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_private_endpoint.cosmosdb](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_endpoint) | resource |
| [azurerm_resource_group.appeals_service_stack](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) | resource |
| [azurerm_role_assignment.appeals_app_configuration_terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) | resource |
| [azurerm_storage_account.appeal_documents](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) | resource |
| [azurerm_storage_account.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) | resource |
| [azurerm_storage_account.function_apps](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) | resource |
| [azurerm_storage_container.appeals_sql_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_container) | resource |
| [azurerm_storage_container.documents](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_container) | resource |
| [azurerm_storage_container.listedbuildings](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_container) | resource |
| [azurerm_subnet.appeals_service_ingress](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet) | resource |
| [random_id.username_suffix_admin](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_id.username_suffix_app](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id) | resource |
| [random_password.appeals_forms_web_app_client_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.appeals_function_client_secret](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.appeals_sql_server_password_admin](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_password.appeals_sql_server_password_app](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |
| [random_uuid.appeals_forms_web_app_client_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/uuid) | resource |
| [random_uuid.appeals_function_client_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/uuid) | resource |
| [time_offset.secret_expire_date](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/offset) | resource |
| [azurerm_client_config.current](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/client_config) | data source |
| [azurerm_monitor_action_group.tech](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/monitor_action_group) | data source |
| [azurerm_private_dns_zone.app_config](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/private_dns_zone) | data source |
| [azurerm_private_dns_zone.app_service](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/private_dns_zone) | data source |
| [azurerm_private_dns_zone.cosmosdb](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/private_dns_zone) | data source |
| [azurerm_private_dns_zone.database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/private_dns_zone) | data source |
| [azurerm_resource_group.appeals_bo](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/resource_group) | data source |
| [azurerm_servicebus_topic.appeal_document](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_event](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_fo_appellant_submission](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_fo_lpa_questionnaire_submission](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_fo_representation_submission](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_has](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_representation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_s78](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.appeal_service_user](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_servicebus_topic.listed_building](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/servicebus_topic) | data source |
| [azurerm_storage_account.appeals_bo](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/storage_account) | data source |
| [azurerm_storage_container.appeal_bo_documents](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/storage_container) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_action_group_ids"></a> [action\_group\_ids](#input\_action\_group\_ids) | The IDs of the Azure Monitor action groups for different alert types | <pre>object({<br/>    tech            = string,<br/>    service_manager = string,<br/>    iap             = string,<br/>    its             = string,<br/>    info_sec        = string<br/>  })</pre> | n/a | yes |
| <a name="input_action_group_names"></a> [action\_group\_names](#input\_action\_group\_names) | The names of the Azure Monitor action groups for different alert types | <pre>object({<br/>    tech            = string,<br/>    service_manager = string,<br/>    iap             = string,<br/>    its             = string,<br/>    info_sec        = string<br/>  })</pre> | n/a | yes |
| <a name="input_allow_testing_overrides"></a> [allow\_testing\_overrides](#input\_allow\_testing\_overrides) | A switch to determine if testing overrides are enabled to allow easier manual testing | `bool` | `false` | no |
| <a name="input_api_timeout"></a> [api\_timeout](#input\_api\_timeout) | The timeout in milliseconds for API calls in the frontend apps | `string` | n/a | yes |
| <a name="input_app_service_plan_id"></a> [app\_service\_plan\_id](#input\_app\_service\_plan\_id) | The id of the app service plan | `string` | n/a | yes |
| <a name="input_appeals_api_service_bus_enabled"></a> [appeals\_api\_service\_bus\_enabled](#input\_appeals\_api\_service\_bus\_enabled) | A switch to determine if service bus integration is enabled for the appeals api | `bool` | `true` | no |
| <a name="input_appeals_easy_auth_config"></a> [appeals\_easy\_auth\_config](#input\_appeals\_easy\_auth\_config) | Easy Authentication configuration for the web front end | <pre>object({<br/>    client_id        = string<br/>    web_auth_enabled = bool<br/>    application_id   = string<br/>  })</pre> | n/a | yes |
| <a name="input_appeals_feature_back_office_subscriber_enabled"></a> [appeals\_feature\_back\_office\_subscriber\_enabled](#input\_appeals\_feature\_back\_office\_subscriber\_enabled) | Feature toggle for appeals back office to front office service topic susbcription using azure functions | `bool` | `false` | no |
| <a name="input_appeals_feature_flags"></a> [appeals\_feature\_flags](#input\_appeals\_feature\_flags) | A list of maps describing feature flags to be saved in the App Configuration store | `list(any)` | n/a | yes |
| <a name="input_appeals_frontend_file_upload_debug_logging_enabled"></a> [appeals\_frontend\_file\_upload\_debug\_logging\_enabled](#input\_appeals\_frontend\_file\_upload\_debug\_logging\_enabled) | Toggles debug logging for file upload middleware | `bool` | `true` | no |
| <a name="input_appeals_service_public_url"></a> [appeals\_service\_public\_url](#input\_appeals\_service\_public\_url) | The public URL for the Appeals Service frontend web app | `string` | n/a | yes |
| <a name="input_clamav_subnet_id"></a> [clamav\_subnet\_id](#input\_clamav\_subnet\_id) | The id of the subnet to use for clamav | `string` | n/a | yes |
| <a name="input_comments_enabled"></a> [comments\_enabled](#input\_comments\_enabled) | A switch to determine if commenting on an appeal journeys are enabled | `bool` | `false` | no |
| <a name="input_common_integration_functions_subnet_id"></a> [common\_integration\_functions\_subnet\_id](#input\_common\_integration\_functions\_subnet\_id) | The id of the subnet for common integration functions app service plan | `string` | n/a | yes |
| <a name="input_common_resource_group_name"></a> [common\_resource\_group\_name](#input\_common\_resource\_group\_name) | The common infrastructure resource group name | `string` | n/a | yes |
| <a name="input_common_tags"></a> [common\_tags](#input\_common\_tags) | The common resource tags for the project | `map(string)` | n/a | yes |
| <a name="input_common_vnet_cidr_blocks"></a> [common\_vnet\_cidr\_blocks](#input\_common\_vnet\_cidr\_blocks) | A map of IP address blocks from the subnet name to the allocated CIDR prefix | `map(string)` | n/a | yes |
| <a name="input_common_vnet_name"></a> [common\_vnet\_name](#input\_common\_vnet\_name) | The common infrastructure virtual network name | `string` | n/a | yes |
| <a name="input_container_registry_name"></a> [container\_registry\_name](#input\_container\_registry\_name) | The name of the container registry that hosts the image | `string` | n/a | yes |
| <a name="input_container_registry_rg"></a> [container\_registry\_rg](#input\_container\_registry\_rg) | The resource group of the container registry that hosts the image | `string` | n/a | yes |
| <a name="input_cosmosdb_subnet_id"></a> [cosmosdb\_subnet\_id](#input\_cosmosdb\_subnet\_id) | The ID of the VNet in the primary location | `string` | n/a | yes |
| <a name="input_database_public_access_enabled"></a> [database\_public\_access\_enabled](#input\_database\_public\_access\_enabled) | A switch indicating if databases should have public access enabled | `bool` | `false` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | The environment resources are deployed to e.g. 'dev' | `string` | n/a | yes |
| <a name="input_google_analytics_id"></a> [google\_analytics\_id](#input\_google\_analytics\_id) | The id used to connect the frontend app to Google Analytics | `string` | n/a | yes |
| <a name="input_google_tag_manager_id"></a> [google\_tag\_manager\_id](#input\_google\_tag\_manager\_id) | The id used to connect the frontend app to Google Tag Manager | `string` | n/a | yes |
| <a name="input_horizon_url"></a> [horizon\_url](#input\_horizon\_url) | The URL used to connect to Horizon | `string` | n/a | yes |
| <a name="input_instance"></a> [instance](#input\_instance) | The environment instance for use if multiple environments are deployed to a subscription | `string` | `"001"` | no |
| <a name="input_integration_functions_app_service_plan_id"></a> [integration\_functions\_app\_service\_plan\_id](#input\_integration\_functions\_app\_service\_plan\_id) | The id of the common integration functions app service plan | `string` | n/a | yes |
| <a name="input_integration_subnet_id"></a> [integration\_subnet\_id](#input\_integration\_subnet\_id) | The id of the vnet integration subnet the app service is linked to for egress traffic | `string` | n/a | yes |
| <a name="input_internal_dns_name"></a> [internal\_dns\_name](#input\_internal\_dns\_name) | The name of the internal private dns zone | `string` | n/a | yes |
| <a name="input_key_vault_id"></a> [key\_vault\_id](#input\_key\_vault\_id) | The ID of the key vault so the App Service can pull secret values | `string` | n/a | yes |
| <a name="input_key_vault_uri"></a> [key\_vault\_uri](#input\_key\_vault\_uri) | The URI of the Key Vault | `string` | n/a | yes |
| <a name="input_logger_level"></a> [logger\_level](#input\_logger\_level) | The level of logging enabled for applications in the environment e.g. info | `string` | `"info"` | no |
| <a name="input_monitoring_alerts_enabled"></a> [monitoring\_alerts\_enabled](#input\_monitoring\_alerts\_enabled) | Indicates whether Azure Monitor alerts are enabled for App Service | `bool` | `false` | no |
| <a name="input_monitoring_config"></a> [monitoring\_config](#input\_monitoring\_config) | Config for monitoring | <pre>object({<br/>    app_insights_web_test_enabled = bool<br/>  })</pre> | <pre>{<br/>  "app_insights_web_test_enabled": false<br/>}</pre> | no |
| <a name="input_node_environment"></a> [node\_environment](#input\_node\_environment) | The node environment to be used for applications in this environment e.g. development | `string` | `"development"` | no |
| <a name="input_primary_location"></a> [primary\_location](#input\_primary\_location) | The primary location resources are deployed to in slug format e.g. 'uk-south' | `string` | `"uk-west"` | no |
| <a name="input_private_endpoint_enabled"></a> [private\_endpoint\_enabled](#input\_private\_endpoint\_enabled) | A switch to determine if Private Endpoint should be enabled for backend App Services | `bool` | `true` | no |
| <a name="input_rule_6_enabled"></a> [rule\_6\_enabled](#input\_rule\_6\_enabled) | A switch to determine if rule 6 journeys are enabled | `bool` | `false` | no |
| <a name="input_scoping_opinion_enabled"></a> [scoping\_opinion\_enabled](#input\_scoping\_opinion\_enabled) | A switch to determine if scoping opinion questions are enabled | `bool` | `false` | no |
| <a name="input_secondary_location"></a> [secondary\_location](#input\_secondary\_location) | The secondary location resources are deployed to in slug format e.g. 'uk-west' | `string` | `"uk-south"` | no |
| <a name="input_service_bus_config"></a> [service\_bus\_config](#input\_service\_bus\_config) | service bus configuration | <pre>object({<br/>    default_topic_ttl            = string<br/>    bo_internal_subscription_ttl = string<br/>    bo_subscription_ttl          = string<br/>    fo_subscription_ttl          = string<br/>  })</pre> | n/a | yes |
| <a name="input_sql_database_configuration"></a> [sql\_database\_configuration](#input\_sql\_database\_configuration) | A map of database configuration options | `map(string)` | n/a | yes |
| <a name="input_sql_server_azuread_administrator"></a> [sql\_server\_azuread\_administrator](#input\_sql\_server\_azuread\_administrator) | Azure AD details of database administrator user/group | `map(string)` | n/a | yes |
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
| <a name="input_task_submit_to_horizon_cron_string"></a> [task\_submit\_to\_horizon\_cron\_string](#input\_task\_submit\_to\_horizon\_cron\_string) | Task to submit to horizon cron string | `string` | n/a | yes |
| <a name="input_task_submit_to_horizon_trigger_active"></a> [task\_submit\_to\_horizon\_trigger\_active](#input\_task\_submit\_to\_horizon\_trigger\_active) | Task to submit to horizon trigger active | `string` | n/a | yes |
| <a name="input_tooling_network_rg"></a> [tooling\_network\_rg](#input\_tooling\_network\_rg) | The resource group of the pins.internal private dns zone | `string` | n/a | yes |
| <a name="input_tooling_subscription_id"></a> [tooling\_subscription\_id](#input\_tooling\_subscription\_id) | The ID for the Tooling subscription that houses the Container Registry | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_app_service_urls"></a> [app\_service\_urls](#output\_app\_service\_urls) | A map of frontend app service URLs |
| <a name="output_appeal_documents_primary_blob_connection_string"></a> [appeal\_documents\_primary\_blob\_connection\_string](#output\_appeal\_documents\_primary\_blob\_connection\_string) | The Appeal Documents Storage Account blob connection string associated with the primary location |
| <a name="output_appeal_documents_primary_blob_host"></a> [appeal\_documents\_primary\_blob\_host](#output\_appeal\_documents\_primary\_blob\_host) | The full URI for the storage account used for Appeal Documents |
| <a name="output_appeal_documents_storage_container_name"></a> [appeal\_documents\_storage\_container\_name](#output\_appeal\_documents\_storage\_container\_name) | The Appeal Documents Storage Account container name |
| <a name="output_cosmosdb_connection_string"></a> [cosmosdb\_connection\_string](#output\_cosmosdb\_connection\_string) | The connection string used to connect to the MongoDB |
| <a name="output_cosmosdb_id"></a> [cosmosdb\_id](#output\_cosmosdb\_id) | The ID of the Cosmos DB account |
| <a name="output_function_apps_storage_account"></a> [function\_apps\_storage\_account](#output\_function\_apps\_storage\_account) | The name of the storage account used by the Function Apps |
| <a name="output_function_apps_storage_account_access_key"></a> [function\_apps\_storage\_account\_access\_key](#output\_function\_apps\_storage\_account\_access\_key) | The access key for the storage account used by the Function Apps |
| <a name="output_primary_appeals_sql_database_id"></a> [primary\_appeals\_sql\_database\_id](#output\_primary\_appeals\_sql\_database\_id) | ID of the primary (ukw) Appeals SQL Database |
| <a name="output_primary_appeals_sql_database_name"></a> [primary\_appeals\_sql\_database\_name](#output\_primary\_appeals\_sql\_database\_name) | Name of the primary (ukw) Appeals SQL Database |
| <a name="output_primary_appeals_sql_server_id"></a> [primary\_appeals\_sql\_server\_id](#output\_primary\_appeals\_sql\_server\_id) | ID of the primary (ukw) Appeals SQL Server |
| <a name="output_sql_server_password_admin"></a> [sql\_server\_password\_admin](#output\_sql\_server\_password\_admin) | The SQL server administrator password |
| <a name="output_sql_server_password_app"></a> [sql\_server\_password\_app](#output\_sql\_server\_password\_app) | The SQL server app password |
| <a name="output_sql_server_username_admin"></a> [sql\_server\_username\_admin](#output\_sql\_server\_username\_admin) | The SQL server administrator username |
| <a name="output_sql_server_username_app"></a> [sql\_server\_username\_app](#output\_sql\_server\_username\_app) | The SQL server app username |
| <a name="output_web_frontend_url"></a> [web\_frontend\_url](#output\_web\_frontend\_url) | The URL of the web frontend app service |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
