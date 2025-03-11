const { exampleHASDataModel } = require('./appeals-HAS-data-model');

/**
 * @type {import('pins-data-model').Schemas.AppealS78Case}
 */
const exampleS78DataModel = {
	// HAS fields
	...exampleHASDataModel,
	caseType: 'W',

	// todo: data model updates
	// rename on data model
	consultedBodiesDetails: null,
	// add to HAS as well
	developmentType: 'major-industry-storage',
	// add to S78
	appellantProofsSubmittedDate: null,

	// S78 fields
	changedListedBuildingNumbers: ['9000009'],
	agriculturalHolding: null,
	tenantAgriculturalHolding: true,
	otherTenantsAgriculturalHolding: false,
	informedTenantsAgriculturalHolding: true,
	appellantProcedurePreference: 'written',
	appellantProcedurePreferenceDetails: 'minim est irure laborum',
	appellantProcedurePreferenceDuration: null,
	appellantProcedurePreferenceWitnessCount: 10,
	statusPlanningObligation: null,
	affectsScheduledMonument: false,
	hasProtectedSpecies: true,
	isAonbNationalLandscape: false,
	designatedSitesNames: null,
	isGypsyOrTravellerSite: true,
	isPublicRightOfWay: false,
	eiaEnvironmentalImpactSchedule: 'schedule-2',
	eiaDevelopmentDescription: 'other-projects',
	eiaSensitiveAreaDetails: 'ad reprehenderit labore',
	eiaColumnTwoThreshold: null,
	eiaScreeningOpinion: null,
	eiaRequiresEnvironmentalStatement: null,
	eiaCompletedEnvironmentalStatement: null,
	hasStatutoryConsultees: true,
	hasInfrastructureLevy: false,
	isInfrastructureLevyFormallyAdopted: null,
	infrastructureLevyAdoptedDate: '2023-07-27T20:30:00.000Z',
	infrastructureLevyExpectedDate: '2023-07-27T20:30:00.000Z',
	lpaProcedurePreference: 'written',
	lpaProcedurePreferenceDetails: null,
	lpaProcedurePreferenceDuration: 2,
	caseworkReason: null,
	importantInformation: 'fugiat nulla culpa',
	jurisdiction: 'nisi dolore nulla ad',
	redeterminedIndicator: 'anim et reprehenderit labore',
	dateCostsReportDespatched: '2023-07-27T20:30:00.000Z',
	dateNotRecoveredOrDerecovered: '2023-07-27T20:30:00.000Z',
	dateRecovered: '2023-07-27T20:30:00.000Z',
	originalCaseDecisionDate: '2023-07-27T20:30:00.000Z',
	targetDate: '2023-07-27T20:30:00.000Z',
	appellantCommentsSubmittedDate: '2023-07-27T20:30:00.000Z',
	appellantStatementSubmittedDate: '2023-07-27T20:30:00.000Z',
	finalCommentsDueDate: '2023-07-27T20:30:00.000Z',
	interestedPartyRepsDueDate: '2023-07-27T20:30:00.000Z',
	lpaCommentsSubmittedDate: '2023-07-27T20:30:00.000Z',
	lpaProofsSubmittedDate: '2023-07-27T20:30:00.000Z',
	lpaStatementSubmittedDate: '2023-07-27T20:30:00.000Z',
	proofsOfEvidenceDueDate: '2023-07-27T20:30:00.000Z',
	siteNoticesSentDate: '2023-07-27T20:30:00.000Z',
	statementDueDate: '2023-07-27T20:30:00.000Z',
	reasonForNeighbourVisits: 'velit enim elit tempor cillum',
	numberOfResidencesNetChange: null,
	siteGridReferenceEasting: null,
	siteGridReferenceNorthing: 'et sit id eiusmod',
	siteViewableFromRoad: null,
	siteWithinSSSI: false,
	typeOfPlanningApplication: null
};

module.exports = { exampleS78DataModel };
