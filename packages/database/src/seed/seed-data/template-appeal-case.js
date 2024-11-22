// const { pickRandom, datesNMonthsAhead } = require("../util")

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
// 	addressName
// }
