const { initContainerClient } = require('@pins/common');
const { getDocType } = require('@pins/common/src/document-types');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const { APPEAL_APPLICATION_DECISION, SERVICE_USER_TYPE } = require('pins-data-model');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');

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

/**
 * @param {string | null} str
 * @returns {boolean}
 */
exports.toBool = (str) => str === 'yes';

/**
 * @param {{ SubmissionDocumentUpload: import('@prisma/client').SubmissionDocumentUpload[] }} answers
 * @param {string} [defaultDocType]
 * @returns {Promise<DataModelDocuments>}
 */
exports.getDocuments = async ({ SubmissionDocumentUpload }, defaultDocType) => {
	const getBlobMeta = blobMetaGetter(initContainerClient);

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
			documentType: getDocType(document_type, 'name').dataModelName ?? defaultDocType
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
 * @returns {string[]|null}
 */
exports.howYouNotifiedPeople = (answers) => {
	if (!answers.notificationMethod) return null;

	return answers.notificationMethod
		.split(',') // get split char from dynamic form question
		.map((x) => {
			// cases from dynamic forms questions: howYouNotifiedPeople: notificationMethod
			switch (x) {
				case 'site-notice':
					return LPA_NOTIFICATION_METHODS.notice.key;
				case 'letters-or-emails':
					return LPA_NOTIFICATION_METHODS.letter.key;
				case 'advert':
					return LPA_NOTIFICATION_METHODS.pressAdvert.key;
				default:
					return null;
			}
		})
		.filter(Boolean);
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
			serviceUserType: isAppellant ? SERVICE_USER_TYPE.APPELLANT : SERVICE_USER_TYPE.AGENT,
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
			serviceUserType: SERVICE_USER_TYPE.APPELLANT,
			telephoneNumber: null,
			organisation: appellantCompanyName ?? null
		});
	}

	return users;
};

const dataModelApplicationDecisions = {
	[APPLICATION_DECISION.GRANTED]: APPEAL_APPLICATION_DECISION.GRANTED,
	[APPLICATION_DECISION.REFUSED]: APPEAL_APPLICATION_DECISION.REFUSED,
	[APPLICATION_DECISION.NODECISIONRECEIVED]: APPEAL_APPLICATION_DECISION.NOT_RECEIVED
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
