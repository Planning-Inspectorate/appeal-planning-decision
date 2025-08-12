const {
	ServiceUserRepository,
	ServiceUserType
} = require('#repositories/sql/service-user-repository');
const { AppealCaseRepository } = require('./repo');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { sendSubmissionConfirmationEmailToAppellantV2 } = require('#lib/notify');
const sanitizePostcode = require('#lib/sanitize-postcode');

const repo = new AppealCaseRepository();
const serviceUserRepo = new ServiceUserRepository();
const { SchemaValidator } = require('../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();

/**
 * @template Payload
 * @typedef {import('../../../services/back-office-v2/validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import('@prisma/client').Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import("@prisma/client").ServiceUser} ServiceUser
 * @typedef {import("@prisma/client").AppealCaseRelationship} AppealRelations
 * @typedef {import("@prisma/client").SubmissionLinkedCase} SubmissionLinkedCase
 * @typedef {AppealCase & {users?: Array.<ServiceUser>} & {relations?: Array.<AppealRelations>}} AppealCaseDetailed
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealHASCase} AppealHASCase
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealS78Case} AppealS78Case
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
 * Get an appeal case and appellant by case reference
 *
 * @param {object} opts
 * @param {string} opts.caseReference
 * @returns {Promise<AppealCaseDetailed|null>}
 */
async function getCaseAndAppellant(opts) {
	let appeal = await repo.getByCaseReference(opts);

	if (!appeal) {
		return null;
	}

	appeal = await appendAppellantAndAgent(appeal);
	appeal = await appendAppealRelations(appeal);

	return parseJSONFields(appeal);
}

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase|AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapHASDataModelToAppealCase = (
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
		typeOfPlanningApplication
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
	typeOfPlanningApplication
});

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapCASPlanningDataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapHASDataModelToAppealCase(caseProcessCode, dataModel),
	statutoryConsultees: dataModel.hasStatutoryConsultees, // todo: rename
	consultedBodiesDetails: dataModel.consultedBodiesDetails
});

/**
 * @param {String} caseProcessCode
 * @param {AppealS78Case} dataModel
 * @returns {Omit<AppealCaseCreateInput, 'Appeal'>}
 */
const mapS78DataModelToAppealCase = (caseProcessCode, dataModel) => ({
	...mapHASDataModelToAppealCase(caseProcessCode, dataModel),
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
	reasonForNeighbourVisits: dataModel.reasonForNeighbourVisits,
	numberOfResidencesNetChange: dataModel.numberOfResidencesNetChange,
	siteGridReferenceEasting: dataModel.siteGridReferenceEasting,
	siteGridReferenceNorthing: dataModel.siteGridReferenceNorthing,
	siteViewableFromRoad: dataModel.siteViewableFromRoad,
	siteWithinSSSI: dataModel.siteWithinSSSI,
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

			neighbouringSiteAddresses: data.neighbouringSiteAddresses
		});

		// send email confirming appeal to user if this creates a new appeal
		if (!result.exists && result.appellantSubmission) {
			const email = await repo.getAppealUserEmailAddress(caseReference);

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
		if (err instanceof PrismaClientValidationError) {
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
			return mapCASPlanningDataModelToAppealCase(CASE_TYPES.S20.processCode, data);
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
		await Promise.all(appeals.map(appendAppellantAndAgent));
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
		await Promise.all(appeals.map(appendAppellantAndAgent));
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
	const linkedCases = await repo.getLinkedCases(caseReferences);

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
 * Add linked cases to individual cases within an array of appeals.
 *
 * @param {AppealCase[]} appeals
 * @returns {Promise<AppealCaseDetailed[]>}>}
 */
async function appendLinkedCasesForMultipleAppeals(appeals) {
	const caseReferences = appeals.map((appealCase) => appealCase.caseReference);
	const linkedCases = await repo.getLinkedCases(caseReferences);

	if (!linkedCases || !linkedCases.length) {
		return appeals;
	}

	const { leadCases, childCases } = linkedCases.reduce(
		(acc, linkedCase) => {
			acc.childCases.add(linkedCase.caseReference);
			acc.leadCases.add(linkedCase.caseReference2);
			return acc;
		},
		{ leadCases: new Set(), childCases: new Set() }
	);

	// todo - add check to make sure all lead cases are in cases - will need for pagination

	const enhancedCases = appeals.map((appealCase) => {
		if (leadCases.has(appealCase.caseReference)) {
			appealCase.linkedCases = linkedCases.filter(
				(linkedCase) => linkedCase.caseReference2 === appealCase.caseReference
			);
			return appealCase;
		} else if (childCases.has(appealCase.caseReference)) {
			appealCase.linkedCases = linkedCases.filter(
				(linkedCase) => linkedCase.caseReference === appealCase.caseReference
			);
			return appealCase;
		}
		return appealCase;
	});

	return enhancedCases;
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
