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
		level: process.env.LOGGER_LEVEL || 'info',
		redact: [
			'config.db',
			'config.services.notify.apiKey',
			'config.secureCodes.finalComments.decipher.securityKey',
			'config.storage.connectionString'
		],
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true'
	},
	secureCodes: {
		finalComments: {
			length: process.env.FINAL_COMMENTS_PIN_LENGTH,
			expirationTimeInMinutes: process.env.FINAL_COMMENTS_PIN_EXPIRATION_TIME_IN_MINUTES,
			decipher: {
				algorithm: process.env.FINAL_COMMENTS_SECURE_CODE_DECIPHER_ALGORITHM,
				initVector: process.env.FINAL_COMMENTS_SECURE_CODE_DECIPHER_INIT_VECTOR,
				securityKey: process.env.FINAL_COMMENTS_SECURE_CODE_DECIPHER_SECURITY_KEY,
				inputEncoding: process.env.FINAL_COMMENTS_SECURE_CODE_DECIPHER_INPUT_ENCODING,
				outputEncoding: process.env.FINAL_COMMENTS_SECURE_CODE_DECIPHER_OUTPUT_ENCODING
			}
		}
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
			url: process.env.SRV_HORIZON_URL
		},
		notify: {
			baseUrl: process.env.SRV_NOTIFY_BASE_URL,
			serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
			apiKey: process.env.SRV_NOTIFY_API_KEY,
			templates: {
				[APPEAL_ID.HOUSEHOLDER]: {
					appealSubmissionConfirmationEmailToAppellant:
						process.env.SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealNotificationEmailToLpa:
						process.env.SRV_NOTIFY_APPEAL_SUBMISSION_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
					startEmailToLpa: process.env.SRV_NOTIFY_START_EMAIL_TO_LPA_TEMPLATE_ID
				},
				[APPEAL_ID.PLANNING_SECTION_78]: {
					appealSubmissionConfirmationEmailToAppellant:
						process.env.SRV_NOTIFY_FULL_APPEAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
					appealNotificationEmailToLpa:
						process.env.SRV_NOTIFY_FULL_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID
				},
				SAVE_AND_RETURN: {
					continueWithAppealEmailToAppellant:
						process.env.SRV_NOTIFY_SAVE_AND_RETURN_CONTINUE_WITH_APPEAL_TEMPLATE_ID,
					enterCodeIntoServiceEmailToAppellant:
						process.env.SRV_NOTIFY_SAVE_AND_RETURN_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID
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
					lpaDashboardInviteEmail: process.env.SRV_NOTIFY_LPA_DASHBOARD_INVITE_TEMPLATE_ID
				}
			},
			emailReplyToId: {
				startEmailToLpa: process.env.SRV_NOTIFY_EMAIL_REPLYTO_ID_START_EMAIL_TO_LPA
			},
			emails: {
				adminMonitoringEmail: process.env.SRV_ADMIN_MONITORING_EMAIL
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
		},
		lpaQuestionnaire: {
			baseUrl: process.env.APP_LPA_QUESTIONNAIRE_BASE_URL
		},
		finalComments: {
			testID: 'test123'
		}
	},
	tasks: {
		appealsApi: {
			submitToHorizonCronString: process.env.TASK_SUBMIT_TO_HORIZON_CRON_STRING,
			runSubmitToHorizonTrigger: process.env.TASK_SUBMIT_TO_HORIZON_TRIGGER_ACTIVE
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_ENDPOINT,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	},
	serviceBus: {
		serviceBusEnabled: process.env.SERVICE_BUS_ENABLED || false,
		hostname: process.env.SERVICE_BUS_HOSTNAME
	},
	storage: {
		container: process.env.STORAGE_CONTAINER_NAME || 'uploads',
		connectionString:
			process.env.BLOB_STORAGE_CONNECTION_STRING ||
			'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://blob-storage:10000/devstoreaccount1;QueueEndpoint=http://blob-storage:10001/devstoreaccount1'
	}
};

module.exports = config;
