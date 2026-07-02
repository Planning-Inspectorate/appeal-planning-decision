const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { bysRows } = require('./appeal-before-you-start-rows');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

describe('bys-rows - non-enforcement', () => {
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
	beforeEach(() => (rows = bysRows(caseData, 'Test LPA', true)));

	it('should display the lpa name row', () => {
		expect(rows[0].keyText).toEqual(
			'Which local planning authority (LPA) do you want to appeal against?'
		);
		expect(rows[0].valueText).toEqual('Test LPA');
	});

	it('should display type of application the appeal is about row', () => {
		expect(rows[1].keyText).toEqual('What is your appeal about?');
		expect(rows[1].valueText).toEqual('Full planning');
	});

	it('should display the date the application was submitted row', () => {
		expect(rows[2].keyText).toEqual('What date did you submit your application?');
		expect(rows[2].valueText).toEqual('1 Jan 2025');
	});

	it('should display whether the application was granted or refused row', () => {
		expect(rows[3].keyText).toEqual('Was your application granted or refused?');
		expect(rows[3].valueText).toEqual('Refused');
	});

	it('should display date on the decision letter from lpa row', () => {
		expect(rows[4].keyText).toEqual(
			'What is the date on the decision letter from the local planning authority?'
		);
		expect(rows[4].valueText).toEqual('1 Feb 2025');
	});

	it('should display when was decision due question when decision is not_received', () => {
		const data = structuredClone(caseData);
		data.applicationDecision = 'not_received';
		// @ts-ignore
		const rowData = bysRows(data, 'Test LPA');
		expect(rowData[4].keyText).toEqual(
			'What date was your decision due from the local planning authority?'
		);
		expect(rows[4].valueText).toEqual('1 Feb 2025');
	});

	test.each([
		['Enforcement issue date', 5],
		['Enforcement effective', 6],
		['Contact PINS', 7],
		['Contact PINS date', 8],
		['Enforcement reference', 9]
	])('should not display field for %s', (_, rowNumber) => {
		expect(rows[rowNumber].condition()).toBeFalsy();
	});
});

describe('bys-rows - enforcement and enforcement listed', () => {
	const enforcementCaseData = {
		caseReference: 'test-ref',
		LPACode: '111111',
		appealTypeCode: CASE_TYPES.ENFORCEMENT.processCode,
		enforcementNotice: true,
		issueDateOfEnforcementNotice: '2025-02-01T08:00:00.000Z',
		effectiveDateOfEnforcementNotice: '2025-02-01T08:00:00.000Z',
		contactPlanningInspectorateDate: '2025-02-01T08:00:00.000Z',
		enforcementReference: 'enf-ref'
	};
	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
	 */
	let rows;

	// @ts-ignore
	beforeEach(() => (rows = bysRows(enforcementCaseData, 'Test LPA', true)));

	it('should display the lpa name row', () => {
		expect(rows[0].keyText).toEqual(
			'Which local planning authority (LPA) do you want to appeal against?'
		);
		expect(rows[0].valueText).toEqual('Test LPA');
	});

	it('should display type of application the appeal is about row - enforcement notice', () => {
		expect(rows[1].keyText).toEqual('What is your appeal about?');
		expect(rows[1].valueText).toEqual('Enforcement notice');
	});

	it('should display type of application the appeal is about row - elb', () => {
		const data = structuredClone(enforcementCaseData);
		data.appealTypeCode = CASE_TYPES.ENFORCEMENT_LISTED.processCode;
		// @ts-ignore
		const rowData = bysRows(data, 'Test LPA', true);
		expect(rowData[1].keyText).toEqual('What is your appeal about?');
		expect(rowData[1].valueText).toEqual('Enforcement listed building and conservation area');
	});

	test.each([
		['Submission date', 2],
		['Application decision', 3],
		['Decision date', 4]
	])('should not display field for %s', (_, rowNumber) => {
		expect(rows[rowNumber].condition()).toBeFalsy();
	});

	it('should display issue date of enforcement notice row', () => {
		expect(rows[5].keyText).toEqual('What is the issue date on your enforcement notice?');
		expect(rows[5].valueText).toEqual('1 Feb 2025');
	});

	it('should display effective date of enforcement notice row', () => {
		expect(rows[6].keyText).toEqual('What is the effective date on your enforcement notice?');
		expect(rows[6].valueText).toEqual('1 Feb 2025');
	});

	it('should display contact PINS row if relevant', () => {
		expect(rows[7].keyText).toEqual(
			'Did you contact the Planning Inspectorate to tell them you will appeal the enforcement notice?'
		);
		expect(rows[7].valueText).toEqual('Yes');
	});

	it('should display contact PINS date row if relevant', () => {
		expect(rows[8].keyText).toEqual('When did you contact the Planning Inspectorate?');
		expect(rows[8].valueText).toEqual('1 Feb 2025');
	});

	it('should display enforcement reference row', () => {
		expect(rows[9].keyText).toEqual('What is the reference number on the enforcement notice?');
		expect(rows[9].valueText).toEqual('enf-ref');
	});
});

describe('bys-rows - ldc no application', () => {
	const ldcCaseData = {
		caseReference: 'test-ref',
		LPACode: '111111',
		appealTypeCode: CASE_TYPES.LDC.processCode,
		applicationReference: 'app-ref',
		enforcementNotice: false,
		typeOfPlanningApplication: 'lawful-development-certificate',
		applicationDate: '2025-01-01T08:00:00.000Z',
		siteAddressLine1: '1 test street',
		siteAddressPostcode: '1TT 2AA'
	};

	/**
	 * @type {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
	 */
	let rows;

	// @ts-ignore
	beforeEach(() => (rows = bysRows(ldcCaseData, 'Test LPA')));

	it('should display the lpa name row', () => {
		expect(rows[0].keyText).toEqual(
			'Which local planning authority (LPA) do you want to appeal against?'
		);
		expect(rows[0].valueText).toEqual('Test LPA');
	});

	it('should display type of application the appeal is about row', () => {
		expect(rows[1].keyText).toEqual('What is your appeal about?');
		expect(rows[1].valueText).toEqual('Lawful development certificate');
	});

	it('should display the date the application was submitted row', () => {
		expect(rows[2].keyText).toEqual('What date did you submit your application?');
		expect(rows[2].valueText).toEqual('1 Jan 2025');
	});

	it('should display whether the application was granted or refused row', () => {
		expect(rows[3].keyText).toEqual('Was your application granted or refused?');
		expect(rows[3].condition(ldcCaseData)).toEqual(false);
	});

	it('should display date on the decision letter from lpa row', () => {
		expect(rows[4].keyText).toEqual(
			'What is the date on the decision letter from the local planning authority?'
		);
		expect(rows[5].condition(ldcCaseData)).toEqual(false);
	});

	test.each([
		['Enforcement issue date', 5],
		['Enforcement effective', 6],
		['Contact PINS', 7],
		['Contact PINS date', 8],
		['Enforcement reference', 9]
	])('should not display field for %s', (_, rowNumber) => {
		expect(rows[rowNumber].condition()).toBeFalsy();
	});
});
