/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required.
 */

const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');

// NOTE: it is not a mistake that this variable is decalred via `let` since we need to update the state
//       in tests, so declaring as `const`, makes this very tricky.
// TODO: find some way to enable profile-specific configs to remove the `let` here.
let config = {
	gitSha: process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
	auth: {
		authServerUrl: process.env.AUTH_BASE_URL
	},
	enableApiDocs: process.env.NODE_ENV !== 'test',
	data: {
		lpa: {
			listPath: process.env.LPA_DATA_PATH,
			trialistPath: process.env.LPA_TRIALIST_DATA_PATH
		}
	},
	db: {
		mongodb: {
			url: process.env.MONGODB_URL,
			dbName: process.env.MONGODB_DB_NAME,
			opts: {
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		},
		sql: {
			// don't use the admin connection string for general use
			connectionString: process.env.SQL_CONNECTION_STRING
		}
	},
	documents: {
		timeout: parseInt(process.env.DOCUMENTS_SERVICE_API_TIMEOUT, 10) || 10000,
		url: process.env.DOCUMENTS_SERVICE_API_URL
	},
	logger: {
		level: process.env.LOGGER_LEVEL || 'error',
		redact: ['config.db', 'config.services.notify.apiKey', 'config.storage.connectionString'],
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true'
	},
	migration: {
		defaultBatchSize: parseInt(process.env.MIGRATION_BATCHSIZE, 10) || 100,
		defaultDelayBetweenBatchesMS: parseInt(process.env.MIGRATION_BATCHDELAY, 10) || 500
	},
	server: {
		port: Number(process.env.SERVER_PORT || 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true',
		terminationGracePeriod: Number(
			(process.env.SERVER_TERMINATION_GRACE_PERIOD_SECONDS || 0) * 1000
		)
	},
	services: {
		horizon: {
			timeout: parseInt(process.env.SRV_HORIZON_TIMEOUT, 10) || 10 * 60 * 1000, // 10 mins in ms
			url: process.env.SRV_HORIZON_URL,
			logRequestTime: process.env.SRV_HORIZON_LOG_REQUEST_TIME === 'true'
		},
		notify: {
			baseUrl: process.env.SRV_NOTIFY_BASE_URL,
			serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
			apiKey: process.env.SRV_NOTIFY_API_KEY,
			templates: {
				APPEAL_SUBMISSION: {
					V1_HORIZON: {
						appellantAppealSubmissionInitialConfirmation:
							process.env
								.SRV_NOTIFY_V1_APPEAL_SUBMISSION_INITIAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
						appellantAppealSubmissionFollowUpConfirmation:
							process.env
								.SRV_NOTIFY_V1_APPEAL_SUBMISSION_FOLLOW_UP_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID
					},
					V2_BACK_OFFICE: {
						appellantAppealSubmissionInitialConfirmation:
							process.env
								.SRV_NOTIFY_V2_APPEAL_SUBMISSION_INITIAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
						appellantAppealSubmissionFollowUpConfirmation:
							process.env
								.SRV_NOTIFY_V2_APPEAL_SUBMISSION_FOLLOW_UP_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID
					}
				},
				[APPEAL_ID.HOUSEHOLDER]: {
					appealSubmissionConfirmationEmailToAppellant:
						process.env
							.SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID_V1_1,
					appealSubmissionConfirmationEmailToAppellantV2:
						process.env
							.SRV_NOTIFY_HAS_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealSubmissionReceivedEmailToAppellant:
						process.env.SRV_NOTIFY_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealNotificationEmailToLpa:
						process.env.SRV_NOTIFY_APPEAL_SUBMISSION_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
					appealNotificationEmailToLpaV2:
						process.env.SRV_NOTIFY_APPEAL_SUBMISSION_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
					startEmailToLpa: process.env.SRV_NOTIFY_START_EMAIL_TO_LPA_TEMPLATE_ID
				},
				[APPEAL_ID.PLANNING_SECTION_78]: {
					appealSubmissionConfirmationEmailToAppellant:
						process.env
							.SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID_V1_1,
					appealSubmissionConfirmationEmailToAppellantV2:
						process.env
							.SRV_NOTIFY_FULL_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealSubmissionReceivedEmailToAppellant:
						process.env.SRV_NOTIFY_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealNotificationEmailToLpaV2:
						process.env.SRV_NOTIFY_APPEAL_SUBMISSION_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
					appealNotificationEmailToLpa:
						process.env.SRV_NOTIFY_FULL_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
					lpaStatementSubmissionConfirmationEmailToLpaV2:
						process.env.SRV_NOTIFY_LPA_STATEMENT_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID,
					lpaFinalCommentsSubmissionConfirmationEmailToLpaV2:
						process.env.SRV_NOTIFY_LPA_FINAL_COMMENT_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID,
					lpaProofEvidenceSubmissionConfirmationEmailToLpaV2:
						process.env.SRV_NOTIFY_LPA_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_LPA_TEMPLATE_ID,
					appellantFinalCommentsSubmissionConfirmationEmailToAppellantV2:
						process.env
							.SRV_NOTIFY_APPELLANT_FINAL_COMMENT_SUBMISSION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appellantProofEvidenceSubmissionConfirmationEmailToAppellantV2:
						process.env
							.SRV_NOTIFY_APPELLANT_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					rule6ProofEvidenceSubmissionConfirmationEmailToRule6PartyV2:
						process.env
							.SRV_NOTIFY_RULE_6_PROOF_EVIDENCE_SUBMISSION_EMAIL_TO_RULE_6_PARTY_TEMPLATE_ID,
					rule6StatementSubmissionConfirmationEmailToRule6PartyV2:
						process.env.SRV_NOTIFY_RULE_6_STATEMENT_SUBMISSION_EMAIL_TO_RULE_6_PARTY_TEMPLATE_ID
				},
				V2_COMMON: {
					appealSubmissionReceivedEmailToAppellant:
						process.env
							.SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID_V1_1
				},
				SAVE_AND_RETURN: {
					continueWithAppealEmailToAppellant:
						process.env.SRV_NOTIFY_SAVE_AND_RETURN_CONTINUE_WITH_APPEAL_TEMPLATE_ID
				},
				ERROR_MONITORING: {
					failureToUploadToHorizon: process.env.SRV_NOTIFY_FAILURE_TO_UPLOAD_TO_HORIZON_TEMPLATE_ID
				},
				FINAL_COMMENT: {
					finalCommentSubmissionConfirmationEmail:
						process.env.SRV_NOTIFY_FINAL_COMMENT_SUBMISSION_CONFIRMATION_EMAIL_TEMPLATE_ID
				},
				LPA_DASHBOARD: {
					enterCodeIntoServiceEmailToLPA:
						process.env.SRV_NOTIFY_LPA_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID,
					lpaDashboardInviteEmail: process.env.SRV_NOTIFY_LPA_DASHBOARD_INVITE_TEMPLATE_ID,
					lpaHASQuestionnaireSubmissionConfirmationEmail:
						process.env.SRV_NOTIFY_LPA_HAS_QUESTIONNAIRE_SUBMISSION_EMAIL_TEMPLATE_ID
				},
				INTERESTED_PARTIES: {
					ipCommentSubmissionConfirmationEmail:
						process.env.SRV_NOTIFY_IP_COMMENT_SUBMISSION_CONFIRMATION_EMAIL_TO_IP_TEMPLATE_ID
				},
				generic: process.env.SRV_NOTIFY_FRONT_OFFICE_GENERIC_TEMPLATE_ID
			},
			emails: {
				adminMonitoringEmail: process.env.SRV_ADMIN_MONITORING_EMAIL
			},
			templateVariables: {
				contactEmail: process.env.CONTACT_EMAIL || 'caseofficers@planninginspectorate.gov.uk',
				contactForm:
					process.env.CONTACT_FORM ||
					'https://contact-us.planninginspectorate.gov.uk/hc/en-gb/requests/new',
				feedbackUrl:
					process.env.FEEDBACK_URL ||
					'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOUlNRkhaQjNXTDQyNEhSRExNOFVGSkNJTS4u&route=shorturl'
			}
		},
		osPlaces: {
			key: process.env.SRV_OS_PLACES_KEY,
			url: process.env.SRV_OS_PLACES_URL
		}
	},
	apps: {
		appeals: {
			baseUrl: process.env.APP_APPEALS_BASE_URL
		}
	},
	tasks: {
		appealsApi: {
			submitToHorizonCronString: process.env.TASK_SUBMIT_TO_HORIZON_CRON_STRING,
			runSubmitToHorizonTrigger: process.env.TASK_SUBMIT_TO_HORIZON_TRIGGER_ACTIVE
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	},
	serviceBus: {
		serviceBusEnabled: process.env.SERVICE_BUS_ENABLED || false,
		hostname: process.env.SERVICE_BUS_HOSTNAME,
		topics: {
			appellantSubmission:
				process.env.BACK_OFFICE_APPELLANT_SUBMISSION_TOPIC || 'appeal-fo-appellant-submission',
			lpaSubmission:
				process.env.BACK_OFFICE_LPA_RESPONSE_SUBMISSION_TOPIC ||
				'appeal-fo-lpa-response-submission',
			representationSubmission:
				process.env.BACK_OFFICE_REPRESENTATION_SUBMISSION_TOPIC ||
				'appeal-fo-representation-submission'
		}
	},
	storage: {
		container: process.env.STORAGE_CONTAINER_NAME || 'uploads',
		connectionString:
			process.env.BLOB_STORAGE_CONNECTION_STRING ||
			'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://blob-storage:10000/devstoreaccount1;QueueEndpoint=http://blob-storage:10001/devstoreaccount1'
	}
};

module.exports = config;
