const { MongoClient, Logger } = require('mongodb');
const config = require('../configuration/config');
const logger = require('../lib/logger.js');

let mongodb;

function connect(callback) {
	logger.info('Connecting to MongoDB...');
	MongoClient.connect(config.db.mongodb.url, { useUnifiedTopology: true })
		.then(async (client) => {
			mongodb = client;
			await callback();
			logger.info('MongoDB connected');
		})
		.catch((err) => {
			logger.error('Error connecting to MongoDB', err);
		});
}

function get() {
	if (config.logger.level === 'debug') {
		Logger.setLevel('debug');
	}

	return mongodb && mongodb.db(config.db.mongodb.dbName);
}

function close() {
	return mongodb && mongodb.close();
}

// https://github.com/mongodb/mongo/blob/master/src/mongo/base/error_codes.yml
const errorCodes = {
	DUPLICATE_KEY: 11000
};

module.exports = {
	connect,
	get,
	close,
	errorCodes
};
