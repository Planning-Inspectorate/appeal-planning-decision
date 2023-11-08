/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

const path = require('path');

module.exports = {
	db: {
		mongodb: {
			url: process.env.MONGODB_URL || 'mongodb://localhost:27017/document-service-api',
			opts: {
				autoIndex: process.env.MONGODB_AUTO_INDEX !== 'false',
				dbName: process.env.MONGODB_DB_NAME,
				useFindAndModify: false,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true
			}
		}
	},
	docs: {
		api: {
			path: process.env.DOCS_API_PATH || path.join(__dirname, '..', 'api')
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_ENDPOINT,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	},
	fileUpload: {
		maxSizeInBytes: Number(process.env.FILE_MAX_SIZE_IN_BYTES || 1000),
		mimeTypes: [
			'application/pdf', // pdf
			'application/msword', // doc
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
			'image/tiff', // tiff
			'image/jpeg', // jpeg
			'image/png' // png
		],
		path: process.env.FILE_UPLOAD_PATH || '/tmp/upload'
	},
	logger: {
		level: process.env.LOGGER_LEVEL || /* istanbul ignore next */ 'info',
		redact: ['config.db.mongodb', 'config.storage.connectionString']
	},
	server: {
		port: Number(process.env.SERVER_PORT || 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true'
	},
	storage: {
		container: process.env.STORAGE_CONTAINER_NAME || 'uploads',
		connectionString:
			process.env.BLOB_STORAGE_CONNECTION_STRING ||
			'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://blob-storage:10000/devstoreaccount1;QueueEndpoint=http://blob-storage:10001/devstoreaccount1',
		processMaxAttempts: Number(process.env.STORAGE_UPLOAD_MAX_ATTEMPTS || 3),
		processQueryLimit: Number(process.env.STORAGE_UPLOAD_QUERY_LIMIT || 5)
	}
};
