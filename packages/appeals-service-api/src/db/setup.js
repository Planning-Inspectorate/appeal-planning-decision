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

// 		await saveAndReturnCollection.createIndex({ 'appeal.id': 1 }, { unique: true }); // todo: replace calls with _id and this index won't be needed?

// 		await saveAndReturnCollection.createIndex({ 'appeal.horizonId': 1 }, { unique: true });
// 		await saveAndReturnCollection.createIndex({ 'appeal.email': 1 }, { unique: false });
// 		await saveAndReturnCollection.createIndex({ 'appeal.planningApplicationNumber': 1 }, { unique: false });
// 		await saveAndReturnCollection.createIndex({ 'appeal.planningApplicationNumber': 1 }, { unique: false });
// 		await saveAndReturnCollection.createIndex({ 'appeal.typeOfPlanningApplication': 1 }, { unique: false });
// 		await saveAndReturnCollection.createIndex({ 'appeal.state': 1 }, { unique: false });
// 		await saveAndReturnCollection.createIndex({ 'appeal.appealSiteSection.siteAddress.postcode': 1 }, { unique: false });
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

async function setupAppealCaseDataIndexes() {
	try {
		const caseDataCollection = mongodb.get().collection('appealsCaseData');

		await caseDataCollection.createIndex({ caseReference: 1 }, { unique: false });
		await caseDataCollection.createIndex({ LPAApplicationReference: 1 }, { unique: false });
		await caseDataCollection.createIndex({ LPACode: 1 }, { unique: false });
		await caseDataCollection.createIndex({ appealType: 1 }, { unique: false });
		await caseDataCollection.createIndex({ validity: 1 }, { unique: false });
		await caseDataCollection.createIndex({ questionnaireDueDate: 1 }, { unique: false });
		await caseDataCollection.createIndex({ questionnaireReceived: 1 }, { unique: false });
	} catch (err) {
		logger.error(err, `Error: error setting up appealsCaseData indexes in mongo`);
		throw err;
	}
}

async function setupDocumentMetadataIndexes() {
	try {
		const documentCollection = mongodb.get().collection('documentMetadata');

		await documentCollection.createIndex({ caseRef: 1 }, { unique: false });
		await documentCollection.createIndex({ version: 1 }, { unique: false });
		await documentCollection.createIndex({ documentId: 1 }, { unique: false });
		await documentCollection.createIndex({ documentType: 1 }, { unique: false });
		await documentCollection.createIndex({ virusCheckStatus: 1 }, { unique: false });
		await documentCollection.createIndex({ redactedStatus: 1 }, { unique: false });
		await documentCollection.createIndex({ publishedStatus: 1 }, { unique: false });
	} catch (err) {
		logger.error(err, `Error: error setting up documentMetadata indexes in mongo`);
		throw err;
	}
}

async function setupIndexes() {
	try {
		await setupLpaIndexes();
		await setupUserIndexes();
		await setupAppealCaseDataIndexes();
		await setupDocumentMetadataIndexes();
	} catch (err) {
		logger.error(err, `Error: error setting up indexes in mongo`);
	}
}

module.exports = {
	setupIndexes
};
