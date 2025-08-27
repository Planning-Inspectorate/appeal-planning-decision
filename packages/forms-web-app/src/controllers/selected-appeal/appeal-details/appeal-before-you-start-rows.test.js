const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { bysRows } = require('./appeal-before-you-start-rows');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

describe('bys-rows', () => {
	const caseData = {
		caseReference: 'test-ref',
		LPACode: '111111',
		appealTypeCode: CASE_TYPES.S78.processCode,
		applicationReference: 'app-ref',
		enforcementNotice: false,
		typeOfPlanningApplication: 'full-appeal',
		applicationDate: '2025-01-01T08:00:00.000Z',
		applicationDecision: APPLICATION_DECISION.REFUSED,
		applicationDecisionDate: '2025-02-01T08:00:00.000Z',
		siteAddressLine1: '1 test street',
		siteAddressPostcode: '1TT 2AA'
	};
	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
	 */
	let rows;

	// @ts-ignore
	beforeEach(() => (rows = bysRows(caseData, 'Test LPA')));

	it('should display the lpa name row', () => {
		expect(rows[0].keyText).toEqual(
			'Which local planning authority (LPA) do you want to appeal against?'
		);
		expect(rows[0].valueText).toEqual('Test LPA');
	});

	it('should display the enforcement notice row', () => {
		expect(rows[1].keyText).toEqual('Have you received an enforcement notice?');
		expect(rows[1].valueText).toEqual('No');
	});

	it('should display type of application the appeal is about row', () => {
		expect(rows[2].keyText).toEqual('What type of application is your appeal about?');
		expect(rows[2].valueText).toEqual('Full planning');
	});

	it('should display the date the application was submitted row', () => {
		expect(rows[3].keyText).toEqual('What date did you submit your application?');
		expect(rows[3].valueText).toEqual('1 Jan 2025');
	});

	it('should display whether the application was granted or refused row', () => {
		expect(rows[4].keyText).toEqual('Was your application granted or refused?');
		expect(rows[4].valueText).toEqual('Refused');
	});

	it('should display date on the decision letter from lpa row', () => {
		expect(rows[5].keyText).toEqual(
			'What is the date on the decision letter from the local planning authority?'
		);
		expect(rows[5].valueText).toEqual('1 Feb 2025');
	});
});
