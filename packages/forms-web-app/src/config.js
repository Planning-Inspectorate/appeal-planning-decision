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
const ninetyMinsInMs = 90 * 60 * 1000;
const httpPort = numberWithDefault(process.env.PORT, 3000);

const feedbackUrl =
	process.env.FEEDBACK_URL ||
	'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOUlNRkhaQjNXTDQyNEhSRExNOFVGSkNJTS4u&route=shorturl';
const feedbackUrlComment =
	process.env.FEEDBACK_URL_COMMENT ||
	'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UQVU3UkdCT0FPVlYwQUsxUDYySDA1V1NXWC4u';
const feedbackUrlLPA =
	process.env.FEEDBACK_URL_LPA ||
	'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UNzVFTElMSEJIWlhXWkZFM1E1WDg3RTFPUy4u';

module.exports = {
	gitSha: process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
	application: {
		defaultDisplayDateFormat: 'DD MMMM YYYY'
	},
	appeals: {
		startingPoint: '/before-you-start',
		startingPointEnrolUsersActive: '/appeal/new-saved-appeal',
		timeout: numberWithDefault(process.env.APPEALS_SERVICE_API_TIMEOUT, 10000),
		url: process.env.APPEALS_SERVICE_API_URL
	},
	cacheControl: {
		maxAge: process.env.CACHE_CONTROL_MAX_AGE || '1d'
	},
	contact: {
		email: process.env.CONTACT_EMAIL || 'caseofficers@planninginspectorate.gov.uk',
		phone: process.env.CONTACT_PHONE || '0303 444 5000',
		form:
			process.env.CONTACT_FORM ||
			'https://contact-us.planninginspectorate.gov.uk/hc/en-gb/requests/new',
		hours: process.env.CONTACT_HOURS || 'Monday to Friday, 9am to midday (except public holidays)'
	},
	db: {
		session: {
			uri: process.env.SESSION_MONGODB_URL,
			databaseName: process.env.SESSION_MONGODB_DB_NAME,
			collection: process.env.SESSION_MONGODB_COLLECTION || 'sessions',
			expiresKey: '_ts',
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
	dynamicForms: {
		DEFAULT_SECTION: 'appeal'
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
	filterTime: {
		FIVE_YEARS_IN_MILISECONDS: 5 * 365 * 24 * 60 * 60 * 1000
	},
	isProduction: process.env.NODE_ENV === 'production',
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		redact: [
			'opts.body',
			'config.db.session.uri',
			'config.server.sessionSecret',
			'config.featureFlagging.endpoint',
			'config.oauth'
		],
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true'
	},
	server: {
		host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
		port: httpPort,
		sessionSecret: process.env.SESSION_KEY,
		sessionIdleTimeoutAppellant: numberWithDefault(
			process.env.SESSION_IDLE_TIMEOUT_APPELLANT,
			ninetyMinsInMs
		),
		sessionIdleTimeoutLPA: numberWithDefault(process.env.SESSION_IDLE_TIMEOUT_LPA, ninetyMinsInMs),
		sessionIdleTimeoutDelay: numberWithDefault(process.env.SESSION_IDLE_TIMEOUT_DELAY, 300000),
		// https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
		subdomainOffset: numberWithDefault(process.env.SUBDOMAIN_OFFSET, 3),
		useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
		googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
		googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
		allowTestingOverrides: process.env.ALLOW_TESTING_OVERRIDES === 'true'
	},
	featureFlag: {
		commentsEnabled: process.env.COMMENTS_ENABLED === 'true',
		googleTagManager: process.env.FEATURE_FLAG_GOOGLE_TAG_MANAGER === 'true',
		rule6Enabled: process.env.RULE_6_ENABLED === 'true',
		scopingOpinionEnabled: process.env.SCOPING_OPINION_ENABLED === 'true'
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
				countyMaxLength: process.env.COUNTY_MAX_LENGTH || 64,
				countyMinLength: process.env.COUNTY_MIN_LENGTH || 0,
				postcodeMaxLength: process.env.POSTCODE_MAX_LENGTH || 16,
				postcodeMinLength: process.env.POSTCODE_MIN_LENGTH || 0
			},
			appealFormV2: {
				textInputMaxLength: 1000,
				textAreaMediumLength: 8000,
				textAreaMaxLength: 32500
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
					regex: '^[0-9a-zA-Z]+$',
					regexMessage: 'Enter the appeal reference number using letters a to z and numbers 0 to 9'
				},
				maxLength: {
					maxLength: 7,
					maxLengthMessage: 'Appeal reference number must be 7 digits'
				},
				minLength: {
					minLength: 7,
					minLengthMessage: 'Appeal reference number must be 7 digits'
				}
			},
			appealSiteArea: {
				minValue: 1,
				maxValue: 1000000,
				minValueHectres: 0.1
			},
			numberOfWitnesses: {
				maxWitnesses: 99
			},
			lengthOfInquiry: {
				minDays: 1,
				maxDays: 999
			}
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	},
	oauth: {
		baseUrl: process.env.AUTH_BASE_URL,
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET
	},
	feedbackUrl: feedbackUrl,
	feedbackUrlComment: feedbackUrlComment,
	feedbackUrlLPA: feedbackUrlLPA,
	betaBannerText: 'This is a beta service',
	betaBannerFeedbackLink: ` – your <a class="govuk-link" data-cy="Feedback" href="${feedbackUrl}">feedback</a> will help us to improve it.`
};
