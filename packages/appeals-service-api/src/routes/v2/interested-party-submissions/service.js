const { InterestedPartySubmissionRepository } = require('./repo');
const repo = new InterestedPartySubmissionRepository();
const logger = require('#lib/logger');

/**
 * @typedef {import('@pins/database/src/client/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import('@pins/database/src/client/client').Prisma.InterestedPartySubmissionCreateInput} IPSubmissionData
 */

/**
 * @typedef {Object} DocumentUploadData
 * @property {string} id
 * @property {string} name
 * @property {string} fileName
 * @property {string} originalFileName
 * @property {string} location
 * @property {string} type
 */

/**
 * @typedef {Object} InterestedParty
 * @property {string} caseReference
 * @property {string} [searchPostcode]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [emailAddress]
 * @property {string} [addressLine1]
 * @property {string} [addressLine2]
 * @property {string} [townCity]
 * @property {string} [county]
 * @property {string} [postcode]
 * @property {string} [comments]
 * @property {string} [hasDocumentsToSupportComment]
 * @property {DocumentUploadData[]} [uploadedFiles]
 * @property {boolean} [submitted]
 */

/**
 * Create a new interested party
 *
 * @param {InterestedParty} interestedParty
 * @returns {Promise<InterestedPartySubmission>}
 */
async function createInterestedPartySubmission(interestedParty) {
	const mappedDocUploadData = interestedParty.uploadedFiles?.map((file) => ({
		name: file.name,
		fileName: file.fileName,
		originalFileName: file.originalFileName,
		location: file.location,
		type: 'uploadInterestedPartyDocuments',
		storageId: file.id
	}));
	const hasDocumentsAttached = mappedDocUploadData?.length > 0;

	/** @type {IPSubmissionData} */
	const ipSubmissionData = {
		...interestedParty,
		hasDocumentsToSupportComment: hasDocumentsAttached ?? null,
		uploadInterestedPartyDocuments: hasDocumentsAttached ?? null,
		SubmissionDocumentUpload: hasDocumentsAttached
			? {
					createMany: {
						data: mappedDocUploadData
					}
				}
			: undefined
	};
	delete ipSubmissionData.uploadedFiles;

	try {
		return await repo.createInterestedPartySubmission(ipSubmissionData);
	} catch (error) {
		logger.error({ error }, 'Error creating Interested Party Submission');
		throw error;
	}
}

module.exports = { createInterestedPartySubmission };
