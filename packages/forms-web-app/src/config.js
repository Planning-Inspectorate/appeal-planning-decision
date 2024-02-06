/**
 *
 * @param {*} value
 * @param {number} fallback
 * @returns {number}
 */
function numberWithDefault(value, fallback) {
	const num = parseInt(value);
	if (isNaN(num)) {
		return fallback;
	}
	return num;
}

const oneGigabyte = 1024 * 1024 * 1024;
const httpPort = numberWithDefault(process.env.PORT, 3000);

module.exports = {
	application: {
		defaultDisplayDateFormat: 'DD MMMM YYYY'
	},
	appeals: {
		startingPoint: '/before-you-start',
		startingPointEnrolUsersActive: '/appeal/new-saved-appeal',
		timeout: numberWithDefault(process.env.APPEALS_SERVICE_API_TIMEOUT, 10000),
		url: process.env.APPEALS_SERVICE_API_URL
	},
	db: {
		session: {
			uri: process.env.SESSION_MONGODB_URL,
			databaseName: process.env.SESSION_MONGODB_DB_NAME,
			collection: process.env.SESSION_MONGODB_COLLECTION || 'sessions',
			expiresColumn: '_ts',
			expires: 1000 * 60 * 60 * 24 * 14, // value in milliseconds
			expiresAfterSeconds: 60 * 60 * 24 * 14, // value in seconds
			connectionOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		}
	},
	documents: {
		timeout: numberWithDefault(process.env.DOCUMENTS_SERVICE_API_TIMEOUT, 10000),
		url: process.env.DOCUMENTS_SERVICE_API_URL
	},
	pdf: {
		url: process.env.PDF_SERVICE_API_URL
	},
	fileUpload: {
		debug: process.env.FILE_UPLOAD_DEBUG === 'true',
		pins: {
			maxFileUploadSize: numberWithDefault(
				process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES,
				oneGigabyte
			),
			allowedFileTypes: {
				MIME_TYPE_DOC: 'application/msword',
				MIME_BINARY_TYPE_DOC: 'application/x-cfb',
				MIME_TYPE_DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				MIME_TYPE_PDF: 'application/pdf',
				MIME_TYPE_TIF: 'image/tiff',
				MIME_TYPE_JPEG: 'image/jpeg',
				MIME_TYPE_PNG: 'image/png'
			}
		},
		tempFileDir: process.env.FILE_UPLOAD_TMP_PATH,
		useTempFiles: process.env.FILE_UPLOAD_USE_TEMP_FILES === 'true',
		clamAVHost: process.env.CLAMAV_HOST,
		clamAVPort: numberWithDefault(process.env.CLAMAV_PORT, 3310)
	},
	isProduction: process.env.NODE_ENV === 'production',
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		redact: [
			'opts.body',
			'config.db.session.uri',
			'config.server.sessionSecret',
			'config.featureFlagging.endpoint'
		]
	},
	server: {
		host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
		port: httpPort,
		sessionSecret: process.env.SESSION_KEY,
		// https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
		subdomainOffset: numberWithDefault(process.env.SUBDOMAIN_OFFSET, 3),
		useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
		googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
		googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
		allowTestingOverrides: process.env.ALLOW_TESTING_OVERRIDES === 'true'
	},
	featureFlag: {
		googleTagManager: process.env.FEATURE_FLAG_GOOGLE_TAG_MANAGER === 'true'
	},
	validation: {
		characterLimits: {
			finalComment: process.env.CHARACTER_LIMIT_FINAL_COMMENT || 32500,
			emailCode: process.env.CHARACTER_LIMIT_EMAIL_SECURITY_CODE || 5,
			questionnaire: {
				addressLine1MaxLength: process.env.ADDRESS_LINE_1_MAX_LENGTH || 255,
				addressLine1MinLength: process.env.ADDRESS_LINE_1_MIN_LENGTH || 1,
				addressLine2MaxLength: process.env.ADDRESS_LINE_2_MAX_LENGTH || 96,
				addressLine2MinLength: process.env.ADDRESS_LINE_2_MIN_LENGTH || 0,
				townCityMaxLength: process.env.TOWNCITY_MAX_LENGTH || 64,
				townCityMinLength: process.env.TOWNCITY_MIN_LENGTH || 1,
				postcodeMaxLength: process.env.POSTCODE_MAX_LENGTH || 16,
				postcodeMinLength: process.env.POSTCODE_MIN_LENGTH || 0
			}
		},
		stringValidation: {
			listedBuildingNumber: {
				regex: {
					regex: '^\\d+$',
					regexMessage: 'Enter a list entry number using numbers 0 to 9'
				},
				maxLength: {
					maxLength: 7,
					maxLengthMessage: 'List entry number must be 7 digits'
				},
				minLength: {
					minLength: 7,
					minLengthMessage: 'List entry number must be 7 digits'
				}
			},
			appealReferenceNumber: {
				regex: {
					regex: '^\\d+$',
					regexMessage: 'Enter an appeal reference number using numbers 0 to 9'
				},
				maxLength: {
					maxLength: 7,
					maxLengthMessage: 'Appeal reference number must be 7 digits'
				},
				minLength: {
					minLength: 7,
					minLengthMessage: 'Appeal reference number must be 7 digits'
				}
			}
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	}
};
