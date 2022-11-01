/**
 * Mongoose Bootstrap
 *
 * Bootstrapping method for mongoose. This should be called
 * by any stack
 */

const mongoose = require('mongoose');

const logger = require('./logger');
const config = require('../configuration/config');

module.exports = async () => {
	try {
		/* Mongoose is a singleton internally, so connect before accepting connections */
		logger.info('Attempting to create Mongoose connection');
		await mongoose.connect(config.db.mongodb.url, config.db.mongodb.opts);
		logger.info('Connected to Mongoose');
	} catch (err) {
		logger.fatal({ err }, 'Unable to connect to Mongoose');

		/* Connection may be open */
		if (mongoose.connection.readyState === 1) {
			logger.debug('Killing Mongo connection before terminating');
			await mongoose.connection.close();
		}

		/* Preserve the error */
		throw err;
	}
};
