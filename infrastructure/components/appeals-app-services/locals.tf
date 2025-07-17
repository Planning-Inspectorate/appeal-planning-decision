locals {
  app_services = {
    #====================================
    # Frontends
    #====================================

    appeals_frontend = {
      app_name   = "appeals-wfe"
      image_name = "appeal-planning-decision/forms-web-app"

      app_service_private_dns_zone_id = var.app_service_private_dns_zone_id
      endpoint_subnet_id              = var.endpoint_subnet_id
      integration_subnet_id           = var.integration_subnet_id

      front_door_restriction     = true
      public_network_access      = true
      key_vault_access           = true
      outbound_vnet_connectivity = true
      inbound_vnet_connectivity  = true
      auth_enabled               = var.appeals_easy_auth_config.web_auth_enabled

      app_settings = {
        ALLOW_TESTING_OVERRIDES                   = var.allow_testing_overrides
        APPLICATIONINSIGHTS_CONNECTION_STRING     = local.secret_refs["appeals-app-insights-connection-string"]
        APPEALS_SERVICE_API_TIMEOUT               = var.api_timeout
        APPEALS_SERVICE_API_URL                   = "https://pins-app-${var.service_name}-appeals-api-${var.resource_suffix}.azurewebsites.net"
        AUTH_BASE_URL                             = "https://pins-app-${var.service_name}-auth-server-${var.resource_suffix}.azurewebsites.net"
        CLAMAV_HOST                               = azurerm_private_dns_a_record.clamav.fqdn
        CLAMAV_PORT                               = "3310"
        CLIENT_ID                                 = local.secret_refs["appeals-forms-web-app-client-id"]
        CLIENT_SECRET                             = local.secret_refs["appeals-forms-web-app-client-secret"]
        COMMENTS_ENABLED                          = var.comments_enabled
        RULE_6_ENABLED                            = var.rule_6_enabled
        SCOPING_OPINION_ENABLED                   = var.scoping_opinion_enabled
        DOCS_API_PATH                             = "/opt/app/api"
        DOCUMENTS_SERVICE_API_TIMEOUT             = var.api_timeout
        DOCUMENTS_SERVICE_API_URL                 = "https://pins-app-${var.service_name}-documents-api-${var.resource_suffix}.azurewebsites.net/"
        FEATURE_FLAG_GOOGLE_TAG_MANAGER           = false
        FEATURE_FLAG_NEW_APPEAL_JOURNEY           = true
        FILE_UPLOAD_DEBUG                         = var.appeals_frontend_file_upload_debug_logging_enabled
        FILE_UPLOAD_MAX_FILE_SIZE_BYTES           = var.max_file_upload_size_in_bytes
        FILE_UPLOAD_TMP_PATH                      = "/tmp"
        FILE_UPLOAD_USE_TEMP_FILES                = true
        GOOGLE_ANALYTICS_ID                       = var.google_analytics_id
        GOOGLE_TAG_MANAGER_ID                     = var.google_tag_manager_id
        HOST_URL                                  = "https://${var.appeals_service_public_url}"
        NODE_ENV                                  = var.node_environment
        PDF_SERVICE_API_URL                       = "https://pins-app-${var.service_name}-pdf-api-${var.resource_suffix}.azurewebsites.net"
        PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING = local.secret_refs["appeals-app-config-connection-string"]
        PORT                                      = "3000"
        SESSION_KEY                               = local.secret_refs["appeals-wfe-session-key"]
        SESSION_MONGODB_COLLECTION                = "sessions"
        SESSION_MONGODB_DB_NAME                   = "forms-web-app"
        SESSION_MONGODB_URL                       = local.secret_refs["appeals-mongo-db-connection-string"]
        SUBDOMAIN_OFFSET                          = "3"
        USE_SECURE_SESSION_COOKIES                = true,
        RETRY_MAX_ATTEMPTS                        = "3"
        RETRY_STATUS_CODES                        = "500,502,503,504"
        MICROSOFT_PROVIDER_AUTHENTICATION_SECRET  = local.secret_refs["appeals-microsoft-provider-authentication-secret"]
        WEBSITE_AUTH_AAD_ALLOWED_TENANTS          = data.azurerm_client_config.current.tenant_id

      }
    }

    #====================================
    # Backends
    #====================================

    auth_server = {
      app_name                        = "auth-server"
      app_service_private_dns_zone_id = var.app_service_private_dns_zone_id
      endpoint_subnet_id              = var.private_endpoint_enabled ? var.endpoint_subnet_id : null
      image_name                      = "appeal-planning-decision/auth-server"
      inbound_vnet_connectivity       = var.private_endpoint_enabled
      public_network_access           = !var.private_endpoint_enabled
      integration_subnet_id           = var.integration_subnet_id
      key_vault_access                = true
      outbound_vnet_connectivity      = true
      auth_enabled                    = false

      app_settings = {
        # logging
        APPLICATIONINSIGHTS_CONNECTION_STRING = local.secret_refs["appeals-app-insights-connection-string"]
        LOGGER_LEVEL                          = var.logger_level
        SERVER_SHOW_ERRORS                    = true

        # feature flags
        PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING = local.secret_refs["appeals-app-config-connection-string"]

        # hosts
        APP_APPEALS_BASE_URL = "https://${var.appeals_service_public_url}"
        OIDC_HOST            = "https://pins-app-${var.service_name}-auth-server-${var.resource_suffix}.azurewebsites.net"

        # sql
        SQL_CONNECTION_STRING = local.secret_refs["appeals-sql-server-connection-string-app"]

        # server
        ALLOW_TESTING_OVERRIDES = var.allow_testing_overrides
        COOKIE_KEYS             = local.secret_refs["appeals-auth-server-cookies-keys"]
        JWKS                    = local.secret_refs["appeals-auth-server-jwks"]
        NODE_ENV                = var.node_environment
        SERVER_PORT             = "3000"

        # notify
        SRV_NOTIFY_API_KEY                          = local.secret_refs["appeals-srv-notify-api-key"]
        SRV_NOTIFY_BASE_URL                         = var.srv_notify_base_url
        SRV_NOTIFY_SERVICE_ID                       = var.srv_notify_service_id
        SRV_NOTIFY_FRONT_OFFICE_GENERIC_TEMPLATE_ID = var.srv_notify_front_office_generic_template_id

        SRV_NOTIFY_APPELLANT_LOGIN_CONFIRM_REGISTRATION_TEMPLATE_ID    = var.srv_notify_appellant_login_confirm_registration_template_id
        SRV_NOTIFY_SAVE_AND_RETURN_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID = var.srv_notify_save_and_return_enter_code_into_service_template_id

        # Clients
        FORMS_WEB_APP_CLIENT_ID     = local.secret_refs["appeals-forms-web-app-client-id"]
        FORMS_WEB_APP_CLIENT_SECRET = local.secret_refs["appeals-forms-web-app-client-secret"]
        FORMS_WEB_APP_REDIRECT_URI  = "https://${var.appeals_service_public_url}/odic"

        FUNCTIONS_CLIENT_ID     = local.secret_refs["appeals-function-client-id"]
        FUNCTIONS_CLIENT_SECRET = local.secret_refs["appeals-function-client-secret"]
      }
    }

    appeals_service_api = {
      app_name                        = "appeals-api"
      app_service_private_dns_zone_id = var.app_service_private_dns_zone_id
      endpoint_subnet_id              = var.private_endpoint_enabled ? var.endpoint_subnet_id : null
      image_name                      = "appeal-planning-decision/appeals-service-api"
      inbound_vnet_connectivity       = var.private_endpoint_enabled
      public_network_access           = !var.private_endpoint_enabled
      integration_subnet_id           = var.integration_subnet_id
      key_vault_access                = true
      outbound_vnet_connectivity      = true
      auth_enabled                    = false

      app_settings = {
        APPLICATIONINSIGHTS_CONNECTION_STRING                                                 = local.secret_refs["appeals-app-insights-connection-string"]
        APP_APPEALS_BASE_URL                                                                  = "https://${var.appeals_service_public_url}"
        AUTH_BASE_URL                                                                         = "https://pins-app-${var.service_name}-auth-server-${var.resource_suffix}.azurewebsites.net"
        BACK_OFFICE_APPELLANT_SUBMISSION_TOPIC                                                = "appeal-fo-appellant-submission"
        BACK_OFFICE_LPA_RESPONSE_SUBMISSION_TOPIC                                             = "appeal-fo-lpa-questionnaire-submission"
        BACK_OFFICE_REPRESENTATION_SUBMISSION_TOPIC                                           = "appeal-fo-representation-submission"
        BLOB_STORAGE_CONNECTION_STRING                                                        = local.secret_refs["appeals-documents-primary-blob-connection-string"]
        DOCS_API_PATH                                                                         = "/opt/app/api"
        DOCUMENTS_SERVICE_API_TIMEOUT                                                         = var.api_timeout
        DOCUMENTS_SERVICE_API_URL                                                             = "https://pins-app-${var.service_name}-documents-api-${var.resource_suffix}.azurewebsites.net"
        FEATURE_FLAG_NEW_APPEAL_JOURNEY                                                       = true
        LOGGER_LEVEL                                                                          = var.logger_level
        LPA_DATA_PATH                                                                         = "/opt/app/data/lpa-list.csv"
        LPA_TRIALIST_DATA_PATH                                                                = "/opt/app/data/lpa-trialists.json"
        MONGODB_AUTO_INDEX                                                                    = true
        MONGODB_NAME                                                                          = "appeals-service-api"
        MONGODB_URL                                                                           = local.secret_refs["appeals-mongo-db-connection-string"]
        NODE_ENV                                                                              = var.node_environment
        PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING                                             = local.secret_refs["appeals-app-config-connection-string"]
        SERVER_PORT                                                                           = "3000"
        SERVER_SHOW_ERRORS                                                                    = true
        SERVER_TERMINATION_GRACE_PERIOD_SECONDS                                               = "0"
        SERVICE_BUS_HOSTNAME                                                                  = "${var.back_office_service_bus_namespace_name}.servicebus.windows.net"
        SERVICE_BUS_ENABLED                                                                   = var.appeals_api_service_bus_enabled
        SQL_CONNECTION_STRING_ADMIN                                                           = local.secret_refs["appeals-sql-server-connection-string-admin"]
        SQL_CONNECTION_STRING                                                                 = local.secret_refs["appeals-sql-server-connection-string-app"]
        SRV_ADMIN_MONITORING_EMAIL                                                            = var.srv_admin_monitoring_email
        SRV_HORIZON_URL                                                                       = var.horizon_url
        SRV_NOTIFY_API_KEY                                                                    = local.secret_refs["appeals-srv-notify-api-key"]
        SRV_NOTIFY_BASE_URL                                                                   = var.srv_notify_base_url
        SRV_NOTIFY_FRONT_OFFICE_GENERIC_TEMPLATE_ID                                           = var.srv_notify_front_office_generic_template_id
        SRV_NOTIFY_FAILURE_TO_UPLOAD_TO_HORIZON_TEMPLATE_ID                                   = var.srv_notify_failure_to_upload_to_horizon_template_id
        SRV_NOTIFY_FINAL_COMMENT_SUBMISSION_CONFIRMATION_EMAIL_TEMPLATE_ID                    = var.srv_notify_final_comment_submission_confirmation_email_template_id
        SRV_NOTIFY_FULL_APPEAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID                    = var.srv_notify_full_appeal_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_FULL_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID                 = var.srv_notify_full_appeal_received_notification_email_to_lpa_template_id
        SRV_NOTIFY_LPA_STATEMENT_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID                          = var.srv_notify_lpa_statement_submission_email_to_lpa_template_id
        SRV_NOTIFY_LPA_FINAL_COMMENT_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID                      = var.srv_notify_lpa_final_comment_submission_email_to_lpa_template_id
        SRV_NOTIFY_LPA_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID                     = var.srv_notify_lpa_proof_evidence_submission_email_to_lpa_template_id
        SRV_NOTIFY_APPELLANT_FINAL_COMMENT_SUBMISSION_EMAIL_TO_APPELLANT_TEMPLATE_ID          = var.srv_notify_appellant_final_comment_submission_email_to_appellant_template_id
        SRV_NOTIFY_APPELLANT_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_APPELLANT_TEMPLATE_ID         = var.srv_notify_appellant_proof_evidence_submission_email_to_appellant_template_id
        SRV_NOTIFY_RULE_6_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_RULE_6_PARTY_TEMPLATE_ID         = var.srv_notify_rule_6_proof_evidence_submission_email_to_rule_6_party_template_id
        SRV_NOTIFY_RULE_6_STATEMENT_SUBMISSION_EMAIL_TO_RULE_6_PARTY_TEMPLATE_ID              = var.srv_notify_rule_6_statement_submission_email_to_rule_6_party_template_id
        SRV_NOTIFY_SAVE_AND_RETURN_CONTINUE_WITH_APPEAL_TEMPLATE_ID                           = var.srv_notify_save_and_return_continue_with_appeal_template_id
        SRV_NOTIFY_SAVE_AND_RETURN_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID                        = var.srv_notify_save_and_return_enter_code_into_service_template_id
        SRV_NOTIFY_CONFIRM_EMAIL_TEMPLATE_ID                                                  = var.srv_notify_confirm_email_template_id
        SRV_NOTIFY_SERVICE_ID                                                                 = var.srv_notify_service_id
        SRV_NOTIFY_V1_APPEAL_SUBMISSION_INITIAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID   = var.srv_notify_v1_appeal_submission_initial_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_V1_APPEAL_SUBMISSION_FOLLOW_UP_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID = var.srv_notify_v1_appeal_submission_follow_up_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_V2_APPEAL_SUBMISSION_INITIAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID   = var.srv_notify_v2_appeal_submission_initial_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_V2_APPEAL_SUBMISSION_FOLLOW_UP_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID = var.srv_notify_v2_appeal_submission_follow_up_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID              = var.srv_notify_appeal_submission_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID_V1_1         = var.srv_notify_appeal_submission_confirmation_email_to_appellant_template_id_v1_1
        SRV_NOTIFY_HAS_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID          = var.srv_notify_has_appeal_submission_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_FULL_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID         = var.srv_notify_full_appeal_submission_confirmation_email_to_appellant_template_id
        SRV_NOTIFY_APPEAL_SUBMISSION_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID                    = var.srv_notify_appeal_submission_notification_email_to_lpa_template_id
        SRV_NOTIFY_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_APPELLANT_TEMPLATE_ID                = var.srv_notify_appeal_received_notification_email_to_appellant_template_id
        SRV_NOTIFY_APPEAL_SUBMISSION_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID           = var.srv_notify_appeal_submission_received_notification_email_to_lpa_template_id
        SRV_NOTIFY_APPELLANT_LOGIN_CONFIRM_REGISTRATION_TEMPLATE_ID                           = var.srv_notify_appellant_login_confirm_registration_template_id
        SRV_NOTIFY_START_EMAIL_TO_LPA_TEMPLATE_ID                                             = var.srv_notify_start_email_to_lpa_template_id
        SRV_NOTIFY_LPA_DASHBOARD_INVITE_TEMPLATE_ID                                           = var.srv_notify_lpa_dashboard_invite_template_id
        SRV_NOTIFY_IP_COMMENT_SUBMISSION_CONFIRMATION_EMAIL_TO_IP_TEMPLATE_ID                 = var.srv_notify_ip_comment_submission_confirmation_email_to_ip_template_id
        SRV_NOTIFY_LPA_HAS_QUESTIONNAIRE_SUBMISSION_EMAIL_TEMPLATE_ID                         = var.srv_notify_lpa_has_questionnaire_submission_email_template_id
        STORAGE_CONTAINER_NAME                                                                = var.appeal_documents_storage_container_name
        TASK_SUBMIT_TO_HORIZON_CRON_STRING                                                    = var.task_submit_to_horizon_cron_string
        TASK_SUBMIT_TO_HORIZON_TRIGGER_ACTIVE                                                 = var.task_submit_to_horizon_trigger_active
      }

      slot_setting_overrides = {
        TASK_SUBMIT_TO_HORIZON_TRIGGER_ACTIVE = "false"
      }
    }

    appeal_documents_service_api = {
      app_name                        = "documents-api"
      app_service_private_dns_zone_id = var.app_service_private_dns_zone_id
      endpoint_subnet_id              = var.private_endpoint_enabled ? var.endpoint_subnet_id : null
      image_name                      = "appeal-planning-decision/documents-api"
      inbound_vnet_connectivity       = var.private_endpoint_enabled
      public_network_access           = !var.private_endpoint_enabled
      integration_subnet_id           = var.integration_subnet_id
      key_vault_access                = true
      outbound_vnet_connectivity      = true
      auth_enabled                    = false

      app_settings = {
        APPLICATIONINSIGHTS_CONNECTION_STRING     = local.secret_refs["appeals-app-insights-connection-string"]
        AUTH_BASE_URL                             = "https://pins-app-${var.service_name}-auth-server-${var.resource_suffix}.azurewebsites.net"
        BLOB_STORAGE_CONNECTION_STRING            = local.secret_refs["appeals-documents-primary-blob-connection-string"]
        BLOB_STORAGE_HOST                         = var.appeal_documents_primary_blob_host
        BO_STORAGE_CONTAINER_HOST                 = var.back_office_document_storage_api_host
        BO_STORAGE_CONTAINER_NAME                 = var.bo_appeals_document_container_name
        DOCS_API_PATH                             = "/opt/app/api"
        FILE_MAX_SIZE_IN_BYTES                    = var.max_file_upload_size_in_bytes
        FILE_UPLOAD_PATH                          = "/tmp/upload"
        LOGGER_LEVEL                              = var.logger_level
        MONGODB_AUTO_INDEX                        = true
        MONGODB_DB_NAME                           = "documents-service-api"
        MONGODB_URL                               = local.secret_refs["appeals-mongo-db-connection-string"]
        NODE_ENV                                  = var.node_environment
        PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING = local.secret_refs["appeals-app-config-connection-string"]
        SERVER_PORT                               = "4000",
        SERVER_SHOW_ERRORS                        = true
        SQL_CONNECTION_STRING                     = local.secret_refs["appeals-sql-server-connection-string-app"]
        STORAGE_CONTAINER_NAME                    = var.appeal_documents_storage_container_name
        STORAGE_UPLOAD_MAX_ATTEMPTS               = "3"
        STORAGE_UPLOAD_QUERY_LIMIT                = "5"
      }
    }

    pdf_service_api = {
      app_name                        = "pdf-api"
      app_service_private_dns_zone_id = var.app_service_private_dns_zone_id
      endpoint_subnet_id              = var.private_endpoint_enabled ? var.endpoint_subnet_id : null
      image_name                      = "appeal-planning-decision/pdf-api"
      inbound_vnet_connectivity       = var.private_endpoint_enabled
      public_network_access           = !var.private_endpoint_enabled
      key_vault_access                = true
      outbound_vnet_connectivity      = false
      auth_enabled                    = false

      app_settings = {
        APPLICATIONINSIGHTS_CONNECTION_STRING   = local.secret_refs["appeals-app-insights-connection-string"]
        AUTH_BASE_URL                           = "https://pins-app-${var.service_name}-auth-server-${var.resource_suffix}.azurewebsites.net"
        DOCS_API_PATH                           = "/opt/app/api"
        GOTENBERG_URL                           = "http://gotenberg:4000"
        LOGGER_LEVEL                            = var.logger_level
        NODE_ENV                                = var.node_environment
        SERVER_PORT                             = "3000"
        SERVER_SHOW_ERRORS                      = true
        SERVER_TERMINATION_GRACE_PERIOD_SECONDS = "0"
      }
    }
  }

  secrets_manual = [
    "appeals-srv-notify-api-key",
    "appeals-wfe-session-key",
    "appeals-auth-server-cookies-keys",
    "appeals-auth-server-jwks",
    "appeals-microsoft-provider-authentication-secret",
  ]

  secrets_automated = [
    "appeals-app-config-connection-string",
    "appeals-app-insights-connection-string",
    "appeals-mongo-db-connection-string",
    "appeals-documents-primary-blob-connection-string",
    "appeals-sql-server-connection-string-admin",
    "appeals-sql-server-connection-string-app",
    "appeals-forms-web-app-client-id",
    "appeals-forms-web-app-client-secret",
    "appeals-function-client-id",
    "appeals-function-client-secret"
  ]

  secret_names = concat(local.secrets_manual, local.secrets_automated)

  secret_refs = {
    for name in local.secret_names : name => "@Microsoft.KeyVault(SecretUri=${var.key_vault_uri}secrets/${name}/)"
  }
}
