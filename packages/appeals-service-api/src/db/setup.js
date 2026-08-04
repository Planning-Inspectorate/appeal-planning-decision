const logger = require('../lib/logger');
const mongodb = require('./db');

async function setupLpaIndexes() {
	try {
		const lpaCollection = mongodb.get().collection('lpa');

		await lpaCollection.createIndex({ lpaCode: 1 }, { unique: false });
		await lpaCollection.createIndex({ lpa19CD: 1 }, { unique: false }); // replace all of these calls with lpaCode which is unique?
	} catch (err) {
		logger.error(err, `Error: error setting up lpa indexes in mongo`);
		throw err;
	}
}

async function setupIndexes() {
	try {
		await setupLpaIndexes();
	} catch (err) {
		logger.error(err, `Error: error setting up indexes in mongo`);
	}
}

module.exports = {
	setupIndexes
};
