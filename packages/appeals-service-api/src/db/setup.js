const logger = require('../lib/logger');
const mongodb = require('./db');

// other potential indexes
// async function setupSaveAndReturnIndexes() {
// 	try {
// 		const saveAndReturnCollection = mongodb.get().collection('saveAndReturn');

// 		await saveAndReturnCollection.createIndex({ appealId: 1 }, { unique: false });
// 	} catch (err) {
// 		logger.error(err, `Error: error setting up saveAndReturn indexes in mongo`);
// 		throw err;
// 	}
// }

// async function setupAppealIndexes() {
// 	try {
// 		const saveAndReturnCollection = mongodb.get().collection('appeal');

// 		await saveAndReturnCollection.createIndex({ 'appeal.horizonId': 1 }, { unique: true });
// 		await saveAndReturnCollection.createIndex({ 'appeal.id': 1 }, { unique: true }); // todo: replace calls with _id and this index won't be needed?
// 	} catch (err) {
// 		logger.error(err, `Error: error setting up appeal indexes in mongo`);
// 		throw err;
// 	}
// }

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

async function setupUserIndexes() {
	try {
		const usersCollection = mongodb.get().collection('user');

		await usersCollection.createIndex({ email: 1 }, { unique: true });
		await usersCollection.createIndex({ lpaCode: 1 }, { unique: false });
		await usersCollection.createIndex({ status: 1 }, { unique: false });
	} catch (err) {
		logger.error(err, `Error: error setting up user indexes in mongo`);
		throw err;
	}
}

async function setupIndexes() {
	try {
		await setupLpaIndexes();
		await setupUserIndexes();
	} catch (err) {
		logger.error(err, `Error: error setting up indexes in mongo`);
	}
}

module.exports = {
	setupIndexes
};
