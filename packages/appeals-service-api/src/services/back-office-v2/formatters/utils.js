const { initContainerClient, documentTypes } = require('@pins/common');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

/**
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('./has/has').Submission} HASBOSubmission
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents']} DataModelDocuments
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents'][0]['documentType'] | import('pins-data-model/src/schemas').LPAQuestionnaireCommand['documents'][0]['documentType']} DataModelDocumentTypes
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['users']} DataModelUsers
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['casedata']['applicationDecision']} DataModelApplicationDecision
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionGetPayload<{
 *   include: {
 *     SubmissionDocumentUpload: true,
 *     SubmissionAddress: true,
 *     SubmissionLinkedCase: true,
 * 		 SubmissionListedBuilding: true,
 *		 Appeal: {
 *       include: {
 *			   Users: {
 *           include: {
 *             AppealUser: true
 *           }
 *         }
 *		   }
 *     }
 *   }
 * }>} FullAppellantSubmission
 */

/** @type {{ [key: string]: DataModelDocumentTypes }} */
const documentTypeMap = {
	[documentTypes.uploadCostApplication.name]: 'appellantCostsApplication',
	[documentTypes.uploadAppellantStatement.name]: 'appellantStatement',
	[documentTypes.uploadApplicationDecisionLetter.name]: 'applicationDecisionLetter',
	[documentTypes.uploadChangeOfDescriptionEvidence.name]: 'changedDescription',
	[documentTypes.uploadOriginalApplicationForm.name]: 'originalApplicationForm',
	[documentTypes.whoWasNotified.name]: 'whoNotified',
	[documentTypes.conservationMap.name]: 'conservationMap',
	[documentTypes.planningOfficersReportUpload.name]: 'planningOfficerReport'
};

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
		([
			{ storageId, fileName, originalFileName },
			{
				createdOn,
				metadata: { document_type, size, mime_type },
				_response
			}
		]) => ({
			documentId: storageId,
			filename: fileName,
			originalFilename: originalFileName,
			size: Number(size),
			mime: mime_type,
			documentURI: _response.request.url,
			dateCreated: new Date(createdOn).toISOString(),
			documentType: documentTypeMap[document_type]
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
 * @param {FullAppellantSubmission} users
 * @returns {DataModelUsers}
 */
exports.formatApplicationSubmissionUsers = ({
	isAppellant,
	appellantFirstName,
	appellantLastName,
	appellantCompanyName,
	contactFirstName,
	contactLastName,
	contactCompanyName,
	contactPhoneNumber,
	Appeal: {
		Users: [
			{
				AppealUser: { email }
			}
		]
	}
}) => {
	/** @type {DataModelUsers} */
	const users = [
		{
			salutation: null,
			firstName: contactFirstName,
			lastName: contactLastName,
			emailAddress: email,
			serviceUserType: isAppellant ? 'Appellant' : 'Agent',
			telephoneNumber: contactPhoneNumber,
			organisation: contactCompanyName ?? null
		}
	];
	if (!isAppellant) {
		users.push({
			salutation: null,
			firstName: appellantFirstName,
			lastName: appellantLastName,
			emailAddress: null,
			serviceUserType: 'Appellant',
			telephoneNumber: null,
			organisation: appellantCompanyName ?? null
		});
	}

	return users;
};

const dataModelApplicationDecisions = {
	[APPLICATION_DECISION.GRANTED]: 'granted',
	[APPLICATION_DECISION.REFUSED]: 'refused',
	[APPLICATION_DECISION.NODECISIONRECEIVED]: 'not_received'
};
/**
 * @param {string | null} applicationDecision
 * @returns {DataModelApplicationDecision}
 */
exports.formatApplicationDecision = (applicationDecision) =>
	dataModelApplicationDecisions[applicationDecision] ??
	dataModelApplicationDecisions[APPLICATION_DECISION.NODECISIONRECEIVED];

const yesNoSomeMap = {
	yes: 'Yes',
	no: 'No',
	some: 'Some'
};

/**
 * @param {string} answer
 * @returns
 */
exports.formatYesNoSomeAnswer = (answer) => yesNoSomeMap[answer] ?? null;
