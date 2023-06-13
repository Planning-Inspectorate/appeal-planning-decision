const mongoClient = require('mongodb').MongoClient;
const config = require('../configuration/config');
const logger = require('../lib/logger');

let mongodb;

function connect(callback) {
	logger.info('Connecting to MongoDB...');
	mongoClient
		.connect(config.db.mongodb.url, { useUnifiedTopology: true })
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
	return mongodb && mongodb.db(config.db.mongodb.dbName);
}

function close() {
	return mongodb && mongodb.close();
}

module.exports = {
	connect,
	get,
	close
};
