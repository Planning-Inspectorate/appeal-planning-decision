const { mapBopsToBeforeYouStart } = require('./bops-before-you-start');
const { applicationTypes, decisions } = require('@pins/common/src/client/bops/consts');
const {
	APPEAL_ID,
	APPLICATION_DECISION,
	TYPE_OF_PLANNING_APPLICATION
} = require('../../constants');

describe('mapBopsToBeforeYouStart', () => {
	it('returns null if application type is missing', () => {
		expect(mapBopsToBeforeYouStart({})).toBeNull();
		expect(mapBopsToBeforeYouStart({ application: {} })).toBeNull();
		expect(mapBopsToBeforeYouStart({ application: { type: null } })).toBeNull();
	});

	it('returns the application date for unknown application type', () => {
		const receivedAt = '2026-04-03T10:00:00Z';
		const bopsData = {
			application: {
				type: { value: 'unknown_type' },
				receivedAt
			}
		};
		expect(mapBopsToBeforeYouStart(bopsData)).toEqual({
			applicationDate: new Date(receivedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with granted decision', () => {
		const determinedAt = '2025-12-01T00:00:00Z';
		const receivedAt = '2025-11-01T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: decisions.granted,
				determinedAt,
				receivedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.GRANTED },
			decisionDate: new Date(determinedAt),
			applicationDate: new Date(receivedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with refused decision', () => {
		const determinedAt = '2025-12-02T00:00:00Z';
		const receivedAt = '2025-11-02T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: decisions.refused,
				determinedAt,
				receivedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.HOUSEHOLDER,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.REFUSED },
			decisionDate: new Date(determinedAt),
			applicationDate: new Date(receivedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with no decision and expiryDate', () => {
		const expiryDate = '2025-12-31T00:00:00Z';
		const receivedAt = '2025-10-30T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: null,
				determinedAt: null,
				expiryDate,
				receivedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED },
			decisionDate: new Date(expiryDate),
			applicationDate: new Date(receivedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with no decision and no expiryDate', () => {
		const receivedAt = '2025-10-31T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: null,
				determinedAt: null,
				receivedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: false,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED },
			decisionDate: null,
			applicationDate: new Date(receivedAt)
		});
	});
});
