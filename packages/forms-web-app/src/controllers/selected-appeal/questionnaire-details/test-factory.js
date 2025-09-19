const { CASE_TYPES, LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE
} = require('@planning-inspectorate/data-model');

/** @param {string} type */
const makeDocument = (type) => ({
	id: '',
	filename: 'name.pdf',
	originalFilename: 'nameOg.pdf',
	size: 100000,
	documentURI: '',
	sourceSystem: '',
	caseReference: '0000001',
	origin: '',
	stage: '',
	dateCreated: '2023-01-01',
	documentType: type
});

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 */
const makeConstraintsSectionData = (appealTypeCode) => {
	const groupAShared = {
		ListedBuildings: [{ type: LISTED_RELATION_TYPES.affected, listedBuildingReference: 'LB1' }],
		conservationArea: true,
		Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP)]
	};

	const groupBShared = {
		ListedBuildings: [
			{ type: LISTED_RELATION_TYPES.affected, listedBuildingReference: 'LB1' },
			{ type: LISTED_RELATION_TYPES.changed, listedBuildingReference: 'LB2' }
		],
		affectsScheduledMonument: true,
		protectedSpecies: true,
		areaOutstandingBeauty: true,
		designatedSitesNames: ['Site A', 'Site B'],
		gypsyTraveller: true,
		publicRightOfWay: true,
		Documents: [
			makeDocument(APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP),
			makeDocument(APPEAL_DOCUMENT_TYPE.TREE_PRESERVATION_PLAN)
		]
	};
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
		case CASE_TYPES.CAS_PLANNING.processCode:
			return groupAShared;
		case CASE_TYPES.S78.processCode:
			return {
				...groupBShared,
				Documents: [
					...groupBShared.Documents,
					makeDocument(APPEAL_DOCUMENT_TYPE.DEFINITIVE_MAP_STATEMENT)
				]
			};
		case CASE_TYPES.S20.processCode:
			return {
				...groupBShared,
				preserveGrantLoan: true,
				consultHistoricEngland: true,
				Documents: [
					...groupBShared.Documents,
					makeDocument(APPEAL_DOCUMENT_TYPE.HISTORIC_ENGLAND_CONSULTATION)
				]
			};
		case CASE_TYPES.ADVERTS.processCode:
		case CASE_TYPES.CAS_ADVERTS.processCode:
			return {
				...groupAShared,
				isSiteInAreaOfSpecialControlAdverts: true,
				Documents: [...groupAShared.Documents]
			};
	}
};

/**
 * @param {"schedule-1" | "schedule-2" | null} scheduleType
 */
const makeEiaSectionData = (scheduleType) => {
	switch (scheduleType) {
		case APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1:
			return {
				environmentalImpactSchedule: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1,
				completedEnvironmentalStatement: false,
				requiresEnvironmentalStatement: true,
				Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT)]
			};
		case APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2:
			return {
				environmentalImpactSchedule: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2,
				developmentDescription: 'agriculture-aquaculture',
				sensitiveAreaDetails: 'Sensitive area details here',
				columnTwoThreshold: true,
				screeningOpinion: true,
				scopingOpinion: true,
				requiresEnvironmentalStatement: true,
				completedEnvironmentalStatement: true,
				Documents: [
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION),
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT)
				]
			};
		default:
			return {
				environmentalImpactSchedule: 'No',
				screeningOpinion: true,
				Documents: [
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION),
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION),
					makeDocument(APPEAL_DOCUMENT_TYPE.EIA_ENVIRONMENTAL_STATEMENT)
				]
			};
	}
};

const makeNotifiedPartiesSectionData = () => {
	return {
		AppealCaseLpaNotificationMethod: [
			{ id: 1, key: 'advert', name: 'A press advert' },
			{ id: 2, key: 'siteNotice', name: 'A site notice' },
			{ id: 1, key: 'letter', name: 'A letter' }
		],
		Documents: [
			makeDocument(APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED),
			makeDocument(APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_SITE_NOTICE),
			makeDocument(APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_LETTER_TO_NEIGHBOURS),
			makeDocument(APPEAL_DOCUMENT_TYPE.WHO_NOTIFIED_PRESS_ADVERT),
			makeDocument(APPEAL_DOCUMENT_TYPE.APPEAL_NOTIFICATION)
		]
	};
};

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 */
const makeConsultationResponsesSectionData = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.S78.processCode:
		case CASE_TYPES.S20.processCode:
			return {
				statutoryConsultees: true,
				consultedBodiesDetails: 'Consulted bodies details here',
				Documents: [
					makeDocument(APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS),
					makeDocument(APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES)
				]
			};
		case CASE_TYPES.HAS.processCode:
		case CASE_TYPES.CAS_PLANNING.processCode:
			return {
				Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS)]
			};
	}
};

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 */
const makePlanningOfficerReportSectionData = (appealTypeCode) => {
	const sharedDocs = [
		makeDocument(APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT),
		makeDocument(APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES),
		makeDocument(APPEAL_DOCUMENT_TYPE.SUPPLEMENTARY_PLANNING)
	];
	switch (appealTypeCode) {
		case CASE_TYPES.S78.processCode:
		case CASE_TYPES.S20.processCode:
			return {
				infrastructureLevy: true,
				infrastructureLevyAdopted: true,
				infrastructureLevyAdoptedDate: '2023-01-01',
				Documents: [
					...sharedDocs,
					makeDocument(APPEAL_DOCUMENT_TYPE.COMMUNITY_INFRASTRUCTURE_LEVY),
					makeDocument(APPEAL_DOCUMENT_TYPE.EMERGING_PLAN),
					makeDocument(APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES)
				]
			};
		case CASE_TYPES.HAS.processCode:
			return {
				Documents: [
					...sharedDocs,
					makeDocument(APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
					makeDocument(APPEAL_DOCUMENT_TYPE.EMERGING_PLAN),
					makeDocument(APPEAL_DOCUMENT_TYPE.OTHER_RELEVANT_POLICIES)
				]
			};
		case CASE_TYPES.CAS_PLANNING.processCode:
			return {
				Documents: [...sharedDocs]
			};
		case CASE_TYPES.CAS_ADVERTS.processCode:
		case CASE_TYPES.ADVERTS.processCode:
			return {
				wasApplicationRefusedDueToHighwayOrTraffic: true,
				didAppellantSubmitCompletePhotosAndPlans: true,
				Documents: [...sharedDocs]
			};
		default:
			return {};
	}
};

const makeSiteAccessSectionData = () => {
	return {
		siteAccessDetails: ['access details from appellant', 'access details from LPA'],
		siteSafetyDetails: ['appellant safety details do not show', 'lpa safety details for show'],
		NeighbouringAddresses: [
			{
				addressLine1: 'address 1 l1',
				addressLine2: 'address 1 l2',
				townCity: 'town',
				postcode: 'ab1 2cd'
			},
			{
				addressLine1: 'address 2 l1',
				addressLine2: 'address 2 l2',
				townCity: 'another town',
				postcode: 'ef3 4gh'
			}
		],
		reasonForNeighbourVisits: 'Reason for neighbour visits here'
	};
};

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 */
const makeAppealProcessSectionData = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
		case CASE_TYPES.CAS_PLANNING.processCode:
			return {
				submissionLinkedCases: [
					{
						id: '1',
						fieldName: 'nearbyAppealReference',
						caseReference: '00000001'
					}
				],
				newConditionDetails: 'example new conditions'
			};
		case CASE_TYPES.S78.processCode:
		case CASE_TYPES.S20.processCode:
			return {
				lpaProcedurePreference: 'inquiry',
				submissionLinkedCases: [
					{
						id: '1',
						fieldName: 'nearbyAppealReference',
						caseReference: '00000001'
					}
				],
				newConditionDetails: 'example new conditions'
			};
	}
};

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 * @param {"constraints"| "eia" | "consultation" | "notifiedParties" | "planningOfficersReport" | "siteAccess" | "appealProcess"} section
 * @param {"schedule-1" | "schedule-2" | null} scheduleType
 * @returns
 */
const makeCaseTypeRows = (appealTypeCode, section, scheduleType) => {
	switch (section) {
		case 'constraints':
			return makeConstraintsSectionData(appealTypeCode);
		case 'eia':
			if (
				appealTypeCode === CASE_TYPES.S78.processCode ||
				appealTypeCode === CASE_TYPES.S20.processCode
			) {
				return makeEiaSectionData(scheduleType);
			} else break;
		case 'consultation':
			return makeConsultationResponsesSectionData(appealTypeCode);
		case 'notifiedParties':
			return makeNotifiedPartiesSectionData();
		case 'planningOfficersReport':
			return makePlanningOfficerReportSectionData(appealTypeCode);
		case 'siteAccess':
			return makeSiteAccessSectionData();
		case 'appealProcess':
			return makeAppealProcessSectionData(appealTypeCode);
		default: {
			if (
				appealTypeCode === CASE_TYPES.S78.processCode ||
				appealTypeCode === CASE_TYPES.S20.processCode
			) {
				return [
					makeConstraintsSectionData(appealTypeCode),
					makeEiaSectionData(scheduleType),
					makeConsultationResponsesSectionData(appealTypeCode),
					makeNotifiedPartiesSectionData(),
					makePlanningOfficerReportSectionData(appealTypeCode),
					makeSiteAccessSectionData(),
					makeAppealProcessSectionData(appealTypeCode)
				];
			} else
				return [
					makeConstraintsSectionData(appealTypeCode),
					makeConsultationResponsesSectionData(appealTypeCode),
					makeNotifiedPartiesSectionData(),
					makePlanningOfficerReportSectionData(appealTypeCode),
					makeSiteAccessSectionData(),
					makeAppealProcessSectionData(appealTypeCode)
				];
		}
	}
};

/**
 * @param {"S78" | "HAS" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING"} appealTypeCode
 * @param {"constraints"| "eia" | "consultation" | "notifiedParties" | "planningOfficersReport" | "siteAccess" | "appealProcess" | null} section
 * @param {"schedule-1" | "schedule-2" | null} [scheduleType]
 * @returns {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 */
const caseTypeLPAQFactory = (appealTypeCode, section, scheduleType) => {
	// Factory function to create case data with specific appeal type and expected procedure
	// This is used to test the rows generation for different appeal types

	return {
		caseReference: '0000001',
		LPACode: 'LPACODE',
		applicationDecision: 'refused',
		applicationDecisionDate: '2023-01-01',
		applicationReference: 'APP-0001',
		siteAddressLine1: '123 Main St',
		siteAddressPostcode: 'AB12 3CD',
		appealTypeCode: appealTypeCode,
		lpaProcedurePreferenceDetails: 'inquiry preference',
		lpaProcedurePreferenceDuration: 6,
		isCorrectAppealType: true,
		isGreenBelt: true,

		...makeCaseTypeRows(appealTypeCode, section, scheduleType)
	};
};

module.exports = {
	makeDocument,
	makeConstraintsSectionData,
	makeEiaSectionData,
	makeNotifiedPartiesSectionData,
	makeConsultationResponsesSectionData,
	makePlanningOfficerReportSectionData,
	makeSiteAccessSectionData,
	makeAppealProcessSectionData,
	makeCaseTypeRows,
	caseTypeLPAQFactory
};
