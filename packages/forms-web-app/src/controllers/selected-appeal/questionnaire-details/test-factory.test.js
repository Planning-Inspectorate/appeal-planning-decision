const { CASE_TYPES, LISTED_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const {
	makeConstraintsSectionData,
	makeEiaSectionData,
	makeNotifiedPartiesSectionData,
	makeConsultationResponsesSectionData,
	makePlanningOfficerReportSectionData,
	makeSiteAccessSectionData,
	makeAppealProcessSectionData
} = require('./test-factory');
const { APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE } = require('@planning-inspectorate/data-model');

describe('makeConstraintsSectionData', () => {
	const expectedHasConstraints = {
		ListedBuildings: [{ type: LISTED_RELATION_TYPES.affected, listedBuildingReference: 'LB1' }],
		conservationArea: true,
		Documents: [
			{
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
				documentType: 'conservationMap'
			}
		]
	};

	const expectedS78S20Constraints = {
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
			{
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
				documentType: 'conservationMap'
			},
			{
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
				documentType: 'treePreservationPlan'
			}
		]
	};

	test.each([
		['HAS', CASE_TYPES.HAS.processCode, expectedHasConstraints],
		['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode, expectedHasConstraints],
		[
			'S78',
			CASE_TYPES.S78.processCode,
			{
				...expectedS78S20Constraints,
				Documents: [
					...expectedS78S20Constraints.Documents,
					{
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
						documentType: 'definitiveMapStatement'
					}
				]
			}
		],
		[
			'S20',
			CASE_TYPES.S20.processCode,
			{
				...expectedS78S20Constraints,
				preserveGrantLoan: true,
				consultHistoricEngland: true,
				Documents: [
					...expectedS78S20Constraints.Documents,
					{
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
						documentType: 'historicEnglandConsultation'
					}
				]
			}
		]
	])('returns expected constraints for %s', (_label, input, expected) => {
		expect(makeConstraintsSectionData(input)).toEqual(expected);
	});
});

describe('makeEiaSectionData', () => {
	const expectedSchedule1 = {
		environmentalImpactSchedule: 'schedule-1',
		completedEnvironmentalStatement: false,
		requiresEnvironmentalStatement: true,
		Documents: [
			{
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
				documentType: 'eiaEnvironmentalStatement'
			}
		]
	};

	const expectedSchedule2 = {
		environmentalImpactSchedule: 'schedule-2',
		developmentDescription: 'agriculture-aquaculture',
		sensitiveAreaDetails: 'Sensitive area details here',
		columnTwoThreshold: true,
		screeningOpinion: true,
		scopingOpinion: true,
		requiresEnvironmentalStatement: true,
		completedEnvironmentalStatement: true,
		Documents: [
			{
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
				documentType: 'eiaScreeningOpinion'
			},
			{
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
				documentType: 'eiaScopingOpinion'
			},
			{
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
				documentType: 'eiaEnvironmentalStatement'
			}
		]
	};

	const expectedNo = {
		environmentalImpactSchedule: 'No',
		screeningOpinion: true,
		Documents: [
			{
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
				documentType: 'eiaScreeningOpinion'
			},
			{
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
				documentType: 'eiaScopingOpinion'
			},
			{
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
				documentType: 'eiaEnvironmentalStatement'
			}
		]
	};

	test.each([
		['Schedule 1', APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1, expectedSchedule1],
		['Schedule 2', APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2, expectedSchedule2],
		['No', 'No', expectedNo]
	])('returns expected output for %s', (_label, input, expected) => {
		expect(makeEiaSectionData(input)).toEqual(expected);
	});
});

describe('makeNotifiedPartiesSectionData', () => {
	const expectedData = {
		AppealCaseLpaNotificationMethod: [
			{ id: 1, key: 'advert', name: 'A press advert' },
			{ id: 2, key: 'siteNotice', name: 'A site notice' },
			{ id: 1, key: 'letter', name: 'A letter' }
		],
		Documents: [
			{
				caseReference: '0000001',
				dateCreated: '2023-01-01',
				documentType: 'whoNotified',
				documentURI: '',
				filename: 'name.pdf',
				id: '',
				origin: '',
				originalFilename: 'nameOg.pdf',
				size: 100000,
				sourceSystem: '',
				stage: ''
			},
			{
				caseReference: '0000001',
				dateCreated: '2023-01-01',
				documentType: 'whoNotifiedSiteNotice',
				documentURI: '',
				filename: 'name.pdf',
				id: '',
				origin: '',
				originalFilename: 'nameOg.pdf',
				size: 100000,
				sourceSystem: '',
				stage: ''
			},
			{
				caseReference: '0000001',
				dateCreated: '2023-01-01',
				documentType: 'whoNotifiedLetterToNeighbours',
				documentURI: '',
				filename: 'name.pdf',
				id: '',
				origin: '',
				originalFilename: 'nameOg.pdf',
				size: 100000,
				sourceSystem: '',
				stage: ''
			},
			{
				caseReference: '0000001',
				dateCreated: '2023-01-01',
				documentType: 'whoNotifiedPressAdvert',
				documentURI: '',
				filename: 'name.pdf',
				id: '',
				origin: '',
				originalFilename: 'nameOg.pdf',
				size: 100000,
				sourceSystem: '',
				stage: ''
			},
			{
				caseReference: '0000001',
				dateCreated: '2023-01-01',
				documentType: 'appealNotification',
				documentURI: '',
				filename: 'name.pdf',
				id: '',
				origin: '',
				originalFilename: 'nameOg.pdf',
				size: 100000,
				sourceSystem: '',
				stage: ''
			}
		]
	};

	test('returns expected output for %s', () => {
		expect(makeNotifiedPartiesSectionData()).toEqual(expectedData);
	});
});

describe('makeConsultationResponsesSectionData', () => {
	const expectedS78 = {
		statutoryConsultees: true,
		consultedBodiesDetails: 'Consulted bodies details here',
		Documents: [
			{
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
				documentType: 'otherPartyRepresentations'
			},
			{
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
				documentType: 'consultationResponses'
			}
		]
	};

	const expectedHas = {
		Documents: [
			{
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
				documentType: 'otherPartyRepresentations'
			}
		]
	};
	test.each([
		['S78', CASE_TYPES.S78.processCode, expectedS78],
		['HAS', CASE_TYPES.HAS.processCode, expectedHas],
		['S20', CASE_TYPES.S20.processCode, expectedS78],
		['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode, expectedHas]
	])('returns expected output for %s', (_label, input, expected) => {
		expect(makeConsultationResponsesSectionData(input)).toEqual(expected);
	});
});

describe('makePlanningOfficerReportSectionData', () => {
	const expectedS78 = {
		infrastructureLevy: true,
		infrastructureLevyAdopted: true,
		infrastructureLevyAdoptedDate: '2023-01-01',
		Documents: [
			{
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
				documentType: 'planningOfficerReport'
			},
			{
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
				documentType: 'developmentPlanPolicies'
			},
			{
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
				documentType: 'supplementaryPlanning'
			},
			{
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
				documentType: 'communityInfrastructureLevy'
			},
			{
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
				documentType: 'emergingPlan'
			},
			{
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
				documentType: 'otherRelevantPolicies'
			}
		]
	};

	const expectedHas = {
		Documents: [
			{
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
				documentType: 'planningOfficerReport'
			},
			{
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
				documentType: 'developmentPlanPolicies'
			},
			{
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
				documentType: 'supplementaryPlanning'
			},
			{
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
				documentType: 'plansDrawings'
			},
			{
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
				documentType: 'emergingPlan'
			},
			{
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
				documentType: 'otherRelevantPolicies'
			}
		]
	};

	const expectedCasPlanning = {
		Documents: [
			{
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
				documentType: 'planningOfficerReport'
			},
			{
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
				documentType: 'developmentPlanPolicies'
			},
			{
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
				documentType: 'supplementaryPlanning'
			}
		]
	};

	test.each([
		['S78', CASE_TYPES.S78.processCode, expectedS78],
		['HAS', CASE_TYPES.HAS.processCode, expectedHas],
		['S20', CASE_TYPES.S20.processCode, expectedS78],
		['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode, expectedCasPlanning]
	])('returns expected output for %s', (_label, input, expected) => {
		expect(makePlanningOfficerReportSectionData(input)).toEqual(expected);
	});
});

describe('makeSiteAccessSectionData', () => {
	const expectedData = {
		siteAccessDetails: ['access details from appellant', 'access details from LPA'],
		siteSafetyDetails: ['appellant safety details do not show', 'lpa safety details for show'],
		NeighbouringAddresses: [
			{
				addressLine1: 'address 1 l1',
				addressLine2: 'address 1 l2',
				postcode: 'ab1 2cd',
				townCity: 'town'
			},
			{
				addressLine1: 'address 2 l1',
				addressLine2: 'address 2 l2',
				postcode: 'ef3 4gh',
				townCity: 'another town'
			}
		],
		reasonForNeighbourVisits: 'Reason for neighbour visits here'
	};

	test('returns expected output for %s', () => {
		expect(makeSiteAccessSectionData()).toEqual(expectedData);
	});
});

describe('makeAppealProcessSectionData', () => {
	const expectedHasAndCasPlanning = {
		submissionLinkedCases: [
			{
				id: '1',
				fieldName: 'nearbyAppealReference',
				caseReference: '00000001'
			}
		],
		newConditionDetails: 'example new conditions'
	};

	const expectedS78AndS20 = {
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

	test.each([
		['HAS', CASE_TYPES.HAS.processCode, expectedHasAndCasPlanning],
		['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode, expectedHasAndCasPlanning],
		['S78', CASE_TYPES.S78.processCode, expectedS78AndS20],
		['S20', CASE_TYPES.S20.processCode, expectedS78AndS20]
	])('returns expected output for %s', (_label, input, expected) => {
		expect(makeAppealProcessSectionData(input)).toEqual(expected);
	});
});
