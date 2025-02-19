const { initContainerClient } = require('@pins/common');
const { getDocType } = require('@pins/common/src/document-types');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const {
	APPEAL_APPLICATION_DECISION,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	SERVICE_USER_TYPE,
	APPEAL_CASE_PROCEDURE,
	APPEAL_LPA_PROCEDURE_PREFERENCE
} = require('pins-data-model');
const { LPA_NOTIFICATION_METHODS, CASE_TYPES } = require('@pins/common/src/database/data-static');
const deadlineDate = require('@pins/business-rules/src/rules/appeal/deadline-date');

/**
 * @typedef {import('../../../routes/v2/appellant-submissions/repo').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} LPAQAnswers
 *
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents']} DataModelDocuments
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['documents'][0]['documentType'] | import('pins-data-model/src/schemas').LPAQuestionnaireCommand['documents'][0]['documentType']} DataModelDocumentTypes
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['users']} DataModelUsers
 * @typedef {import('pins-data-model/src/schemas').AppellantSubmissionCommand['casedata']['applicationDecision']} DataModelApplicationDecision
 *
 * @typedef {import ('pins-data-model').Schemas.AppellantCommonSubmissionProperties} AppellantCommonSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantHASSubmissionProperties} AppellantHASSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantS78SubmissionProperties} AppellantS78SubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 *
 * @typedef {import ('pins-data-model').Schemas.LPAQCommonSubmissionProperties} LPAQCommonSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.LPAQHASSubmissionProperties} LPAQHASSubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.LPAQS78SubmissionProperties} LPAQS78SubmissionProperties
 * @typedef {import ('pins-data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 *
 * @typedef {import ('../../../models/entities/lpa-entity')} LPA
 *
 * @typedef {import('../../../routes/v2/interested-party-submissions/repo').DetailedInterestedPartySubmission} InterestedPartySubmission
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentationSubmission['newUser']} IPNewUser
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
			documentType: getDocType(document_type, 'name').dataModelName ?? defaultDocType // todo: this errors so will never get default
		})
	);
};

/**
 * @param {LPAQuestionnaireSubmission["SubmissionAddress"]} [addresses]
 * @returns {AppellantSubmissionCommand['neighbouring-address']}
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
 * @param {LPAQAnswers} answers
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
 * @param {InterestedPartySubmission} interestedPartySubmission
 * @returns {IPNewUser}
 */
exports.createInterestedPartyNewUser = (interestedPartySubmission) => {
	return {
		salutation: null,
		firstName: interestedPartySubmission.firstName,
		lastName: interestedPartySubmission.lastName,
		emailAddress: interestedPartySubmission.emailAddress,
		telephoneNumber: null,
		organisation: null,
		serviceUserType: 'InterestedParty'
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @param {LPA} lpa
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

		...preference
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {{appellantProcedurePreference: 'written'|'hearing'|'inquiry', appellantProcedurePreferenceDetails: string|null, appellantProcedurePreferenceDuration: Number|null, inquiryHowManyWitnesses: Number|null}}
 */
const getAppellantProcedurePreference = (appellantSubmission) => {
	switch (appellantSubmission.appellantProcedurePreference) {
		case APPEAL_CASE_PROCEDURE.WRITTEN:
			return {
				appellantProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.WRITTEN,
				appellantProcedurePreferenceDetails: null,
				appellantProcedurePreferenceDuration: null,
				inquiryHowManyWitnesses: null
			};
		case APPEAL_CASE_PROCEDURE.HEARING:
			return {
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.HEARING,
				appellantProcedurePreferenceDetails: appellantSubmission.appellantPreferHearingDetails,
				appellantProcedurePreferenceDuration: null,
				inquiryHowManyWitnesses: null
			};
		case APPEAL_CASE_PROCEDURE.INQUIRY:
			return {
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: appellantSubmission.appellantPreferInquiryDetails,
				appellantProcedurePreferenceDuration:
					Number(appellantSubmission.appellantPreferInquiryDuration) || null,
				inquiryHowManyWitnesses: Number(appellantSubmission.appellantPreferInquiryWitnesses)
			};
		default:
			throw new Error('unknown appellantProcedurePreference');
	}
};

/**
 * @param {string} caseReference
 * @param {LPAQAnswers} answers
 * @returns {LPAQCommonSubmissionProperties}
 */
exports.getCommonLPAQSubmissionFields = (caseReference, answers) => ({
	caseReference: caseReference,
	lpaQuestionnaireSubmittedDate: new Date().toISOString(),
	siteAccessDetails: answers.lpaSiteAccess_lpaSiteAccessDetails
		? [answers.lpaSiteAccess_lpaSiteAccessDetails]
		: null,
	siteSafetyDetails: answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails
		? [answers.lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails]
		: null,
	neighbouringSiteAddresses: answers.SubmissionAddress?.filter((address) => {
		return address.fieldName === 'neighbourSiteAddress';
	}).map((address) => {
		return {
			neighbouringSiteAddressLine1: address.addressLine1,
			neighbouringSiteAddressLine2: address.addressLine2,
			neighbouringSiteAddressTown: address.townCity,
			neighbouringSiteAddressCounty: address.county,
			neighbouringSiteAddressPostcode: address.postcode,
			neighbouringSiteAccessDetails: null, // not asked
			neighbouringSiteSafetyDetails: null // not asked
		};
	}),
	nearbyCaseReferences: answers.SubmissionLinkedCase?.map(({ caseReference }) => caseReference)
});

/**
 *
 * @param {import('@prisma/client').SubmissionListedBuilding[]} listedBuildings
 * @param {string} type
 * @returns {string[]}
 */
const getListedBuildingByType = (listedBuildings, type) => {
	if (!listedBuildings || !listedBuildings.length) return [];

	return listedBuildings.filter((lb) => lb.fieldName === type).map(({ reference }) => reference);
};

/**
 * @param {LPAQAnswers} answers
 * @returns {LPAQHASSubmissionProperties}
 */
exports.getHASLPAQSubmissionFields = (answers) => {
	return {
		isCorrectAppealType: answers.correctAppealType,
		affectedListedBuildingNumbers: getListedBuildingByType(
			answers.SubmissionListedBuilding,
			fieldNames.affectedListedBuildingNumber
		),
		inConservationArea: answers.conservationArea,
		isGreenBelt: answers.greenBelt,
		notificationMethod: exports.howYouNotifiedPeople(answers),
		newConditionDetails: answers.newConditions_newConditionDetails ?? null,
		lpaStatement: '', // not asked
		lpaCostsAppliedFor: null // not asked
	};
};

/**
 * @param {LPAQAnswers} answers
 * @returns {LPAQS78SubmissionProperties}
 */
exports.getS78LPAQSubmissionFields = (answers) => {
	const levy = getInfrastructureLevy(answers);
	const preference = getLPAProcedurePreference(answers);

	return {
		// Constraints, designations and other issues
		changedListedBuildingNumbers: getListedBuildingByType(
			answers.SubmissionListedBuilding,
			fieldNames.changedListedBuildingNumber
		),
		affectsScheduledMonument: answers.affectsScheduledMonument,
		hasProtectedSpecies: answers.protectedSpecies,
		isAonbNationalLandscape: answers.areaOutstandingBeauty,
		designatedSitesNames: [
			...(answers.designatedSites ? answers.designatedSites.split(',') : []),
			answers.designatedSites_otherDesignations || null
		].filter(Boolean),
		hasTreePreservationOrder: answers.treePreservationOrder,
		isGypsyOrTravellerSite: answers.gypsyTraveller,
		isPublicRightOfWay: answers.publicRightOfWay,

		// Environmental impact assessment, todo: handle dependent logic in journey so we don't send redundant data
		eiaEnvironmentalImpactSchedule: getSchedule(answers),
		eiaDevelopmentDescription: answers.developmentDescription || null,
		eiaSensitiveAreaDetails: answers.sensitiveArea_sensitiveAreaDetails || null,
		eiaColumnTwoThreshold: answers.columnTwoThreshold,
		eiaScreeningOpinion: answers.screeningOpinion,
		eiaRequiresEnvironmentalStatement: answers.environmentalStatement,
		eiaCompletedEnvironmentalStatement: exports.toBool(
			answers.applicantSubmittedEnvironmentalStatement
		),

		// Consultation responses and representations
		hasStatutoryConsultees: exports.toBool(answers.statutoryConsultees),
		consultedBodiesDetails: answers.statutoryConsultees_consultedBodiesDetails || null,
		hasConsultationResponses: answers.consultationResponses,

		// Planning officer’s report and supporting documents
		hasEmergingPlan: answers.emergingPlan,
		hasSupplementaryPlanningDocs: answers.supplementaryPlanningDocs,
		...levy,

		// Appeal process
		...preference
	};
};

/**
 * @param {LPAQAnswers} answers
 * @returns {string|null}
 */
const getSchedule = (answers) => {
	if (!answers.environmentalImpactSchedule || answers.environmentalImpactSchedule === 'no')
		return null;
	return answers.environmentalImpactSchedule;
};

/**
 * @param {LPAQAnswers} answers
 * @returns {{hasInfrastructureLevy: boolean, isInfrastructureLevyFormallyAdopted: boolean|null, infrastructureLevyAdoptedDate: string|null, infrastructureLevyExpectedDate: string|null}}
 */
const getInfrastructureLevy = (answers) => {
	if (!answers.infrastructureLevy)
		return {
			hasInfrastructureLevy: false,
			isInfrastructureLevyFormallyAdopted: null,
			infrastructureLevyAdoptedDate: null,
			infrastructureLevyExpectedDate: null
		};

	if (answers.infrastructureLevyAdopted)
		return {
			hasInfrastructureLevy: true,
			isInfrastructureLevyFormallyAdopted: true,
			infrastructureLevyAdoptedDate: answers.infrastructureLevyAdoptedDate?.toISOString() || null,
			infrastructureLevyExpectedDate: null
		};

	return {
		hasInfrastructureLevy: true,
		isInfrastructureLevyFormallyAdopted: false,
		infrastructureLevyAdoptedDate: null,
		infrastructureLevyExpectedDate: answers.infrastructureLevyExpectedDate?.toISOString() || null
	};
};

/**
 * @param {LPAQAnswers} answers
 * @returns {{lpaProcedurePreference: 'written'|'hearing'|'inquiry', lpaProcedurePreferenceDetails: string|null, lpaProcedurePreferenceDuration: Number|null}}
 */
const getLPAProcedurePreference = (answers) => {
	switch (answers.lpaProcedurePreference) {
		case APPEAL_CASE_PROCEDURE.WRITTEN:
			return {
				lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.WRITTEN,
				lpaProcedurePreferenceDetails: null,
				lpaProcedurePreferenceDuration: null
			};
		case APPEAL_CASE_PROCEDURE.HEARING:
			return {
				lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.HEARING,
				lpaProcedurePreferenceDetails: answers.lpaPreferHearingDetails || null,
				lpaProcedurePreferenceDuration: null
			};
		case APPEAL_CASE_PROCEDURE.INQUIRY:
			return {
				lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.INQUIRY,
				lpaProcedurePreferenceDetails: answers.lpaPreferInquiryDetails || null,
				lpaProcedurePreferenceDuration:
					Number(answers.lpaProcedurePreference_lpaPreferInquiryDuration) || null
			};
		default:
			throw new Error('unknown lpaProcedurePreference');
	}
};
