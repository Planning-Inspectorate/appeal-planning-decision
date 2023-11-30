const {
	extractAppealNumber,
	formatAddress,
	formatAppealType,
	// determineDocumentToDisplayLPADashboard,
	isNewAppeal
} = require('../../../src/lib/dashboard-functions');

const TEST_CASE_REFERENCE = 'APP/Q9999/W/22/1234567';
const FULL_TEST_ADDRESS = {
	siteAddressLine1: 'Test Address Line 1',
	siteAddressLine2: 'Test Address Line 2',
	siteAddressTown: 'Test Town',
	siteAddressPostcode: 'TS1 1TT'
};
const NO_LINE_2_ADDRESS = {
	siteAddressLine1: 'Test Address Line 1',
	siteAddressTown: 'Test Town',
	siteAddressPostcode: 'TS1 1TT'
};

describe('lib/dashboard-functions', () => {
	describe('extractAppealNumber', () => {
		it('extracts the 7 digit appeal number from a longer case reference', () => {
			expect(extractAppealNumber(TEST_CASE_REFERENCE)).toEqual('1234567');
		});
	});

	describe('formatAddress', () => {
		it('formats address parts into a single string', () => {
			const expectedFullAddress = 'Test Address Line 1, Test Address Line 2, Test Town, TS1 1TT';

			expect(formatAddress(FULL_TEST_ADDRESS)).toEqual(expectedFullAddress);
		});

		it('skips addressLine2 if none is provided', () => {
			const expectedPartialAddress = 'Test Address Line 1, Test Town, TS1 1TT';

			expect(formatAddress(NO_LINE_2_ADDRESS)).toEqual(expectedPartialAddress);
		});
	});

	describe('formatAppealType', () => {
		it('returns appeal types for a HAS appeal', () => {
			const hasAppeal = 'Householder (HAS) Appeal';

			expect(formatAppealType(hasAppeal)).toEqual({
				long: 'Householder',
				short: 'HAS'
			});
		});

		it('returns appeal types for a s.78 appeal', () => {
			const s78Appeal = 'Full Planning (S78) Appeal';

			expect(formatAppealType(s78Appeal)).toEqual({
				long: 'Full planning',
				short: 'S78'
			});
		});
	});

	// describe('determineDocumentToDisplayLPADashboard', () => {
	// 	it('returns "NEW" if no due date has been set', () => {
	// 		expect(determineDeadlineToDisplayLPADashboard({})).toEqual('NEW');
	// 	});

	// 	it('returns the questionnaireDueDate if the questionnaire has not been submitted', () => {
	// 		const appealDetails = {
	// 			questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
	// 			questionnaireReceived: null
	// 		};

	// 		expect(determineDeadlineToDisplayLPADashboard(appealDetails)).toEqual(
	// 			'2023-07-07T13:53:31.6003126+00:00'
	// 		);
	// 	});

	// 	it('returns the statementDueDate if the questionnaire has been returned and statement is next in proximity', () => {
	// 		const appealStatementDueDetails = {
	// 			questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
	// 			questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
	// 			statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
	// 			LPAStatementSubmitted: null
	// 		};

	// 		expect(determineDeadlineToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
	// 			'2023-07-17T13:53:31.6003126+00:00'
	// 		);
	// 	});
	// });

	describe('isNewAppeal', () => {
		it('is true if an appeal is new, ie has no due dates set', () => {
			expect(isNewAppeal({})).toBe(true);
		});
		it('is false if an appeal has a questionnaire due set', () => {
			expect(
				isNewAppeal({
					questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00'
				})
			).toBe(false);
		});
	});
});
