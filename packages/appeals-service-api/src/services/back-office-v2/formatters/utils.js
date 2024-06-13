const { initContainerClient } = require('@pins/common');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

/**
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('./has/has').Submission} HASBOSubmission
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents']} DataModelDocuments
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['users']} DataModelUsers
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['casedata']['applicationDecision']} DataModelApplicationDecision
 */

const getBlobMeta = blobMetaGetter(initContainerClient);

/**
 * @param {string | null} str
 * @returns {boolean}
 */
exports.toBool = (str) => str === 'yes';

/**
 * @param {{ SubmissionDocumentUpload: import('@prisma/client').SubmissionDocumentUpload[] }} answers
 * @returns {Promise<DataModelDocuments>}
 */
exports.getDocuments = async ({ SubmissionDocumentUpload }) => {
	const uploadedFilesAndBlobMeta = await conjoinedPromises(
		SubmissionDocumentUpload,
		(uploadedFile) => getBlobMeta(uploadedFile.location)
	);

	return Array.from(uploadedFilesAndBlobMeta).map(
		([{ storageId, fileName, originalFileName }, { createdOn, metadata, size, _response }]) => ({
			documentId: storageId,
			filename: fileName,
			originalFilename: originalFileName,
			size,
			mime: metadata.mime_type,
			documentURI: _response.request.url,
			dateCreated: createdOn,
			documentType: metadata.document_type
		})
	);
};

/**
 * @param {LPAQuestionnaireSubmission["SubmissionAddress"]} [addresses]
 * @returns {HASBOSubmission['neighbouring-address']}
 */
exports.formatAddresses = (addresses) =>
	addresses?.map((address) => ({
		line1: address.addressLine1,
		line2: address.addressLine2,
		town: address.townCity,
		county: null,
		postcode: address.postcode
	})) || [];

/**
 * @param {Answers} answers
 * @returns {string[]}
 */
exports.howYouNotifiedPeople = (answers) => {
	let notifiedPeople = [];
	if (answers.displaySiteNotice) {
		notifiedPeople.push('A public notice at the site');
	}
	if (answers.lettersToNeighbours) {
		notifiedPeople.push('Letters to neighbours');
	}
	if (answers.pressAdvert) {
		notifiedPeople.push('Advert in the local press');
	}
	return notifiedPeople;
};

/**
 * @param {{ AppealUser: import('@prisma/client').AppealUser }[]} users
 * @returns {DataModelUsers}
 */
exports.formatUsers = (users) =>
	users.map(({ AppealUser: { email, isLpaUser } }) => ({
		salutation: null,
		firstName: null,
		lastName: null,
		emailAddress: email,
		serviceUserType: isLpaUser ? 'Agent' : 'Appellant'
	}));

const dataModelApplicationDecisions = {
	[APPLICATION_DECISION.GRANTED]: 'granted',
	[APPLICATION_DECISION.REFUSED]: 'refused',
	[APPLICATION_DECISION.NODECISIONRECEIVED]: 'not-received'
};
/**
 * @param {string | null} applicationDecision
 * @returns {DataModelApplicationDecision}
 */
exports.formatApplicationDecision = (applicationDecision) =>
	dataModelApplicationDecisions[applicationDecision] ??
	dataModelApplicationDecisions[APPLICATION_DECISION.NODECISIONRECEIVED];
