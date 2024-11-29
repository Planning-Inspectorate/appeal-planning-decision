// const { APPEAL_CASE_STATUS } = require("pins-data-model")
// const { pickRandom, datesNMonthsAhead, datesNMonthsAgo } = require("../util")

// const templateAppealCaseData = [

// All appealCases will have:

// 	{
// 		Appeal: {
// 			connect: { id: lpaAppealIds.appealOne }
// 		},
// 		caseReference: '0000000',

// 		LPACode: 'Q9999',

// 		CaseType: { connect: { processCode: 'HAS' } },
// 		CaseStatus: {
// 			connect: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE }
// 		},
// 		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.HEARING } },

// 		applicationReference: '12/2323232/PLA',
// 		applicationDecision: 'refused',
// 		applicationDate: pickRandom(datesNMonthsAgo(2)),
// 		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
// 		caseSubmissionDueDate: pickRandom(datesNMonthsAhead(1)),

// 		isGreenBelt
// 		inConservationArea
// 		enforcementNotice

// 		siteAddressLine1
//   	siteAddressLine2
//   	siteAddressTown
//   	siteAddressCounty
//   	siteAddressPostcode
//   	siteAddressPostcodeSanitized

//   	siteAccessDetails
//   	siteSafetyDetails

//   	siteAreaSquareMetres
//   	floorSpaceSquareMetres

// 		appellantCostsAppliedFor: false,

// 		ownsAllLand
// 		ownsSomeLand
// 		knowsOtherOwners
// 		knowsAllOwners
// 		advertisedAppeal
// 		ownersInformed
// 		originalDevelopmentDescription

// 		isCorrectAppealType
// 		lpaCostsAppliedFor
// 		changedDevelopmentDescription
// 		newConditionDetails
// 		lpaStatement

// 		CaseDecisionOutcome
// 		CaseValidationOutcome
// 		LPAQuestionnaireValidationOutcome

// 		caseValidationInvalidDetails
// 		caseValidationIncompleteDetails
// 		lpaQuestionnaireValidationDetails

// 		//FO probably wont need
// 		caseSpecialisms
// 		caseOfficerId
// 		inspectorId
// 		allocationLevel
// 		allocationBand

// 		caseSubmittedDate         DateTime /// The date the appeal was submitted by the appellant, i.e. submit on FO
//   	caseCreatedDate           DateTime /// The date the appeal was received, i.e. received from FO in BO
//   	caseUpdatedDate           DateTime? /// The date the appeal was last updated in the back-office
//   	caseValidDate             DateTime? /// The date since when the appeal was considered valid
//   	caseValidationDate        DateTime? /// The date the appeal was validated in the back-office
//   	caseExtensionDate         DateTime? /// When the validation outcome is incomplete, an extension may be granted to provide missing information
//   	caseStartedDate           DateTime? /// A date indicating when the case was started, resulting in the creation of a timetable
//   	casePublishedDate         DateTime? /// A date indicating when the case was published
//   	caseWithdrawnDate         DateTime? /// The date the appeal was withdrawn by the appellant
//   	caseTransferredDate       DateTime? /// The date the appeal was transferred to a new case of a different type
//   	transferredCaseClosedDate DateTime? /// The date the appeal was closed and the appellant requested to resubmit
//   	caseDecisionOutcomeDate   DateTime? /// The date of the appeal decision
//   	caseDecisionPublishedDate DateTime? /// The date the appeal decision was published (this is always null currently for HAS)
//   	caseCompletedDate         DateTime? /// The date the appeal decision letter

//   	// lpaq dates
//   	lpaQuestionnaireDueDate               DateTime? /// If the case is started and has a timetable, a deadline for the LPA to provide a response
//   	lpaQuestionnaireSubmittedDate         DateTime? /// The date the LPA provided a response to the case
//   	lpaQuestionnaireCreatedDate           DateTime? /// The date the LPA response was received
//   	lpaQuestionnairePublishedDate         DateTime? /// The date indicating when the questionnaire review was completed and the questionnaire published
//   	lpaQuestionnaireValidationOutcomeDate DateTime? /// The date the LPA response was validated

//   //***************************************************************************
//   // s78 fields - remove or rename to align with data model once created
//   //***************************************************************************

//   // IP dates
//   interestedPartyRepsDueDate DateTime?

//   // statement
//   statementDueDate            DateTime?
//   appellantStatementForwarded DateTime?
//   appellantStatementSubmitted DateTime?
//   LPAStatementForwarded       DateTime?
//   LPAStatementSubmitted       DateTime?

//   // comments
//   finalCommentsDueDate         DateTime?
//   appellantCommentsForwarded   DateTime?
//   appellantCommentsSubmitted   DateTime?
//   LPACommentsForwarded         DateTime?
//   LPACommentsSubmitted         DateTime?
//   appellantFinalCommentDetails String?

//   // proofs of evidence
//   proofsOfEvidenceDueDate   DateTime?
//   appellantsProofsForwarded DateTime?
//   appellantsProofsSubmitted DateTime?
//   LPAProofsForwarded        DateTime?
//   LPAProofsSubmitted        DateTime?

//   scheduledMonument               Boolean @default(false)
//   appellantProofEvidencePublished Boolean @default(false) // todo: use date instead?
//   appellantFinalCommentsSubmitted Boolean @default(false) // todo: use date instead?
//   lpaStatementPublished           Boolean @default(false) // todo: use date instead?
//   lpaProofEvidenceSubmitted       Boolean @default(false) // todo: use date instead?
//   lpaProofEvidencePublished       Boolean @default(false) // todo: use date instead?
//   lpaFinalCommentsPublished       Boolean @default(false) // todo: use date instead?

//   appellantProcedurePreference         String?
//   appellantProcedurePreferenceDetails  String?
//   appellantProcedurePreferenceDuration Int?
//   lpaProcedurePreference               String?
//   lpaProcedurePreferenceDetails        String?
//   lpaProcedurePreferenceDuration       Int?

//   conservationArea                   Boolean?
//   protectedSpecies                   Boolean?
//   areaOutstandingBeauty              Boolean?
//   designatedSites                    String?
//   otherDesignationDetails            String?
//   treePreservationOrder              Boolean?
//   gypsyTraveller                     Boolean?
//   publicRightOfWay                   Boolean?
//   environmentalImpactSchedule        String?
//   developmentDescription             String?
//   sensitiveArea                      Boolean?
//   sensitiveAreaDetails               String?
//   columnTwoThreshold                 Boolean?
//   screeningOpinion                   Boolean?
//   requiresEnvironmentalStatement     Boolean?
//   completedEnvironmentalStatement    Boolean?
//   statutoryConsultees                Boolean?
//   consultedBodiesDetails             String?
//   consultationResponses              Boolean?
//   otherPartyRepresentations          Boolean?
//   emergingPlan                       Boolean?
//   supplementaryPlanningDocs          Boolean?
//   infrastructureLevy                 Boolean?
//   infrastructureLevyAdopted          Boolean?
//   infrastructureLevyAdoptedDate      DateTime?
//   infrastructureLevyExpectedDate     DateTime?
//   lpaSiteAccess                      Boolean?
//   lpaSiteAccessDetails               String?
//   neighbouringSiteAccess             Boolean?
//   neighbouringSiteAccessDetails      String?
//   addNeighbouringSiteAccess          Boolean?
//   lpaSiteSafetyRisks                 Boolean?
//   lpaSiteSafetyRiskDetails           String?
//   lpaPreferHearingDetails            String?
//   lpaPreferInquiryDuration           String?
//   lpaPreferInquiryDetails            String?
//   lpaStatementDocuments              Boolean?
//   lpaFinalComment                    Boolean?
//   lpaFinalCommentDetails             String?
//   lpaWitnesses                       Boolean?
//   agriculturalHolding                Boolean?
//   tenantAgriculturalHolding          Boolean?
//   otherTenantsAgriculturalHolding    Boolean?
//   informedTenantsAgriculturalHolding Boolean?
//   statusPlanningObligation           String?
//   planningObligation                 Boolean?

//   //***************************************************************************
//   // rule 6 fields
//   //***************************************************************************

//   rule6StatementPublished         Boolean   @default(false) /// todo: use date instead
//   rule6ProofsEvidencePublished    Boolean   @default(false) /// todo: use date instead
//   rule6StatementDueDate           DateTime?
//   rule6StatementSubmitted         Boolean   @default(false)
//   rule6StatementSubmittedDate     DateTime?
//   rule6ProofEvidenceDueDate       DateTime?
//   rule6ProofEvidenceSubmitted     Boolean   @default(false)
//   rule6ProofEvidenceSubmittedDate DateTime?

//   //***************************************************************************
//   // interested party fields
//   //***************************************************************************

//   interestedPartyCommentsPublished Boolean @default(false) /// todo: use date instead

//   //***************************************************************************
//   // Relations
//   //***************************************************************************
//   LPAQuestionnaireSubmission   LPAQuestionnaireSubmission?
//   LPAStatementSubmission       LPAStatementSubmission?
//   LPAFinalCommentSubmission    LPAFinalCommentSubmission?
//   LPAProofOfEvidenceSubmission LPAProofOfEvidenceSubmission?

//   AppellantFinalCommentSubmission    AppellantFinalCommentSubmission?
//   AppellantProofOfEvidenceSubmission AppellantProofOfEvidenceSubmission?

//   Rule6Parties                    Rule6Party[]
//   AffectedListedBuildings         AppealCaseListedBuilding[]
//   Documents                       Document[]
//   NeighbouringAddresses           NeighbouringAddress[]
//   Events                          Event[]
//   AppealCaseLpaNotificationMethod AppealCaseLpaNotificationMethod[]
//   InterestedPartyComments         InterestedPartyComment[]
//   InterestedPartySubmissions      InterestedPartySubmission[]
//   AppealStatements                AppealStatement[]
//   FinalComments                   FinalComment[]
//   Rule6ProofOfEvidenceSubmission  Rule6ProofOfEvidenceSubmission?
//   Rule6StatementSubmission        Rule6StatementSubmission?

// 	},
// 	{
// 		Appeal: {
// 			connect: { id: lpaAppealIds.appeal16 }
// 		},
// 		...commonAppealCaseDataProperties,
// 		caseReference: '0000100',
// 		siteAddressLine1: 'HAS Questionnaire and statement due',
// 		siteAddressLine2: null,
// 		siteAddressTown: 'Not submitted',
// 		siteAddressCounty: 'Countyshire',
// 		siteAddressPostcode: 'BS1 6PN',
// 		developmentDescription: 'test description',
// 		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
// 		statementDueDate: pickRandom(datesNMonthsAhead(1)),
// 		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(1)),
// 		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.HEARING } },
// 		CaseType: { connect: { processCode: 'HAS' } },
// 		caseSubmittedDate: pickRandom(datesNMonthsAgo(3))
// 	}
// ]

// const createParams = {
// 	caseType,
// 	caseStatus,
// 	caseProcedure,
// 	siteAddressLine1,
// 	caseDecision
// }

// /**
//  * @typedef {Object} TestAppealParams
//  * @property {string} caseReference
//  * @property {'HAS' | 'S78' } [caseType]
//  * @property {string} [caseStatus]
//  * @property {string} [caseProcedure]
//  * @property {string} siteAddressLine1
//  * @property {string} [caseDecision]
//  */

// /**
//  *
//  * @param {TestAppealParams} testParams
//  */

// const createFOTestAppealCase = (testParams) => {
// 	const { caseReference, caseType, caseStatus, caseProcedure, siteAddressLine1, caseDecision } = testParams;

// 	const baseCaseDetails = generateTestAppealBaseCase(caseReference);

// 	switch (caseStatus) {
// 		case APPEAL_CASE_STATUS.ASSIGN_CASE_OFFICER:
// 		case APPEAL_CASE_STATUS.VALIDATION:
// 		case APPEAL_CASE_STATUS.READY_TO_START:
// 			return baseCaseDetails;
// 		case APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE:
// 			return;

// 		case APPEAL_CASE_STATUS.STATEMENTS:
// 			return;
// 		case
// 	}

// 	switch (c) {
// 		case '<':
// 			return '&lt;';
// 		case '>':
// 			return '&gt;';
// 		case '&':
// 			return '&amp;';
// 		case "'":
// 			return '&apos;';
// 		case '"':
// 			return '&quot;';
// 	}

// }

// //bys
// 	const generateTestAppealBaseCase = (caseReference) => ({
// 		caseReference,
// 		LPACode: 'Q9999',
// 		applicationReference: '12/2323232/PLA',
// 		applicationDecision: 'refused',
// 		applicationDate: pickRandom(datesNMonthsAgo(2)),
// 		applicationDecisionDate: pickRandom(datesNMonthsAgo(1)),
// 		caseSubmissionDueDate: pickRandom(datesNMonthsAhead(1)),
// 		enforcementNotice: false
// })

// 	//appeal
// 	const generateTestAppealDetailsHAS = (testParams) => ({
// 			siteAddressLine1: testParams.siteAddressLine1,
// 			siteAddressTown: 'Test Town',
// 			siteAddressCounty: 'Test County',
// 			siteAddressPostcode: 'BS1 6PN',
// 			siteAreaSquareMetres: 100,
// 			isGreenBelt: false,
// 			ownsAllLand: true,
// 			siteAccessDetails: '["Appellant says yes"]',
// 			siteSafetyDetails: '["Appellant says it is safe"]',
// 			//NOTE _ should this be originalDevelopmentDescription?
// 			developmentDescription: 'Test description',
// 			caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
//   			caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
//   			caseValidationDate: pickRandom(datesNMonthsAgo(1)),
//   			caseStartedDate: pickRandom(datesNMonthsAgo(1)),
//   			casePublishedDate: pickRandom(datesNMonthsAgo(1)),
// 			changedDevelopmentDescription: false,
// 			ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.WRITTEN } }
// 	})

// 	const generateAdditionalAppealDetailsS78 = (testParams) => ({
// 		agriculturalHolding: false,
// 		appellantProcedurePreference: APPEAL_CASE_PROCEDURE.INQUIRY,
// 		appellantProcedurePreferenceDetails: 'Would like longer consideration',
// 		ProcedureType: { connect: { key: APPEAL_CASE_PROCEDURE.INQUIRY } },
// 		planningObligation: false
// 	})

// 	const generatePinsValidatedDetails = ({
// 		lpaQuestionnaireDueDate: pickRandom(datesNMonthsAhead(1)),
// 		statementDueDate: pickRandom(datesNMonthsAhead(2)),
// 		interestedPartyRepsDueDate: pickRandom(datesNMonthsAhead(2)),

// })

// 	const questionnaireSubmittedDetailsHAS = () => ({
// 		lpaQuestionnaireSubmittedDate: pickRandom(datesNMonthsAgo(1)),
// 		isCorrectAppealType: true,
// 		//note - we have inConservationArea also
// 		conservationArea: false,
// 		AppealCaseLpaNotificationMethod: [ { connect: {lPANotificationMethodsKey: 'notice' } }],
// 		otherPartyRepresentations: false,
// 		emergingPlan: false,
// 		supplementaryPlanningDocs: false,
// 		siteAccessDetails: '["Appellant says yes", "LPA says test"]',
// 		siteSafetyDetails: '["Appellant says it is safe", "LPA says safe test]',

// 	})

// 	const additionalQuestionnaireSubmittedDetailsS78 = {
// 		scheduledMonument: false,
// 		protectedSpecies: false,
// 		areaOutstandingBeauty: false,
// 		treePreservationOrder: false,
// 		gypsyTraveller: false,
// 		publicRightOfWay: false,
// 		environmentalImpactSchedule: 'no',
// 		requiresEnvironmentalStatement: false,
// 		statutoryConsultees: false,
// 		consultationResponses: false,
// 		infrastructureLevy: false
// 	}

// 	const questionnaireValidated = {
// 		lpaQuestionnaireCreatedDate:
// 		lpaQuestionnairePublishedDate:
// 		lpaQuestionnaireValidationOutcomeDate:
// 		statementDueDate:
// 	}

// 	const proofsDueDetails = {
// 		LPAStatementSubmitted:
// 		proofsOfEvidenceDueDate:

// 	}

// 	const finalCommentsDueDetails = {
// 		LPAStatementSubmitted:
// 		finalCommentsDueDate:
// 	}

// 	const rule6Details

// 	if (caseType) {
// 		testAppealCase.CaseType = {
// 			connect: { processCode: caseType }
// 		}
// 	} else {
// 		testAppealCase.CaseType = {
// 			connect: { processCode: 'S78' }
// 		}
// 	}

// 	if (!caseStatus) {
// 		testAppealCase.
// 	}

// }

// CaseDecisionOutcome: {
// 	connect: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION }
// },
