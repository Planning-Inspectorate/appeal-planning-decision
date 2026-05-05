const {
	ServiceUserRepository,
	ServiceUserType
} = require('#repositories/sql/service-user-repository');
const { AppealCaseRepository } = require('./repo');
const { Prisma } = require('@pins/database/src/client/client');
const ApiError = require('#errors/apiError');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	sendSubmissionConfirmationEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2
} = require('#lib/notify');
const sanitizePostcode = require('#lib/sanitize-postcode');

const repo = new AppealCaseRepository();
const serviceUserRepo = new ServiceUserRepository();
const { SchemaValidator } = require('../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();
const logger = require('#lib/logger');
const { chunkArray, runBatchWithPromise } = require('@pins/common/src/database/chunk-array');

/**
 * @template Payload
 * @typedef {import('../../../services/back-office-v2/validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import('@pins/database/src/client/client').ServiceUser} ServiceUser
 * @typedef {import('@pins/database/src/client/client').AppealCaseRelationship} AppealRelations
 * @typedef {import('@pins/database/src/client/client').SubmissionLinkedCase} SubmissionLinkedCase
 * @typedef {AppealCase & {users?: Array.<ServiceUser>} & {relations?: Array.<AppealRelations>} & {Representations?: Array.<import('src/spec/api-types').Representation>}} AppealCaseDetailed
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealHASCase} AppealHASCase
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealS78Case} AppealS78Case
 * @typedef {import('./repo').LinkedCase} LinkedCase
 * @typedef {{ownerOccupancyStatus: string|null|undefined, issueDateOfEnforcementNotice: string|null|undefined, effectiveDateOfEnforcementNotice: string|null|undefined, enforcementReference: string|null|undefined, descriptionOfAllegedBreach: string|null|undefined, contactPlanningInspectorateDate: string|null|undefined}} EnforcementListedAppealFormFields
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {AppealCaseDetailed}
 */
const parseJSONFields = (caseData) => {
	return {
		...caseData,
		siteAccessDetails: caseData.siteAccessDetails ? JSON.parse(caseData.siteAccessDetails) : [],
		siteSafetyDetails: caseData.siteSafetyDetails ? JSON.parse(caseData.siteSafetyDetails) : [],
		caseValidationInvalidDetails: caseData.caseValidationInvalidDetails
			? JSON.parse(caseData.caseValidationInvalidDetails)
			: [],
		caseValidationIncompleteDetails: caseData.caseValidationIncompleteDetails
			? JSON.parse(caseData.caseValidationIncompleteDetails)
			: [],
		lpaQuestionnaireValidationDetails: caseData.lpaQuestionnaireValidationDetails
			? JSON.parse(caseData.lpaQuestionnaireValidationDetails)
			: [],
		designatedSitesNames: caseData.designatedSitesNames
			? JSON.parse(caseData.designatedSitesNames)
			: []
	};
};

/**
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseSelect & { users?: boolean, relations?: boolean, linkedCases?: boolean }} AppealCaseSelect
 * Get an appeal case and appellant by case reference
 *
 * @param {object} opts
 * @param {string} opts.caseReference
 * @param {AppealCaseSelect} opts.fields
 * @returns {Promise<AppealCaseDetailed|null>}
 */
async function getCaseAndAppellant(opts) {
	const { users, relations, linkedCases, ...repoFields } = opts?.fields || {};

	const repoOpts = {
		...opts,
		fields: opts.fields ? { select: repoFields } : undefined
	};

	let appeal = await repo.getByCaseReference(repoOpts);

	if (!appeal) {
		return null;
	}

	if (!opts.fields || users === true) {
		appeal = await appendAppellantAndAgent(appeal);
	}
	if (!opts.fields || relations === true) {
		appeal = await appendAppealRelations(appeal);
	}
	if (!opts.fields || linkedCases === true) {
		appeal = await appendLinkedCases(appeal);
	}

	return parseJSONFields(appeal);
}

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase|AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapCommonDataModelToAppealCase = (
	caseProcessCode,
	{
		// these are ignored or handled outside of this function
		caseType: _caseType,
		linkedCaseStatus: _linkedCaseStatus,
		leadCaseReference: _leadCaseReference,
		notificationMethod: _notificationMethod,
		nearbyCaseReferences: _nearbyCaseReferences,
		neighbouringSiteAddresses: _neighbouringSiteAddresses,
		affectedListedBuildingNumbers: _affectedListedBuildingNumbers,
		submissionId: _submissionId,
		advertDetails: _advertDetails,
		// custom mappings
		caseStatus,
		caseDecisionOutcome,
		caseValidationOutcome,
		lpaQuestionnaireValidationOutcome,
		caseProcedure,
		lpaCode,
		caseSpecialisms,
		caseValidationInvalidDetails,
		caseValidationIncompleteDetails,
		lpaQuestionnaireValidationDetails,
		siteAccessDetails,
		siteSafetyDetails,
		siteAddressPostcode,
		// direct mappings
		caseId,
		caseReference,
		caseOfficerId,
		inspectorId,
		allocationLevel,
		allocationBand,
		caseSubmittedDate,
		caseCreatedDate,
		caseUpdatedDate,
		caseValidDate,
		caseValidationDate,
		caseExtensionDate,
		caseStartedDate,
		casePublishedDate,
		lpaQuestionnaireDueDate,
		lpaQuestionnaireSubmittedDate,
		lpaQuestionnaireCreatedDate,
		lpaQuestionnairePublishedDate,
		lpaQuestionnaireValidationOutcomeDate,
		lpaStatement,
		caseWithdrawnDate,
		caseTransferredDate,
		transferredCaseClosedDate,
		caseDecisionOutcomeDate,
		caseDecisionPublishedDate,
		caseCompletedDate,
		enforcementNotice,
		applicationReference,
		applicationDate,
		applicationDecision,
		applicationDecisionDate,
		caseSubmissionDueDate,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteGridReferenceEasting,
		siteGridReferenceNorthing,
		siteAreaSquareMetres,
		floorSpaceSquareMetres,
		isCorrectAppealType,
		isGreenBelt,
		inConservationArea,
		ownsAllLand,
		ownsSomeLand,
		knowsOtherOwners,
		knowsAllOwners,
		advertisedAppeal,
		ownersInformed,
		originalDevelopmentDescription,
		changedDevelopmentDescription,
		newConditionDetails,
		appellantCostsAppliedFor,
		lpaCostsAppliedFor,
		typeOfPlanningApplication,
		reasonForNeighbourVisits
	}
) => ({
	// custom mappings
	CaseStatus: { connect: { key: caseStatus } },
	CaseDecisionOutcome: caseDecisionOutcome ? { connect: { key: caseDecisionOutcome } } : undefined,
	CaseValidationOutcome: caseValidationOutcome
		? { connect: { key: caseValidationOutcome } }
		: undefined,
	LPAQuestionnaireValidationOutcome: lpaQuestionnaireValidationOutcome
		? { connect: { key: lpaQuestionnaireValidationOutcome } }
		: undefined,
	CaseType: { connect: { processCode: caseProcessCode } },
	ProcedureType: {
		connectOrCreate: {
			where: {
				key: caseProcedure
			},
			create: {
				key: caseProcedure,
				name: caseProcedure
			}
		}
	},
	siteAddressPostcode: siteAddressPostcode,
	siteAddressPostcodeSanitized: sanitizePostcode(siteAddressPostcode),
	LPACode: lpaCode,
	caseSpecialisms: caseSpecialisms ? JSON.stringify(caseSpecialisms) : null,
	caseValidationInvalidDetails: caseValidationInvalidDetails
		? JSON.stringify(caseValidationInvalidDetails)
		: null,
	caseValidationIncompleteDetails: caseValidationIncompleteDetails
		? JSON.stringify(caseValidationIncompleteDetails)
		: null,
	lpaQuestionnaireValidationDetails: lpaQuestionnaireValidationDetails
		? JSON.stringify(lpaQuestionnaireValidationDetails)
		: null,
	siteAccessDetails: siteAccessDetails ? JSON.stringify(siteAccessDetails) : null,
	siteSafetyDetails: siteSafetyDetails ? JSON.stringify(siteSafetyDetails) : null,
	// direct mappings
	caseId,
	caseReference,
	caseOfficerId,
	inspectorId,
	allocationLevel,
	allocationBand,
	caseSubmittedDate,
	caseCreatedDate,
	caseUpdatedDate,
	caseValidDate,
	caseValidationDate,
	caseExtensionDate,
	caseStartedDate,
	casePublishedDate,
	lpaQuestionnaireDueDate,
	lpaQuestionnaireSubmittedDate,
	lpaQuestionnaireCreatedDate,
	lpaQuestionnairePublishedDate,
	lpaQuestionnaireValidationOutcomeDate,
	lpaStatement,
	caseWithdrawnDate,
	caseTransferredDate,
	transferredCaseClosedDate,
	caseDecisionOutcomeDate,
	caseDecisionPublishedDate,
	caseCompletedDate,
	enforcementNotice,
	applicationReference,
	applicationDate,
	applicationDecision,
	applicationDecisionDate,
	caseSubmissionDueDate,
	siteAddressLine1,
	siteAddressLine2,
	siteAddressTown,
	siteAddressCounty,
	siteGridReferenceEasting,
	siteGridReferenceNorthing,
	siteAreaSquareMetres,
	floorSpaceSquareMetres,
	isCorrectAppealType,
	isGreenBelt,
	inConservationArea,
	ownsAllLand,
	ownsSomeLand,
	knowsOtherOwners,
	knowsAllOwners,
	advertisedAppeal,
	ownersInformed,
	originalDevelopmentDescription,
	changedDevelopmentDescription,
	newConditionDetails,
	appellantCostsAppliedFor,
	lpaCostsAppliedFor,
	typeOfPlanningApplication,
	reasonForNeighbourVisits
});

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapHASDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel)
});

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapCASPlanningDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	statutoryConsultees: dataModel.hasStatutoryConsultees, // todo: rename
	consultedBodiesDetails: dataModel.consultedBodiesDetails
});

/**
 * @param {AppealHASCase|AppealS78Case} dataModel
 * @returns {{hasLandownersPermission: boolean|undefined|null}}
 */
const getAdvertsAppealFormFields = (dataModel) => {
	return {
		hasLandownersPermission: dataModel.hasLandownersPermission
	};
};

/**
 * @param {AppealHASCase} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const getCASAdvertsLPAQFields = (dataModel) => {
	return {
		scheduledMonument: dataModel.affectsScheduledMonument ?? null, // todo: rename
		protectedSpecies: dataModel.hasProtectedSpecies, // todo: rename
		areaOutstandingBeauty: dataModel.isAonbNationalLandscape, // todo: rename
		designatedSitesNames: dataModel.designatedSitesNames
			? JSON.stringify(dataModel.designatedSitesNames)
			: null,
		statutoryConsultees: dataModel.hasStatutoryConsultees, // todo: rename
		consultedBodiesDetails: dataModel.consultedBodiesDetails,
		lpaProcedurePreference: dataModel.lpaProcedurePreference,
		lpaProcedurePreferenceDetails: dataModel.lpaProcedurePreferenceDetails,
		lpaProcedurePreferenceDuration: dataModel.lpaProcedurePreferenceDuration,
		wasApplicationRefusedDueToHighwayOrTraffic:
			dataModel.wasApplicationRefusedDueToHighwayOrTraffic,
		isSiteInAreaOfSpecialControlAdverts: dataModel.isSiteInAreaOfSpecialControlAdverts,
		didAppellantSubmitCompletePhotosAndPlans: dataModel.didAppellantSubmitCompletePhotosAndPlans
	};
};

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapCASAdvertsDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	...getAdvertsAppealFormFields(dataModel),
	...getCASAdvertsLPAQFields(dataModel)
});

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapAdvertsDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	...getAdvertsAppealFormFields(dataModel),
	...getCASAdvertsLPAQFields(dataModel),
	...mapS78DataModelToAppealCase(caseProcessCode, dataModel)
});

/**
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const getEnforcementAppealFormFields = (dataModel) => {
	return {
		ownerOccupancyStatus: dataModel.ownerOccupancyStatus,
		occupancyConditionsMet: dataModel.occupancyConditionsMet,
		applicationMadeAndFeePaid: dataModel.applicationMadeAndFeePaid,
		retrospectiveApplication: dataModel.retrospectiveApplication,
		groundAFeePaid: dataModel.groundAFeePaid,
		previousPlanningPermissionGranted: dataModel.previousPlanningPermissionGranted,
		issueDateOfEnforcementNotice: dataModel.issueDateOfEnforcementNotice,
		effectiveDateOfEnforcementNotice: dataModel.effectiveDateOfEnforcementNotice,
		didAppellantAppealLpaDecision: dataModel.didAppellantAppealLpaDecision,
		dateLpaDecisionDue: dataModel.dateLpaDecisionDue,
		dateLpaDecisionReceived: dataModel.dateLpaDecisionReceived,
		enforcementReference: dataModel.enforcementNoticeReference,
		descriptionOfAllegedBreach: dataModel.descriptionOfAllegedBreach,
		applicationPartOrWholeDevelopment: dataModel.applicationPartOrWholeDevelopment,
		contactPlanningInspectorateDate: dataModel.dateAppellantContactedPins
	};
};

/**
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const getEnforcementLPAQFields = (dataModel) => {
	return {
		noticeRelatesToBuildingEngineeringMiningOther:
			dataModel.noticeRelatesToBuildingEngineeringMiningOther,
		areaOfAllegedBreachInSquareMetres: dataModel.areaOfAllegedBreachInSquareMetres,
		floorSpaceCreatedByBreachInSquareMetres: dataModel.floorSpaceCreatedByBreachInSquareMetres,
		changeOfUseRefuseOrWaste: dataModel.changeOfUseRefuseOrWaste,
		changeOfUseMineralExtraction: dataModel.changeOfUseMineralExtraction,
		changeOfUseMineralStorage: dataModel.changeOfUseMineralStorage,
		relatesToErectionOfBuildingOrBuildings: dataModel.relatesToErectionOfBuildingOrBuildings,
		relatesToBuildingWithAgriculturalPurpose: dataModel.relatesToBuildingWithAgriculturalPurpose,
		relatesToBuildingSingleDwellingHouse: dataModel.relatesToBuildingSingleDwellingHouse,
		affectedTrunkRoadName: dataModel.affectedTrunkRoadName,
		isSiteOnCrownLand: dataModel.isSiteOnCrownLand,
		article4AffectedDevelopmentRights: dataModel.article4AffectedDevelopmentRights
	};
};

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapEnforcementDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	...getEnforcementAppealFormFields(dataModel),
	...getEnforcementLPAQFields(dataModel),
	...mapS78DataModelToAppealCase(caseProcessCode, dataModel)
});

/**
 * @param {AppealS78Case} dataModel
 * @returns {{siteUseAtTimeOfApplication: string|null|undefined, applicationMadeUnderActSection: string|null|undefined}}
 */
const getLDCAppealFormFields = (dataModel) => {
	return {
		siteUseAtTimeOfApplication: dataModel.siteUseAtTimeOfApplication,
		applicationMadeUnderActSection: dataModel.applicationMadeUnderActSection
	};
};

/**
 * @param {AppealS78Case} dataModel
 * @returns {{appealUnderActSection: string|null|undefined, lpaAppealInvalidReasons: string|null|undefined, lpaConsiderAppealInvalid: boolean|null|undefined}}
 */
const getLDCQuestionnaireFields = (dataModel) => {
	return {
		appealUnderActSection: dataModel.appealUnderActSection,
		lpaAppealInvalidReasons: dataModel.lpaAppealInvalidReasons,
		lpaConsiderAppealInvalid: dataModel.lpaConsiderAppealInvalid
	};
};

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapLDCDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	...mapS78DataModelToAppealCase(caseProcessCode, dataModel),
	...getLDCAppealFormFields(dataModel),
	...getLDCQuestionnaireFields(dataModel)
});

/**
 * @param {AppealS78Case} dataModel
 * @returns {EnforcementListedAppealFormFields}
 */
const getEnforcementListedAppealFormFields = (dataModel) => {
	return {
		ownerOccupancyStatus: dataModel.ownerOccupancyStatus,
		issueDateOfEnforcementNotice: dataModel.issueDateOfEnforcementNotice,
		effectiveDateOfEnforcementNotice: dataModel.effectiveDateOfEnforcementNotice,
		enforcementReference: dataModel.enforcementNoticeReference,
		descriptionOfAllegedBreach: dataModel.descriptionOfAllegedBreach,
		contactPlanningInspectorateDate: dataModel.dateAppellantContactedPins
	};
};

/**
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const getEnforcementListedLPAQFields = (dataModel) => {
	return {
		noticeRelatesToBuildingEngineeringMiningOther:
			dataModel.noticeRelatesToBuildingEngineeringMiningOther,
		areaOfAllegedBreachInSquareMetres: dataModel.areaOfAllegedBreachInSquareMetres,
		floorSpaceCreatedByBreachInSquareMetres: dataModel.floorSpaceCreatedByBreachInSquareMetres,
		relatesToErectionOfBuildingOrBuildings: dataModel.relatesToErectionOfBuildingOrBuildings,
		relatesToBuildingWithAgriculturalPurpose: dataModel.relatesToBuildingWithAgriculturalPurpose,
		relatesToBuildingSingleDwellingHouse: dataModel.relatesToBuildingSingleDwellingHouse
	};
};

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapEnforcementListedDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	...getEnforcementListedAppealFormFields(dataModel),
	...getEnforcementListedLPAQFields(dataModel),
	...mapS78DataModelToAppealCase(caseProcessCode, dataModel)
});

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapS78DataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapCommonDataModelToAppealCase(caseProcessCode, dataModel),
	agriculturalHolding: dataModel.agriculturalHolding,
	tenantAgriculturalHolding: dataModel.tenantAgriculturalHolding,
	otherTenantsAgriculturalHolding: dataModel.otherTenantsAgriculturalHolding,
	informedTenantsAgriculturalHolding: dataModel.informedTenantsAgriculturalHolding,
	appellantProcedurePreference: dataModel.appellantProcedurePreference,
	appellantProcedurePreferenceDetails: dataModel.appellantProcedurePreferenceDetails,
	appellantProcedurePreferenceDuration: dataModel.appellantProcedurePreferenceDuration,
	appellantProcedurePreferenceWitnessCount: dataModel.appellantProcedurePreferenceWitnessCount,
	statusPlanningObligation: dataModel.statusPlanningObligation,
	scheduledMonument: dataModel.affectsScheduledMonument ?? null, // todo: rename
	protectedSpecies: dataModel.hasProtectedSpecies, // todo: rename
	areaOutstandingBeauty: dataModel.isAonbNationalLandscape, // todo: rename
	designatedSitesNames: dataModel.designatedSitesNames
		? JSON.stringify(dataModel.designatedSitesNames)
		: null,
	gypsyTraveller: dataModel.isGypsyOrTravellerSite, // todo: rename
	publicRightOfWay: dataModel.isPublicRightOfWay, // todo: rename
	environmentalImpactSchedule: dataModel.eiaEnvironmentalImpactSchedule, // todo: rename
	developmentDescription: dataModel.eiaDevelopmentDescription, // todo: rename
	sensitiveAreaDetails: dataModel.eiaSensitiveAreaDetails, // todo: rename
	columnTwoThreshold: dataModel.eiaColumnTwoThreshold, // todo: rename
	screeningOpinion: dataModel.eiaScreeningOpinion, // todo: rename
	requiresEnvironmentalStatement: dataModel.eiaRequiresEnvironmentalStatement, // todo: rename
	completedEnvironmentalStatement: dataModel.eiaCompletedEnvironmentalStatement, // todo: rename
	statutoryConsultees: dataModel.hasStatutoryConsultees, // todo: rename
	consultedBodiesDetails: dataModel.consultedBodiesDetails,
	infrastructureLevy: dataModel.hasInfrastructureLevy, // todo: rename
	infrastructureLevyAdopted: dataModel.isInfrastructureLevyFormallyAdopted, // todo: rename
	infrastructureLevyAdoptedDate: dataModel.infrastructureLevyAdoptedDate,
	infrastructureLevyExpectedDate: dataModel.infrastructureLevyExpectedDate,
	lpaProcedurePreference: dataModel.lpaProcedurePreference,
	lpaProcedurePreferenceDetails: dataModel.lpaProcedurePreferenceDetails,
	lpaProcedurePreferenceDuration: dataModel.lpaProcedurePreferenceDuration,
	caseworkReason: dataModel.caseworkReason,
	developmentType: dataModel.developmentType,
	importantInformation: dataModel.importantInformation,
	jurisdiction: dataModel.jurisdiction,
	redeterminedIndicator: dataModel.redeterminedIndicator,
	dateCostsReportDespatched: dataModel.dateCostsReportDespatched,
	dateNotRecoveredOrDerecovered: dataModel.dateNotRecoveredOrDerecovered,
	dateRecovered: dataModel.dateRecovered,
	originalCaseDecisionDate: dataModel.originalCaseDecisionDate,
	targetDate: dataModel.targetDate,
	appellantCommentsSubmittedDate: dataModel.appellantCommentsSubmittedDate,
	appellantStatementSubmittedDate: dataModel.appellantStatementSubmittedDate,
	finalCommentsDueDate: dataModel.finalCommentsDueDate,
	interestedPartyRepsDueDate: dataModel.interestedPartyRepsDueDate,
	LPACommentsSubmittedDate: dataModel.lpaCommentsSubmittedDate,
	LPAProofsSubmittedDate: dataModel.lpaProofsSubmittedDate,
	LPAStatementSubmittedDate: dataModel.lpaStatementSubmittedDate,
	proofsOfEvidenceDueDate: dataModel.proofsOfEvidenceDueDate,
	siteNoticesSentDate: dataModel.siteNoticesSentDate,
	statementDueDate: dataModel.statementDueDate,
	numberOfResidencesNetChange: dataModel.numberOfResidencesNetChange,
	siteGridReferenceEasting: dataModel.siteGridReferenceEasting,
	siteGridReferenceNorthing: dataModel.siteGridReferenceNorthing,
	siteViewableFromRoad: dataModel.siteViewableFromRoad,
	siteWithinSSSI: dataModel.siteWithinSSSI,
	//s78 expedited fields
	reasonForAppealAppellant: dataModel.reasonForAppealAppellant,
	screeningOpinionIndicatesEiaRequired: dataModel.screeningOpinionIndicatesEiaRequired,
	anySignificantChanges:
		dataModel.significantChangesAffectingApplicationAppellant
			?.map((/** @type {any} */ c) => c.value)
			.join(',') || null,
	anySignificantChanges_otherSignificantChanges:
		dataModel.significantChangesAffectingApplicationAppellant?.find(
			(/** @type {any} */ c) => c.value === 'other'
		)?.comment || null,
	anySignificantChanges_localPlanSignificantChanges:
		dataModel.significantChangesAffectingApplicationAppellant?.find(
			(/** @type {any} */ c) => c.value === 'adopted-a-new-local-plan'
		)?.comment || null,
	anySignificantChanges_nationalPolicySignificantChanges:
		dataModel.significantChangesAffectingApplicationAppellant?.find(
			(/** @type {any} */ c) => c.value === 'national-policy-change'
		)?.comment || null,
	anySignificantChanges_courtJudgementSignificantChanges:
		dataModel.significantChangesAffectingApplicationAppellant?.find(
			(/** @type {any} */ c) => c.value === 'court-judgement'
		)?.comment || null,
	// s20 specific fields
	preserveGrantLoan: dataModel.preserveGrantLoan,
	consultHistoricEngland: dataModel.consultHistoricEngland
});

/**
 * Get an appeal case and appellant by case reference
 *
 * @param {string} caseReference
 * @param {AppealS78Case|AppealHASCase} data
 * @returns {Promise<AppealCase>}
 */
async function putCase(caseReference, data) {
	try {
		const mappedData = getMappedData(data);
		const result = await repo.putByCaseReference({
			caseReference,
			submissionId: data.submissionId,
			mappedData
		});
		await repo.putRelationsByCaseReference(caseReference, {
			leadCaseReference: data.leadCaseReference,
			nearbyCaseReferences: data.nearbyCaseReferences,
			affectedListedBuildingNumbers: data.affectedListedBuildingNumbers,
			changedListedBuildingNumbers: data.changedListedBuildingNumbers,
			notificationMethod: data.notificationMethod,
			neighbouringSiteAddresses: data.neighbouringSiteAddresses,
			advertDetails: data.advertDetails,
			enforcementAppealGroundsDetails: data.enforcementAppealGroundsDetails,
			applicationElbAppealGroundsDetails: data.applicationElbAppealGroundsDetails
		});

		// send emails confirming appeal to user and lpa if this creates a new appeal
		if (!result.exists && result.appellantSubmission) {
			const email = await repo.getAppealUserEmailAddress(caseReference);

			try {
				await sendSubmissionReceivedEmailToLpaV2(result.appealCase, result.appellantSubmission);
			} catch (err) {
				logger.error({ err }, 'failed to sendSubmissionReceivedEmailToLpaV2');
			}

			if (!email) {
				throw Error(`no user email associated with: ${caseReference}`);
			}
			await sendSubmissionConfirmationEmailToAppellantV2(
				result.appealCase,
				result.appellantSubmission,
				email
			);
		}

		return result.appealCase;
	} catch (err) {
		if (err instanceof Prisma.PrismaClientValidationError) {
			throw ApiError.badRequest(err.message);
		}
		throw err;
	}
}

/**
 * @param {AppealS78Case|AppealHASCase} data
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const getMappedData = (data) => {
	switch (data.caseType) {
		case CASE_TYPES.HAS.key: {
			const hasValidator = getValidator('appeal-has');
			if (!hasValidator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapHASDataModelToAppealCase(CASE_TYPES.HAS.processCode, data);
		}
		case CASE_TYPES.CAS_PLANNING.key: {
			const hasValidator = getValidator('appeal-has');
			if (!hasValidator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapCASPlanningDataModelToAppealCase(CASE_TYPES.CAS_PLANNING.processCode, data);
		}
		case CASE_TYPES.S78.key: {
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapS78DataModelToAppealCase(CASE_TYPES.S78.processCode, data);
		}
		case CASE_TYPES.S20.key: {
			// uses s78 data model
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapS78DataModelToAppealCase(CASE_TYPES.S20.processCode, data);
		}
		case CASE_TYPES.CAS_ADVERTS.key: {
			// uses has data model
			const hasValidator = getValidator('appeal-has');
			if (!hasValidator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapCASAdvertsDataModelToAppealCase(CASE_TYPES.CAS_ADVERTS.processCode, data);
		}
		case CASE_TYPES.ADVERTS.key: {
			// uses s78 data model
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapAdvertsDataModelToAppealCase(CASE_TYPES.ADVERTS.processCode, data);
		}
		case CASE_TYPES.ENFORCEMENT.key: {
			// uses s78 data model
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapEnforcementDataModelToAppealCase(CASE_TYPES.ENFORCEMENT.processCode, data);
		}
		case CASE_TYPES.LDC.key: {
			// uses s78 data model
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapLDCDataModelToAppealCase(CASE_TYPES.LDC.processCode, data);
		}
		case CASE_TYPES.ENFORCEMENT_LISTED.key: {
			// uses s78 data model
			const s78Validator = getValidator('appeal-s78');
			if (!s78Validator(data)) throw ApiError.badRequest('Payload was invalid');
			return mapEnforcementListedDataModelToAppealCase(
				CASE_TYPES.ENFORCEMENT_LISTED.processCode,
				data
			);
		}
		default:
			throw Error(`putCase: unhandled casetype: ${data.caseType}`);
	}
};

/**
 * List cases for an LPA
 *
 * @param {Object} options
 * @param {string} options.lpaCode
 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
 * @param {boolean} options.withAppellant - if true, include the appellant if available
 * @param {string} [options.caseStatus] - only cases in specified status will be returned
 * @returns {Promise<AppealCaseDetailed[]>}
 */
async function listByLpaCodeWithAppellant(options) {
	const appeals = await repo.listByLpaCode(options);

	if (options.withAppellant) {
		await appendAppellantAndAgentForMultiple(appeals);
	}

	const enhancedAppeals = await appendLinkedCasesForMultipleAppeals(appeals);

	return enhancedAppeals;
}

/**
 * List cases by postcode
 *
 * @param {Object} options
 * @param {string} options.sanitizedPostcode
 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
 * @param {boolean} options.withAppellant - if true, include the appellant if available
 * @returns {Promise<AppealCaseDetailed[]>}
 */
async function listByPostcodeWithAppellant(options) {
	const appeals = await repo.listByPostCode(options);

	if (options.withAppellant) {
		await appendAppellantAndAgentForMultiple(appeals);
	}

	return appeals;
}

/**
 * Add the service users to an appeal if there are any.
 *
 * @param {AppealCase} appeal
 * @returns {Promise<AppealCase & {users?: Array.<ServiceUser>}>}
 */
async function appendAppellantAndAgent(appeal) {
	// find appeal users by roles
	const serviceUsers = await serviceUserRepo.getForCaseAndType(appeal.caseReference, [
		ServiceUserType.Appellant,
		ServiceUserType.Agent
	]);
	if (!serviceUsers) {
		return appeal;
	}
	appeal.users = serviceUsers;
	return appeal;
}

/**
 * Add the service users to an appeal if there are any
 * side effect on data passed in
 *
 * @param {AppealCase[]} appeals
 * @returns {Promise<AppealCase[] & {users?: Array.<ServiceUser>}>}
 */
async function appendAppellantAndAgentForMultiple(appeals) {
	if (!appeals || !appeals.length) {
		return appeals;
	}

	// find appeal users by roles
	const caseReferences = appeals.map((appeal) => appeal.caseReference);
	const allServiceUsers = await serviceUserRepo.getServiceUsersForMultipleCases(
		caseReferences,
		{
			firstName: true,
			lastName: true,
			emailAddress: true,
			organisation: true,
			telephoneNumber: true,
			serviceUserType: true,
			id: true,
			addressLine1: true,
			addressLine2: true,
			addressTown: true,
			postcode: true,
			caseReference: true
		},
		[ServiceUserType.Appellant, ServiceUserType.Agent]
	);

	const usersByCase = new Map();

	for (const user of allServiceUsers) {
		const list = usersByCase.get(user.caseReference) || [];
		list.push(user);
		usersByCase.set(user.caseReference, list);
	}

	for (const appeal of appeals) {
		appeal.users = usersByCase.get(appeal.caseReference) || [];
	}

	return appeals;
}

/**
 * Add the relations to an appeal.
 *
 * @param {AppealCase} appeal
 * @returns {Promise<AppealCase & {relations?: Array.<AppealRelations>} & {submissionLinkedCases?: Array.<SubmissionLinkedCase>}>}
 */
async function appendAppealRelations(appeal) {
	const relations = await repo.getRelatedCases({ caseReference: appeal.caseReference });
	if (!relations || !relations.length) {
		return appeal;
	}
	appeal.relations = relations;

	// get relations from submissions
	const subs = await repo.getSubmissionsForAppeal({ appealId: appeal.appealId });
	appeal.submissionLinkedCases = await repo.getSubmissionLinkedCasesForAppeal({
		appealSubmissionId: subs?.AppellantSubmission?.id,
		lpaQuestionnaireSubmissionId: subs?.AppealCase?.LPAQuestionnaireSubmission?.id
	});
	return appeal;
}

/**
 * Add linked cases to a single appeal.
 *
 * @param {AppealCase} appeal
 * @returns {Promise<AppealCaseDetailed>}>}
 */
async function appendLinkedCases(appeal) {
	const linkedCases = await repo.getLinkedCases(appeal.caseReference);
	if (!linkedCases || !linkedCases.length) {
		return appeal;
	}
	const enhancedAppeal = {
		...appeal,
		linkedCases
	};

	return enhancedAppeal;
}

/**
 * Add linked cases to individual cases within an array of appeals.
 *
 * @param {AppealCase[]} appeals
 * @returns {Promise<AppealCaseDetailed[]>}>}
 */
async function appendLinkedCasesForMultipleAppeals(appeals) {
	const caseReferences = appeals.map((appealCase) => appealCase.caseReference);
	const linkedCases = await batchGetLinkedCases(caseReferences, 500);

	if (!linkedCases || !linkedCases.length) {
		return appeals;
	}

	const { leadCases, childCases } = linkedCases.reduce(
		(acc, linkedCase) => {
			acc.childCases.add(linkedCase.childCaseReference);
			acc.leadCases.add(linkedCase.leadCaseReference);
			return acc;
		},
		{ leadCases: new Set(), childCases: new Set() }
	);

	// todo - add check to make sure all lead cases are in cases - will need for pagination

	const enhancedCases = appeals.map((appealCase) => {
		if (leadCases.has(appealCase.caseReference)) {
			return {
				...appealCase,
				linkedCases: linkedCases.filter(
					(linkedCase) => linkedCase.leadCaseReference === appealCase.caseReference
				)
			};
		} else if (childCases.has(appealCase.caseReference)) {
			return {
				...appealCase,
				linkedCases: linkedCases.filter(
					(linkedCase) => linkedCase.childCaseReference === appealCase.caseReference
				)
			};
		}
		return appealCase;
	});

	return enhancedCases;
}

/**
 * @param {string[]} caseReferences
 * @param {number} batchSize
 * @returns {Promise<LinkedCase[]>}>}
 */
async function batchGetLinkedCases(caseReferences, batchSize) {
	const MAX_CONCURRENT = 3;
	const batches = chunkArray(caseReferences, batchSize);
	return runBatchWithPromise(batches, MAX_CONCURRENT, (batch) => {
		return repo.getLinkedCases(batch);
	});
}

module.exports = {
	getCaseAndAppellant,
	putCase,
	listByLpaCodeWithAppellant,
	listByPostcodeWithAppellant,
	appendAppellantAndAgent,
	appendAppealRelations,
	appendLinkedCases,
	appendLinkedCasesForMultipleAppeals,
	parseJSONFields
};
