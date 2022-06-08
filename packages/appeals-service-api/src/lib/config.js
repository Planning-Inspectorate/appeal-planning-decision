/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required.
 */

const {
  constants: { APPEAL_ID },
} = require('@pins/business-rules');
const path = require('path');

const config = {
  data: {
    lpa: {
      listPath: process.env.LPA_DATA_PATH,
      trialistPath: process.env.LPA_TRIALIST_DATA_PATH,
    },
  },
  db: {
    mongodb: {
      url: process.env.MONGODB_URL,
      dbName: process.env.MONGODB_DB_NAME,
      opts: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  docs: {
    api: {
      path: process.env.DOCS_API_PATH || path.join(__dirname, '..', '..', 'api'),
    },
  },
  documents: {
    timeout: parseInt(process.env.DOCUMENTS_SERVICE_API_TIMEOUT, 10) || 10000,
    url: process.env.DOCUMENTS_SERVICE_API_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: [
      'config.db.mongodb',
      'config.messageQueue.horizonHASPublisher.connection.password',
      'config.services.notify.apiKey',
    ],
  },
  messageQueue: {
    horizonHASPublisher: {
      connection: {
        host: process.env.HORIZON_HAS_PUBLISHER_HOST,
        hostname: process.env.HORIZON_HAS_PUBLISHER_HOSTNAME,
        reconnect_limit: Number(process.env.HORIZON_HAS_PUBLISHER_RECONNECT_LIMIT || 1),
        password: process.env.HORIZON_HAS_PUBLISHER_PASSWORD,
        port: Number(process.env.HORIZON_HAS_PUBLISHER_PORT || 5672),
        reconnect: process.env.HORIZON_HAS_PUBLISHER_ATTEMPT_RECONNECTION !== 'false',
        transport: process.env.HORIZON_HAS_PUBLISHER_TRANSPORT,
        username: process.env.HORIZON_HAS_PUBLISHER_USERNAME,
      },
      queue: process.env.HORIZON_HAS_PUBLISHER_QUEUE,
    },
    sqlHASAppealsPublisher: {
      connection: {
        host: process.env.SQL_HASAPPEALS_PUBLISHER_HOST,
        hostname: process.env.SQL_HASAPPEALS_PUBLISHER_HOSTNAME,
        reconnect_limit: Number(process.env.SQL_HASAPPEALS_PUBLISHER_RECONNECT_LIMIT || 1),
        password: process.env.SQL_HASAPPEALS_PUBLISHER_PASSWORD,
        port: Number(process.env.SQL_HASAPPEALS_PUBLISHER_PORT || 5672),
        reconnect: process.env.SQL_HASAPPEALS_PUBLISHER_ATTEMPT_RECONNECTION !== 'false',
        transport: process.env.SQL_HASAPPEALS_PUBLISHER_TRANSPORT,
        username: process.env.SQL_HASAPPEALS_PUBLISHER_USERNAME,
      },
      queue: process.env.SQL_HASAPPEALS_PUBLISHER_QUEUE,
    },
  },
  server: {
    port: Number(process.env.SERVER_PORT || 3000),
    showErrors: process.env.SERVER_SHOW_ERRORS === 'true',
    terminationGracePeriod: Number(
      (process.env.SERVER_TERMINATION_GRACE_PERIOD_SECONDS || 0) * 1000
    ),
  },
  services: {
    horizon: {
      url: process.env.SRV_HORIZON_URL,
    },
    notify: {
      baseUrl: process.env.SRV_NOTIFY_BASE_URL,
      serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
      apiKey: process.env.SRV_NOTIFY_API_KEY,
      // deprecated, see `sendEmail` inside `./notify`
      templateId: process.env.SRV_NOTIFY_TEMPLATE_ID,
      templates: {
        [APPEAL_ID.HOUSEHOLDER]: {
          appealSubmissionConfirmationEmailToAppellant:
            process.env.SRV_NOTIFY_APPEAL_SUBMISSION_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
          appealNotificationEmailToLpa:
            process.env.SRV_NOTIFY_APPEAL_SUBMISSION_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
          startEmailToLpa: process.env.SRV_NOTIFY_START_EMAIL_TO_LPA_TEMPLATE_ID,
        },
        [APPEAL_ID.PLANNING_SECTION_78]: {
          appealSubmissionConfirmationEmailToAppellant:
            process.env.SRV_NOTIFY_FULL_APPEAL_CONFIRMATION_EMAIL_TO_APPELLANT_TEMPLATE_ID,
          appealNotificationEmailToLpa:
            process.env.SRV_NOTIFY_FULL_APPEAL_RECEIVED_NOTIFICATION_EMAIL_TO_LPA_TEMPLATE_ID,
        },
      },
      emailReplyToId: {
        startEmailToLpa: process.env.SRV_NOTIFY_EMAIL_REPLYTO_ID_START_EMAIL_TO_LPA,
      },
    },
    osPlaces: {
      key: process.env.SRV_OS_PLACES_KEY,
      url: process.env.SRV_OS_PLACES_URL,
    },
  },
  apps: {
    appeals: {
      baseUrl: process.env.APP_APPEALS_BASE_URL,
    },
    lpaQuestionnaire: {
      baseUrl: process.env.APP_LPA_QUESTIONNAIRE_BASE_URL,
    },
  },
};

module.exports = config;
