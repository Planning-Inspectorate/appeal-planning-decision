const {
	formatAddress,
	determineDocumentToDisplayLPADashboard,
	isNewAppeal
} = require('../../../src/lib/dashboard-functions');

const { calculateDueInDays } = require('../../../src/lib/calculate-due-in-days');

jest.mock('../../../src/lib/calculate-due-in-days');

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
const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/appeal-comment';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

describe('lib/dashboard-functions', () => {
	beforeEach(() => {
		jest.resetAllMocks();
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

	describe('determineDocumentToDisplayLPADashboard', () => {
		it('returns default values if no documents are due', () => {
			expect(determineDocumentToDisplayLPADashboard({})).toEqual({
				deadline: null,
				dueInDays: 100000,
				documentDue: null,
				baseUrl: null
			});
		});

		it('returns the questionnaire details if the questionnaire has not been submitted', () => {
			const appealDetails = {
				lpaQuestionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				lpaQuestionnaireSubmittedDate: null,
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmitted: null
			};

			const expectedQuestionnaireDetails = {
				deadline: '2023-07-07T13:53:31.6003126+00:00',
				dueInDays: 3,
				documentDue: 'Questionnaire',
				baseUrl: questionnaireBaseUrl
			};

			calculateDueInDays.mockReturnValue(3);

			expect(determineDocumentToDisplayLPADashboard(appealDetails)).toEqual(
				expectedQuestionnaireDetails
			);
		});

		it('returns the statement details if the statement is next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmitted: null
			};

			const expectedStatementDetails = {
				deadline: '2023-07-17T13:53:31.6003126+00:00',
				dueInDays: 13,
				documentDue: 'Statement',
				baseUrl: statementBaseUrl
			};

			calculateDueInDays.mockReturnValue(13);

			expect(determineDocumentToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedStatementDetails
			);
		});

		it('returns the final comment details if the comments are next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmitted: '2023-07-17T13:53:31.6003126+00:00',
				finalCommentsDueDate: '2023-07-27T13:53:31.6003126+00:00',
				LPACommentsSubmitted: null
			};

			const expectedFinalCommentDetails = {
				deadline: '2023-07-27T13:53:31.6003126+00:00',
				dueInDays: 23,
				documentDue: 'Final comment',
				baseUrl: finalCommentBaseUrl
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineDocumentToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedFinalCommentDetails
			);
		});

		it('returns the proofs of evidence details if the proofs are next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmitted: '2023-07-17T13:53:31.6003126+00:00',
				proofsOfEvidenceDueDate: '2023-07-27T13:53:31.6003126+00:00',
				LPAProofsSubmitted: null
			};

			const expectedProofsDetails = {
				deadline: '2023-07-27T13:53:31.6003126+00:00',
				dueInDays: 23,
				documentDue: 'Proofs of Evidence',
				baseUrl: proofsBaseUrl
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineDocumentToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedProofsDetails
			);
		});
	});

	describe('isNewAppeal', () => {
		it('is true if an appeal is new, ie has no due dates set', () => {
			expect(isNewAppeal({})).toBe(true);
		});
		it('is false if an appeal has a questionnaire due set', () => {
			expect(
				isNewAppeal({
					lpaQuestionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00'
				})
			).toBe(false);
		});
	});
});
