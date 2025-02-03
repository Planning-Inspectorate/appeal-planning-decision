const { initContainerClient } = require('@pins/common');
const { getDocType } = require('@pins/common/src/document-types');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const {
	APPEAL_APPLICATION_DECISION,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	SERVICE_USER_TYPE,
	APPEAL_CASE_PROCEDURE
} = require('pins-data-model');
const { LPA_NOTIFICATION_METHODS, CASE_TYPES } = require('@pins/common/src/database/data-static');
const deadlineDate = require('@pins/business-rules/src/rules/appeal/deadline-date');

/**
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} Answers
 * @typedef {import('./has/has').Submission} HASBOSubmission
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents']} DataModelDocuments
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents'][0]['documentType'] | import('pins-data-model/src/schemas').LPAQuestionnaireCommand['documents'][0]['documentType']} DataModelDocumentTypes
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['users']} DataModelUsers
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['casedata']['applicationDecision']} DataModelApplicationDecision
 * @typedef {import('../../../routes/v2/appellant-submissions/repo').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {import ('pins-data-model').Schemas.AppellantCommonSubmissionProperties} AppellantCommonSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantHASSubmissionProperties} AppellantHASSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantS78SubmissionProperties} AppellantS78SubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 * @typedef {import ('../../../models/entities/lpa-entity')} LPA
 * @typedef {function(FullAppellantSubmission, LPA): Promise<AppellantSubmissionCommand>} AppellantSubmissionMapper
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

/**
 * @type {Object.<string, string>}
 */
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

/**
 * @typedef {{yes: "Yes", no:"No", some: "Some"}} yesNoSome
 * @type {yesNoSome}
 */
const yesNoSomeMap = {
	yes: 'Yes',
	no: 'No',
	some: 'Some'
};

/**
 * @param {string|null} answer
 * @returns {"Yes"|"No"|"Some"|null}
 */
exports.formatYesNoSomeAnswer = (answer) => {
	if (!answer || !isValidYesNoSomeKey(answer)) {
		return null;
	}
	return yesNoSomeMap[answer];
};

/**
 * @param {string} key
 * @returns {key is keyof yesNoSome}
 */
function isValidYesNoSomeKey(key) {
	return key in yesNoSomeMap;
}

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @param {import('../../../models/entities/lpa-entity')} lpa
 * @returns {AppellantCommonSubmissionProperties}
 */
exports.getCommonAppellantSubmissionFields = (appellantSubmission, lpa) => {
	if (!appellantSubmission.applicationDecisionDate) {
		throw new Error('appellantSubmission.applicationDecisionDate should never be null');
	}

	if (!appellantSubmission.onApplicationDate) {
		throw new Error('appellantSubmission.onApplicationDate should never be null');
	}

	if (!appellantSubmission.applicationDecision) {
		throw new Error('appellantSubmission.applicationDecision should never be null');
	}

	const address = appellantSubmission.SubmissionAddress?.find(
		(address) => address.fieldName === 'siteAddress'
	);

	if (!address) {
		throw new Error('appellantSubmission.siteAddress should never be null');
	}

	return {
		submissionId: appellantSubmission.appealId,
		caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
		lpaCode: lpa.getLpaCode(),
		caseSubmittedDate: new Date().toISOString(),
		enforcementNotice: false, // this will eventually come from before you start
		applicationReference: appellantSubmission.applicationReference ?? '',
		applicationDate: appellantSubmission.onApplicationDate.toISOString(),
		applicationDecision: exports.formatApplicationDecision(appellantSubmission.applicationDecision),
		applicationDecisionDate: appellantSubmission.applicationDecisionDate.toISOString(),
		caseSubmissionDueDate: deadlineDate(
			appellantSubmission.applicationDecisionDate,
			CASE_TYPES[appellantSubmission.appealTypeCode].id.toString(),
			appellantSubmission.applicationDecision
		).toISOString(),
		siteAddressLine1: address.addressLine1 ?? '',
		siteAddressLine2: address.addressLine2 ?? '',
		siteAddressTown: address.townCity ?? '',
		siteAddressCounty: address.county ?? '',
		siteAddressPostcode: address.postcode ?? '',
		siteAccessDetails: [appellantSubmission.appellantSiteAccess_appellantSiteAccessDetails].filter(
			Boolean
		),
		siteSafetyDetails: [appellantSubmission.appellantSiteSafety_appellantSiteSafetyDetails].filter(
			Boolean
		),
		neighbouringSiteAddresses: null, // unused
		nearbyCaseReferences: appellantSubmission.SubmissionLinkedCase?.map(
			({ caseReference }) => caseReference
		)
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {AppellantHASSubmissionProperties}
 */
exports.getHASAppellantSubmissionFields = (appellantSubmission) => {
	// todo: HAS properties only type
	return {
		isGreenBelt: appellantSubmission.appellantGreenBelt ?? null,
		siteAreaSquareMetres: Number(appellantSubmission.siteAreaSquareMetres) || null,
		floorSpaceSquareMetres: Number(appellantSubmission.siteAreaSquareMetres) || null, // is this correct?
		ownsAllLand: appellantSubmission.ownsAllLand ?? null,
		ownsSomeLand: appellantSubmission.ownsSomeLand ?? null,
		knowsOtherOwners: exports.formatYesNoSomeAnswer(appellantSubmission.knowsOtherOwners),
		knowsAllOwners: exports.formatYesNoSomeAnswer(appellantSubmission.knowsAllOwners),
		advertisedAppeal: appellantSubmission.advertisedAppeal ?? null,
		ownersInformed: appellantSubmission.informedOwners ?? null,
		originalDevelopmentDescription: appellantSubmission.developmentDescriptionOriginal ?? null,
		changedDevelopmentDescription: appellantSubmission.updateDevelopmentDescription ?? null,
		appellantCostsAppliedFor: appellantSubmission.costApplication ?? null
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {AppellantS78SubmissionProperties}
 */
exports.getS78AppellantSubmissionFields = (appellantSubmission) => {
	// todo: S78 properties only type
	const preference = getAppellantProcedurePreference(appellantSubmission);

	return {
		agriculturalHolding: appellantSubmission.agriculturalHolding ?? null,
		tenantAgriculturalHolding: appellantSubmission.agriculturalHolding
			? appellantSubmission.tenantAgriculturalHolding ?? null
			: null,
		otherTenantsAgriculturalHolding:
			appellantSubmission.agriculturalHolding && appellantSubmission.tenantAgriculturalHolding
				? appellantSubmission.otherTenantsAgriculturalHolding ?? null
				: null,
		informedTenantsAgriculturalHolding: appellantSubmission.agriculturalHolding
			? appellantSubmission.informedTenantsAgriculturalHolding ?? null
			: null,

		planningObligation: appellantSubmission.planningObligation ?? null,
		statusPlanningObligation: appellantSubmission.statusPlanningObligation ?? null,

		appellantProcedurePreference: preference.type,
		appellantProcedurePreferenceDetails: preference.details,
		appellantProcedurePreferenceDuration: preference.duration,
		inquiryHowManyWitnesses: preference.witnesses
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {{type: 'written'|'hearing'|'inquiry', details: string|null, duration: Number|null, witnesses: Number|null}}
 */
const getAppellantProcedurePreference = (appellantSubmission) => {
	/** @type {{type: string, details: string|null, duration: Number|null, witnesses: Number|null }} */
	let preference = {
		type: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.WRITTEN,
		details: null,
		duration: null,
		witnesses: null
	};

	if (appellantSubmission.appellantProcedurePreference === APPEAL_CASE_PROCEDURE.HEARING) {
		preference = {
			type: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.HEARING,
			details: appellantSubmission.appellantPreferHearingDetails,
			duration: null,
			witnesses: null
		};
	} else if (appellantSubmission.appellantProcedurePreference === APPEAL_CASE_PROCEDURE.INQUIRY) {
		preference = {
			type: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
			details: appellantSubmission.appellantPreferInquiryDetails,
			duration: Number(appellantSubmission.appellantPreferInquiryDuration) || null,
			witnesses: Number(appellantSubmission.appellantPreferInquiryWitnesses)
		};
	}

	return preference;
};
