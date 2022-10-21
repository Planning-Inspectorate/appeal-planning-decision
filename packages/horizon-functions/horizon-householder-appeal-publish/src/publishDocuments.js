const addDocument = require('./logic/addDocument');

/**
 * Publish Documents
 *
 * Publishes the documents to Horizon. This is done asynchronously
 * as we're not interested in the response
 *
 * @param log
 * @param {{id: string, type: string}[]} documents
 * @param {string} serviceId
 * @param {string} horizonId
 */
const publishDocuments = async (log, documents, horizonCaseId) => {
	log(JSON.stringify(documents), 'Documents in publishDocuments');
	await Promise.all(
		documents
			/* Remove any undefined keys */
			.filter(({ id }) => id)
			.map(async (document) => {
				log(document, 'Publish document to Horizon');

				await addDocument(log, document, horizonCaseId);

				log('Publish document request accepted');
			})
	);
};

module.exports = { publishDocuments };
