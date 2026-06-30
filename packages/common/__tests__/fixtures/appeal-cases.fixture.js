const { randomUUID } = require('node:crypto');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_CASE_DECISION_OUTCOME
} = require('@planning-inspectorate/data-model');

const generateRandomCaseReference = () => {
	return `6${Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, '0')}`;
};

/**
 * @param {string} appealTypeCode
 * @param {string} caseStatus
 * @param {string} caseProcedure
 */
exports.getCaseFixture = (appealTypeCode, caseStatus, caseProcedure) => {
	const caseFixture = new CaseFixture(appealTypeCode, caseStatus, caseProcedure);
	return caseFixture;
};

class CaseFixture {
	/**
	 * @param {string} appealTypeCode
	 * @param {string} caseStatus
	 * @param {string} caseProcedure
	 */
	constructor(appealTypeCode, caseStatus, caseProcedure) {
		const caseRef = generateRandomCaseReference();
		this.id = randomUUID();
		this.appealId = randomUUID();
		this.caseReference = caseRef;
		this.caseId = Number(caseRef) - 6000000;
		this.appealTypeCode = appealTypeCode;
		this.caseStatus = caseStatus;
		this.caseProcedure = caseProcedure;
	}

	/** @param {string} outcome @param {Date} [date] */
	setValidationOutcome(outcome, date) {
		this.caseValidationOutcome = outcome;
		this.caseValidationOutcomeDate = date || new Date();
		this.caseValidationDate = date || new Date();
		this.caseStatus =
			outcome === APPEAL_CASE_VALIDATION_OUTCOME.INVALID
				? APPEAL_CASE_STATUS.INVALID
				: this.caseStatus;
		return this;
	}

	/** @param {string} outcome @param {boolean} [published] */
	setDecisionOutcome(outcome, published) {
		this.caseDecisionOutcome = outcome;
		this.caseDecisionOutcomeDate = new Date();

		if (published) {
			this.caseDecisionOutcomePublishedDate = new Date();
		}

		if (this.caseDecisionOutcome === APPEAL_CASE_DECISION_OUTCOME.INVALID) {
			this.caseStatus = APPEAL_CASE_STATUS.INVALID;
		}

		return this;
	}

	markAsWithdrawn() {
		this.caseWithdrawnDate = new Date();
		this.caseStatus = APPEAL_CASE_STATUS.WITHDRAWN;
		return this;
	}

	//***************************************************************************
	// general case fields
	//***************************************************************************

	LPACode = 'Q9999';
	appealTypeCode = null;
	caseStatus = null;
	caseProcedure = null;

	applicationReference = null;
	applicationDecision = null;
	applicationDate = null;
	applicationDecisionDate = null;
	caseSubmissionDueDate = null;
	enforcementNotice = null;
	developmentType = null;
	typeOfPlanningApplication = null;

	isGreenBelt = null;
	inConservationArea = null;
	scheduledMonument = null;
	protectedSpecies = null;
	areaOutstandingBeauty = null;
	gypsyTraveller = null;
	publicRightOfWay = null;

	//***************************************************************************
	// site details
	//***************************************************************************

	siteAddressLine1 = null;
	siteAddressLine2 = null;
	siteAddressTown = null;
	siteAddressCounty = null;
	siteAddressPostcode = null;
	siteAddressPostcodeSanitized = null;
	siteAccessDetails = null;
	siteSafetyDetails = null;
	siteAreaSquareMetres = null;
	floorSpaceSquareMetres = null;
	siteGridReferenceEasting = null;
	siteGridReferenceNorthing = null;

	//***************************************************************************
	// Appellant fields
	//***************************************************************************

	appellantCostsAppliedFor = null;
	originalDevelopmentDescription = null;
	statusPlanningObligation = null;

	ownsAllLand = null;
	ownsSomeLand = null;
	knowsOtherOwners = null;
	knowsAllOwners = null;
	advertisedAppeal = null;
	ownersInformed = null;

	agriculturalHolding = null;
	tenantAgriculturalHolding = null;
	otherTenantsAgriculturalHolding = null;
	informedTenantsAgriculturalHolding = null;

	appellantProcedurePreference = null;
	appellantProcedurePreferenceDetails = null;
	appellantProcedurePreferenceDuration = null;
	appellantProcedurePreferenceWitnessCount = null;

	//***************************************************************************
	// LPA fields
	//***************************************************************************

	isCorrectAppealType = null;
	lpaCostsAppliedFor = null;
	changedDevelopmentDescription = null;
	newConditionDetails = null;

	lpaStatement = null;
	lpaProcedurePreference = null;
	lpaProcedurePreferenceDetails = null;
	lpaProcedurePreferenceDuration = null;

	statutoryConsultees = null;
	consultedBodiesDetails = null;

	reasonForNeighbourVisits = null;

	designatedSitesNames = null;
	listOfDocumentsBeforeDecision = null;

	//***************************************************************************
	// Environmental Impact Assesement fields
	//***************************************************************************

	environmentalImpactSchedule = null;
	developmentDescription = null;
	sensitiveAreaDetails = null;
	columnTwoThreshold = null;
	screeningOpinion = null;
	requiresEnvironmentalStatement = null;
	completedEnvironmentalStatement = null;

	//***************************************************************************
	// Infrastructure levy fields
	//***************************************************************************

	infrastructureLevy = null;
	infrastructureLevyAdopted = null;
	infrastructureLevyAdoptedDate = null;
	infrastructureLevyExpectedDate = null;

	//***************************************************************************
	// PINS provided details
	//***************************************************************************

	caseDecisionOutcome = null;
	caseValidationOutcome = null;
	lpaQuestionnaireValidationOutcome = null;

	// JSON arrays
	caseValidationInvalidDetails = null;
	caseValidationIncompleteDetails = null;
	lpaQuestionnaireValidationDetails = null;

	// (unexpected FO will need to use the following PINs info)
	caseSpecialisms = null;
	caseOfficerId = null;
	inspectorId = null;
	allocationLevel = null;
	allocationBand = null;

	//***************************************************************************
	// system dates
	//***************************************************************************

	// case dates
	caseSubmittedDate = new Date();
	caseCreatedDate = new Date();
	caseUpdatedDate = null;
	caseValidDate = null;
	caseValidationDate = null;
	caseExtensionDate = null;
	caseStartedDate = null;
	casePublishedDate = null;
	caseWithdrawnDate = null;
	caseTransferredDate = null;
	transferredCaseClosedDate = null;
	caseDecisionOutcomeDate = null;
	caseDecisionPublishedDate = null;
	caseCompletedDate = null;

	// lpaq dates
	lpaQuestionnaireDueDate = null;
	lpaQuestionnaireSubmittedDate = null;
	lpaQuestionnaireCreatedDate = null;
	lpaQuestionnairePublishedDate = null;
	lpaQuestionnaireValidationOutcomeDate = null;

	// statements
	statementDueDate = null;
	appellantStatementSubmittedDate = null;
	LPAStatementSubmittedDate = null;

	// final comments
	finalCommentsDueDate = null;
	appellantCommentsSubmittedDate = null;
	LPACommentsSubmittedDate = null;

	// IP dates
	interestedPartyRepsDueDate = null;

	// proofs of evidence
	proofsOfEvidenceDueDate = null;
	LPAProofsSubmittedDate = null;
	appellantProofsSubmittedDate = null;

	//***************************************************************************
	// s78 fields
	//***************************************************************************

	siteWithinSSSI = null; // SSSI is an option for designatedSites
	siteViewableFromRoad = null;
	caseworkReason = null;
	importantInformation = null;
	jurisdiction = null;
	redeterminedIndicator = null;
	numberOfResidencesNetChange = null;
	// consistent naming for date fields?
	dateNotRecoveredOrDerecovered = null;
	dateRecovered = null;
	originalCaseDecisionDate = null;
	targetDate = null;
	siteNoticesSentDate = null;
	dateCostsReportDespatched = null;
	reasonForAppealAppellant = null;
	screeningOpinionIndicatesEiaRequired = null;
	anySignificantChanges = null;
	anySignificantChanges_otherSignificantChanges = null;
	anySignificantChanges_localPlanSignificantChanges = null;
	anySignificantChanges_nationalPolicySignificantChanges = null;
	anySignificantChanges_courtJudgementSignificantChanges = null;

	//***************************************************************************
	// s20 fields
	//***************************************************************************
	preserveGrantLoan = null;
	consultHistoricEngland = null;

	//***************************************************************************
	// Adverts fields
	//***************************************************************************
	hasLandownersPermission = null;

	wasApplicationRefusedDueToHighwayOrTraffic = null;
	isSiteInAreaOfSpecialControlAdverts = null;
	didAppellantSubmitCompletePhotosAndPlans = null;

	//***************************************************************************
	// enforcement fields
	//***************************************************************************
	ownerOccupancyStatus = null;
	occupancyConditionsMet = null;
	applicationMadeAndFeePaid = null;
	retrospectiveApplication = null;
	groundAFeePaid = null;
	previousPlanningPermissionGranted = null;
	issueDateOfEnforcementNotice = null;
	effectiveDateOfEnforcementNotice = null;
	didAppellantAppealLpaDecision = null;
	dateLpaDecisionDue = null;
	dateLpaDecisionReceived = null;
	enforcementReference = null;
	descriptionOfAllegedBreach = null;
	applicationPartOrWholeDevelopment = null;
	contactPlanningInspectorateDate = null;

	// LPAQ fields
	noticeRelatesToBuildingEngineeringMiningOther = null;
	areaOfAllegedBreachInSquareMetres = null;
	floorSpaceCreatedByBreachInSquareMetres = null;
	changeOfUseRefuseOrWaste = null;
	changeOfUseMineralExtraction = null;
	changeOfUseMineralStorage = null;
	relatesToErectionOfBuildingOrBuildings = null;
	relatesToBuildingWithAgriculturalPurpose = null;
	relatesToBuildingSingleDwellingHouse = null;
	affectedTrunkRoadName = null;
	isSiteOnCrownLand = null;
	article4AffectedDevelopmentRights = null;
	anySignificantChangesLpa = null;
	anySignificantChangesLpa_otherSignificantChanges = null;
	anySignificantChangesLpa_localPlanSignificantChanges = null;
	anySignificantChangesLpa_nationalPolicySignificantChanges = null;
	anySignificantChangesLpa_courtJudgementSignificantChanges = null;
	//***************************************************************************
	// LDC fields
	//***************************************************************************
	applicationMadeUnderActSection = null;
	siteUseAtTimeOfApplication = null;
	appealUnderActSection = null;
	lpaConsiderAppealInvalid = null;
	lpaAppealInvalidReasons = null;
}
