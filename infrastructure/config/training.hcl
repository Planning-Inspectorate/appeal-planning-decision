locals {
  appeals_feature_flags = [
    {
      name    = "adverts-appeal-form-v2"
      enabled = false
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    },
    {
      name    = "cas-adverts-appeal-form-v2"
      enabled = false
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    },
    {
      name    = "cas-planning-appeal-form-v2"
      enabled = false
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    },
    {
      name    = "has-appeal-form-v2"
      enabled = true
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    },
    {
      name    = "s20-appeal-form-v2"
      enabled = false
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    },
    {
      name    = "s78-appeal-form-v2"
      enabled = true
      targeting = {
        percentage = 100
        users      = ["Q1111"]
      }
    }
  ]
  allow_testing_overrides                            = true
  appeals_feature_back_office_subscriber_enabled     = true
  appeals_frontend_file_upload_debug_logging_enabled = false
  comments_enabled                                   = true
  rule_6_enabled                                     = false
  scoping_opinion_enabled                            = true
  google_analytics_id                                = "G-HWLKLSJF53"
  google_tag_manager_id                              = "GTM-KZN7XP4"
  horizon_url                                        = "http://10.0.7.4:8000"
  monitoring_config = {
    app_insights_web_test_enabled = true
  }
  node_environment                                                                      = "production"
  srv_notify_front_office_generic_template_id                                           = "574c7769-5032-4c02-8359-7e85f702dd94"
  srv_notify_v1_appeal_submission_initial_confirmation_email_to_appellant_template_id   = "c14993c8-d1b7-4210-9287-c2e138265e44"
  srv_notify_v1_appeal_submission_follow_up_confirmation_email_to_appellant_template_id = "20d16d8c-ad68-4816-b987-4a1712566da0"
  srv_notify_v2_appeal_submission_initial_confirmation_email_to_appellant_template_id   = "f1aa8ada-034e-4559-b256-1364ecc158ca"
  srv_notify_v2_appeal_submission_follow_up_confirmation_email_to_appellant_template_id = "50888545-f1a8-47ab-8c5b-65540cde2b0f"
  srv_notify_appeal_submission_confirmation_email_to_appellant_template_id              = "27cddb5b-aa1e-453e-a511-f8eab31c3bb3"
  srv_notify_appeal_submission_confirmation_email_to_appellant_template_id_v1_1         = "0068d142-8f16-4ec2-99a8-8cbb154439b9"
  srv_notify_has_appeal_submission_confirmation_email_to_appellant_template_id          = "a27fb17b-326e-4b7f-b819-fee4bae9f31e"
  srv_notify_full_appeal_submission_confirmation_email_to_appellant_template_id         = "e977a1c3-4c0c-42b7-9606-b336e8c5a999"
  srv_notify_appeal_submission_notification_email_to_lpa_template_id                    = "363bebac-340f-422c-941a-0e7b0a907583"
  srv_notify_appeal_received_notification_email_to_appellant_template_id                = "d5ca8e4d-9ccc-43e6-9e88-3ae8f2d84c88"
  srv_notify_appeal_submission_received_notification_email_to_lpa_template_id           = "b8c7a449-3bc1-4ce1-b07c-4e90f4bd9c17"
  srv_notify_appellant_login_confirm_registration_template_id                           = "c7e08c14-c45c-45e5-b0d1-460de0006215"
  srv_notify_start_email_to_lpa_template_id                                             = "22a6d662-3bbe-404f-8bca-c4b5c67ad346"
  srv_notify_lpa_dashboard_invite_template_id                                           = "762e0926-112f-4c71-b4fd-ad847aa1c63c"
  srv_notify_ip_comment_submission_confirmation_email_to_ip_template_id                 = "96e74875-c919-4d02-98af-5bb746954079"
  srv_notify_full_appeal_confirmation_email_to_appellant_template_id                    = "d7535a2e-425c-4254-9f09-2b0eb460368c"
  srv_notify_full_appeal_received_notification_email_to_lpa_template_id                 = "3621ad01-9599-422e-b15c-903725261e6f"
  srv_notify_lpa_statement_submission_email_to_lpa_template_id                          = "2469c124-eca3-49ac-8206-4a9cfe74730e"
  srv_notify_lpa_final_comment_submission_email_to_lpa_template_id                      = "b796c76d-2bfc-400e-a2d7-04d4c314f2e9"
  srv_notify_lpa_proof_evidence_submission_email_to_lpa_template_id                     = "85a1d02a-ad03-4d4c-a243-c2175fe6457f"
  srv_notify_appellant_final_comment_submission_email_to_appellant_template_id          = "be8ba2f3-b8ae-4d63-93ea-4b1f725cd3a2"
  srv_notify_appellant_proof_evidence_submission_email_to_appellant_template_id         = "05209e2b-27b1-47bf-9c42-df8051d057a2"
  srv_notify_rule_6_proof_evidence_submission_email_to_rule_6_party_template_id         = "65641498-3d71-4983-ad08-88399bea042d"
  srv_notify_rule_6_statement_submission_email_to_rule_6_party_template_id              = "a47b4837-eca3-446e-af25-56ae6cf591f1"
  srv_notify_save_and_return_continue_with_appeal_template_id                           = "7ca79c5d-8842-4b36-9e82-d8ff4b65dbaa"
  srv_notify_save_and_return_enter_code_into_service_template_id                        = "17fa62a6-81f6-49f7-87f0-b7a67d9ec5a0"
  srv_notify_service_id                                                                 = "57ab0834-106d-438c-b0b9-3c8f2c268738"
  srv_notify_confirm_email_template_id                                                  = "fef50c47-5ce4-4741-b89d-e31768b27bfd"
  srv_admin_monitoring_email                                                            = "appealsbetateam@planninginspectorate.gov.uk"
  srv_notify_failure_to_upload_to_horizon_template_id                                   = "68fbc646-c4b4-4050-be04-1829a0b109dc"
  srv_notify_final_comment_submission_confirmation_email_template_id                    = "be8ba2f3-b8ae-4d63-93ea-4b1f725cd3a2"
  srv_notify_lpa_has_questionnaire_submission_email_template_id                         = "d275326e-917b-404e-9702-fddd708bdb1f"
  sql_database_configuration = {
    max_size_gb                 = 250
    short_term_retention_days   = 7
    long_term_retention_weekly  = "P1W"
    long_term_retention_monthly = "P1M"
    long_term_retention_yearly  = "P1Y"
    long_term_week_of_year      = 1
    audit_retention_days        = 30
    sku_name                    = "S0"
  }
  sql_server_azuread_administrator = {
    login_username = "pins-odt-sql-training-appeals-fo"
    object_id      = "e9314a0a-a3b1-4806-b532-498af8271d7c"
  }
  task_submit_to_horizon_cron_string    = "*/15 * * * *"
  task_submit_to_horizon_trigger_active = "true"
}
