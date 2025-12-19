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

	it('returns null for unknown application type', () => {
		const bopsData = {
			application: {
				type: { value: 'unknown_type' }
			}
		};
		expect(mapBopsToBeforeYouStart(bopsData)).toBeNull();
	});

	it('maps HOUSEHOLDER_PLANNING with granted decision', () => {
		const determinedAt = '2025-12-01T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: decisions.granted,
				determinedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.GRANTED },
			decisionDate: new Date(determinedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with refused decision', () => {
		const determinedAt = '2025-12-02T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: decisions.refused,
				determinedAt
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.HOUSEHOLDER,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.REFUSED },
			decisionDate: new Date(determinedAt)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with no decision and expiryDate', () => {
		const expiryDate = '2025-12-31T00:00:00Z';
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: null,
				determinedAt: null,
				expiryDate
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: true,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED },
			decisionDate: new Date(expiryDate)
		});
	});

	it('maps HOUSEHOLDER_PLANNING with no decision and no expiryDate', () => {
		const bopsData = {
			application: {
				type: { value: applicationTypes.pp_full_householder },
				decision: null,
				determinedAt: null
			}
		};
		const result = mapBopsToBeforeYouStart(bopsData);
		expect(result).toEqual({
			allData: false,
			appealType: APPEAL_ID.PLANNING_SECTION_78,
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING,
			eligibility: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED },
			decisionDate: null
		});
	});
});
