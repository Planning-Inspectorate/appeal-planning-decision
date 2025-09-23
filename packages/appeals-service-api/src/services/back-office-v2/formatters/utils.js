const { initContainerClient } = require('@pins/common');
const { getDocType } = require('@pins/common/src/document-types');
const { blobMetaGetter } = require('../../../services/object-store');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const {
	APPEAL_APPLICATION_DECISION,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	SERVICE_USER_TYPE,
	APPEAL_CASE_PROCEDURE,
	APPEAL_LPA_PROCEDURE_PREFERENCE,
	APPEAL_DEVELOPMENT_TYPE
} = require('@planning-inspectorate/data-model');
const { LPA_NOTIFICATION_METHODS, CASE_TYPES } = require('@pins/common/src/database/data-static');
const deadlineDate = require('@pins/business-rules/src/rules/appeal/deadline-date');

/**
 * @typedef {import('../../../routes/v2/appellant-submissions/repo').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {Omit<LPAQuestionnaireSubmission, "AppealCase">} LPAQAnswers
 *
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppellantSubmissionCommand['documents']} DataModelDocuments
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppellantSubmissionCommand['documents'][0]['documentType'] | import('@planning-inspectorate/data-model/src/schemas').LPAQuestionnaireCommand['documents'][0]['documentType']} DataModelDocumentTypes
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppellantSubmissionCommand['users']} DataModelUsers
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppellantSubmissionCommand['casedata']['applicationDecision']} DataModelApplicationDecision
 *
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppellantCommonSubmissionProperties} AppellantCommonSubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppellantHASSubmissionProperties} AppellantHASSubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppellantS78SubmissionProperties} AppellantS78SubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 *
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQCommonSubmissionProperties} LPAQCommonSubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQHASSubmissionProperties} LPAQHASSubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQS78SubmissionProperties} LPAQS78SubmissionProperties
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 * @typedef {function(FullAppellantSubmission, LPA): Promise<AppellantSubmissionCommand>} AppellantSubmissionMapper
 *
 * @typedef {import ('../../../models/entities/lpa-entity')} LPA
 *
 * @typedef {import('../../../routes/v2/interested-party-submissions/repo').DetailedInterestedPartySubmission} InterestedPartySubmission
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealRepresentationSubmission['newUser']} IPNewUser
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
			documentType: getDocType(document_type, 'name')?.dataModelName ?? defaultDocType
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
	let address = {};
	if (interestedPartySubmission.addressLine1) {
		address = {
			addressLine1: interestedPartySubmission.addressLine1,
			addressLine2: interestedPartySubmission.addressLine2,
			addressTown: interestedPartySubmission.townCity,
			addressCounty: interestedPartySubmission.county,
			addressPostcode: interestedPartySubmission.postcode
		};
	}
	return {
		salutation: null,
		firstName: interestedPartySubmission.firstName,
		lastName: interestedPartySubmission.lastName,
		emailAddress: interestedPartySubmission.emailAddress,
		telephoneNumber: null,
		organisation: null,
		serviceUserType: SERVICE_USER_TYPE.INTERESTED_PARTY,
		...address
	};
};

/**
 * @param {string | null} gridReference
 * @returns {boolean}
 */
const isMissing = (gridReference) =>
	gridReference === undefined || gridReference === null || gridReference === '';

/**
 * @param {FullAppellantSubmission['SubmissionAddress'][number] | undefined} address
 * @param {string | null} easting
 * @param {string | null} northing
 * @returns {boolean}
 */
exports.siteAddressAndGridReferenceAreMissing = (address, easting, northing) => {
	const eastingMissing = isMissing(easting);
	const northingMissing = isMissing(northing);

	return address === undefined && (eastingMissing || northingMissing);
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

	if (
		exports.siteAddressAndGridReferenceAreMissing(
			address,
			appellantSubmission.siteGridReferenceEasting,
			appellantSubmission.siteGridReferenceNorthing
		)
	) {
		throw new Error(
			'appellantSubmission.siteAddress should not be null or appellantSubmission.siteGridReferenceEasting && appellantSubmission.siteGridReferenceNorthing should not be null'
		);
	}

	return {
		submissionId: appellantSubmission.appealId,
		caseProcedure: APPEAL_CASE_PROCEDURE.WRITTEN,
		typeOfPlanningApplication: appellantSubmission.typeOfPlanningApplication ?? null,
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
		siteAddressLine1: address?.addressLine1 ?? '',
		siteAddressLine2: address?.addressLine2 ?? '',
		siteAddressTown: address?.townCity ?? '',
		siteAddressCounty: address?.county ?? '',
		siteAddressPostcode: address?.postcode ?? '',
		siteGridReferenceEasting: appellantSubmission.siteGridReferenceEasting,
		siteGridReferenceNorthing: appellantSubmission.siteGridReferenceNorthing,
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
	const preference = getAppellantProcedurePreference(appellantSubmission);

	return {
		agriculturalHolding: appellantSubmission.agriculturalHolding ?? null,
		tenantAgriculturalHolding: appellantSubmission.agriculturalHolding
			? (appellantSubmission.tenantAgriculturalHolding ?? null)
			: null,
		otherTenantsAgriculturalHolding:
			appellantSubmission.agriculturalHolding && appellantSubmission.tenantAgriculturalHolding
				? (appellantSubmission.otherTenantsAgriculturalHolding ?? null)
				: null,
		informedTenantsAgriculturalHolding: appellantSubmission.agriculturalHolding
			? (appellantSubmission.informedTenantsAgriculturalHolding ?? null)
			: null,

		planningObligation: appellantSubmission.planningObligation ?? null,
		statusPlanningObligation: appellantSubmission.statusPlanningObligation ?? null,
		developmentType: exports.getDevelopmentType(appellantSubmission),
		...preference
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {AppellantS78SubmissionProperties}
 */
exports.getS20AppellantSubmissionFields = (appellantSubmission) => {
	const preference = getAppellantProcedurePreference(appellantSubmission);

	return {
		agriculturalHolding: null,
		tenantAgriculturalHolding: null,
		otherTenantsAgriculturalHolding: null,
		informedTenantsAgriculturalHolding: null,
		planningObligation: appellantSubmission.planningObligation ?? null,
		statusPlanningObligation: appellantSubmission.statusPlanningObligation ?? null,
		developmentType: exports.getDevelopmentType(appellantSubmission),
		...preference
	};
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {{appellantProcedurePreference: 'written'|'hearing'|'inquiry', appellantProcedurePreferenceDetails: string|null, appellantProcedurePreferenceDuration: Number|null, appellantProcedurePreferenceWitnessCount: Number|null}}
 */
const getAppellantProcedurePreference = (appellantSubmission) => {
	switch (appellantSubmission.appellantProcedurePreference) {
		case APPEAL_CASE_PROCEDURE.WRITTEN:
			return {
				appellantProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.WRITTEN,
				appellantProcedurePreferenceDetails: null,
				appellantProcedurePreferenceDuration: null,
				appellantProcedurePreferenceWitnessCount: null
			};
		case APPEAL_CASE_PROCEDURE.HEARING:
			return {
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.HEARING,
				appellantProcedurePreferenceDetails: appellantSubmission.appellantPreferHearingDetails,
				appellantProcedurePreferenceDuration: null,
				appellantProcedurePreferenceWitnessCount: null
			};
		case APPEAL_CASE_PROCEDURE.INQUIRY:
			return {
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.INQUIRY,
				appellantProcedurePreferenceDetails: appellantSubmission.appellantPreferInquiryDetails,
				appellantProcedurePreferenceDuration:
					Number(appellantSubmission.appellantPreferInquiryDuration) || null,
				appellantProcedurePreferenceWitnessCount: Number(
					appellantSubmission.appellantPreferInquiryWitnesses
				)
			};
		default:
			throw new Error('unknown appellantProcedurePreference');
	}
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {AppellantS78SubmissionProperties['developmentType']}
 */
exports.getDevelopmentType = (appellantSubmission) => {
	if (!appellantSubmission.typeDevelopment) return null;

	const isMajorDevelopment =
		appellantSubmission.majorMinorDevelopment === fieldValues.majorMinorDevelopment.MAJOR;

	switch (appellantSubmission.typeDevelopment) {
		case fieldValues.applicationAbout.HOUSEHOLDER:
			return APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER;
		case fieldValues.applicationAbout.CHANGE_OF_USE:
			return APPEAL_DEVELOPMENT_TYPE.CHANGE_OF_USE;
		case fieldValues.applicationAbout.MINERAL_WORKINGS:
			return APPEAL_DEVELOPMENT_TYPE.MINERAL_WORKINGS;
		case fieldValues.applicationAbout.DWELLINGS:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.MAJOR_DWELLINGS
				: APPEAL_DEVELOPMENT_TYPE.MINOR_DWELLINGS;
		case fieldValues.applicationAbout.INDUSTRY_STORAGE:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.MAJOR_INDUSTRY_STORAGE
				: APPEAL_DEVELOPMENT_TYPE.MINOR_INDUSTRY_STORAGE;
		case fieldValues.applicationAbout.OFFICES:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.MAJOR_OFFICES
				: APPEAL_DEVELOPMENT_TYPE.MINOR_OFFICES;
		case fieldValues.applicationAbout.RETAIL_SERVICES:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.MAJOR_RETAIL_SERVICES
				: APPEAL_DEVELOPMENT_TYPE.MINOR_RETAIL_SERVICES;
		case fieldValues.applicationAbout.TRAVELLER_CARAVAN:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.MAJOR_TRAVELLER_CARAVAN
				: APPEAL_DEVELOPMENT_TYPE.MINOR_TRAVELLER_CARAVAN;
		case fieldValues.applicationAbout.OTHER:
			return isMajorDevelopment
				? APPEAL_DEVELOPMENT_TYPE.OTHER_MAJOR
				: APPEAL_DEVELOPMENT_TYPE.OTHER_MINOR;
		default:
			throw new Error('unhandled developmentType');
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
		return (
			address.fieldName === 'neighbourSiteAddress' &&
			address.addressLine1 &&
			address.townCity &&
			address.postcode
		);
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
	reasonForNeighbourVisits: answers.neighbourSiteAccess_neighbourSiteAccessDetails
		? answers.neighbourSiteAccess_neighbourSiteAccessDetails
		: null,
	nearbyCaseReferences: answers.SubmissionLinkedCase?.map(({ caseReference }) => caseReference)
});

/**
 *
 * @param {import('@prisma/client').SubmissionListedBuilding[]} listedBuildings
 * @param {import('@pins/common/src/dynamic-forms/field-names').DynamicFormFieldName} type
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
exports.getCASLPAQSubmissionFields = (answers) => {
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
		lpaCostsAppliedFor: null, // not asked
		// Consultation responses and representations
		hasStatutoryConsultees: exports.toBool(answers.statutoryConsultees),
		consultedBodiesDetails: answers.statutoryConsultees_consultedBodiesDetails || null,
		hasConsultationResponses: answers.consultationResponses
	};
};

/**
 * @param {LPAQAnswers} answers
 * @returns {LPAQS78SubmissionProperties}
 */
exports.getS78LPAQSubmissionFields = (answers) => {
	const levy = getInfrastructureLevy(answers);
	const preference = getLPAProcedurePreference(answers);
	const designatedSitesNames = exports.getDesignatedSiteNames(answers);

	return {
		// Constraints, designations and other issues
		changedListedBuildingNumbers: getListedBuildingByType(
			answers.SubmissionListedBuilding,
			fieldNames.changedListedBuildingNumber
		),
		affectsScheduledMonument: answers.affectsScheduledMonument,
		hasProtectedSpecies: answers.protectedSpecies,
		isAonbNationalLandscape: answers.areaOutstandingBeauty,
		designatedSitesNames,
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
 * @returns {LPAQS78SubmissionProperties}
 */
exports.getS20LPAQSubmissionFields = (answers) => {
	const levy = getInfrastructureLevy(answers);
	const preference = getLPAProcedurePreference(answers);
	const designatedSitesNames = exports.getDesignatedSiteNames(answers);

	return {
		// Constraints, designations and other issues
		changedListedBuildingNumbers: getListedBuildingByType(
			answers.SubmissionListedBuilding,
			fieldNames.changedListedBuildingNumber
		),
		affectsScheduledMonument: answers.affectsScheduledMonument,
		hasProtectedSpecies: answers.protectedSpecies,
		isAonbNationalLandscape: answers.areaOutstandingBeauty,
		designatedSitesNames,
		hasTreePreservationOrder: answers.treePreservationOrder,
		preserveGrantLoan: answers.section3aGrant,
		consultHistoricEngland: answers.consultHistoricEngland,
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

/**
 * @param {LPAQAnswers} answers
 * @returns {string[]}
 */
exports.getDesignatedSiteNames = (answers) => {
	/** @type {(string | null)[]} */
	let designatedSitesNames = [];

	if (answers.designatedSites && answers.designatedSites !== 'None') {
		designatedSitesNames = [
			...answers.designatedSites.split(','),
			answers.designatedSites_otherDesignations || null
		]
			.filter((name) => name !== fieldValues.designatedSites.other) // back office only accepts 1 custom, so ensure we don't send other
			.filter(Boolean);
	}

	/* @ts-ignore filter(Boolean) removes null values */
	return designatedSitesNames;
};
