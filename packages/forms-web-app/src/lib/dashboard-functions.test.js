const {
	formatAddress,
	determineJourneyToDisplayLPADashboard,
	determineJourneyToDisplayRule6Dashboard
} = require('./dashboard-functions');
const { calculateDueInDays } = require('@pins/common/src/lib/calculate-due-in-days');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');
const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');

jest.mock('@pins/common/src/lib/calculate-due-in-days');
jest.mock('./calculate-days-since-invalidated');

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

const testCaseRef = '1010101';

const questionnaireBaseUrl = `/manage-appeals/questionnaire/${testCaseRef}`;
const statementBaseUrl = `/manage-appeals/appeal-statement/${testCaseRef}/entry`;
const finalCommentBaseUrl = `/manage-appeals/final-comments/${testCaseRef}/entry`;
const proofsBaseUrl = `/manage-appeals/proof-evidence/${testCaseRef}/entry`;
const rule6StatementBaseUrl = `/rule-6/appeal-statement/${testCaseRef}/entry`;
const rule6ProofsBaseUrl = `/rule-6/proof-evidence/${testCaseRef}/entry`;

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

	describe('determineJourneyToDisplayLPADashboard', () => {
		it('returns default values if no documents are due', () => {
			expect(determineJourneyToDisplayLPADashboard({})).toEqual({
				deadline: null,
				dueInDays: 100000,
				journeyDue: null,
				baseUrl: null
			});
		});

		it('returns invalid appeal details if the appeal has been invalidated within 28 days', () => {
			const invalidAppealDetails = {
				caseStatus: APPEAL_CASE_STATUS.INVALID
			};

			calculateDaysSinceInvalidated.mockReturnValue(1);

			expect(determineJourneyToDisplayLPADashboard(invalidAppealDetails)).toEqual({
				deadline: null,
				dueInDays: -100000,
				journeyDue: null
			});
		});

		it('returns default values if the appeal has been invalidated for more than 28 days', () => {
			const invalidAppealDetails = {
				caseStatus: APPEAL_CASE_STATUS.INVALID
			};

			calculateDaysSinceInvalidated.mockReturnValue(100);

			expect(determineJourneyToDisplayLPADashboard(invalidAppealDetails)).toEqual({
				deadline: null,
				dueInDays: 100000,
				journeyDue: null,
				baseUrl: null
			});
		});

		it('returns the questionnaire details if the questionnaire has not been submitted', () => {
			const appealDetails = {
				lpaQuestionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				lpaQuestionnaireSubmittedDate: null,
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmittedDate: null,
				caseReference: testCaseRef,
				caseStatus: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE
			};

			const expectedQuestionnaireDetails = {
				deadline: '2023-07-07T13:53:31.6003126+00:00',
				dueInDays: 3,
				journeyDue: 'Questionnaire',
				baseUrl: questionnaireBaseUrl
			};

			calculateDueInDays.mockReturnValue(3);

			expect(determineJourneyToDisplayLPADashboard(appealDetails)).toEqual(
				expectedQuestionnaireDetails
			);
		});

		it('returns the statement details if the statement is next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmittedDate: null,
				caseReference: testCaseRef,
				caseStatus: APPEAL_CASE_STATUS.STATEMENTS
			};

			const expectedStatementDetails = {
				deadline: '2023-07-17T13:53:31.6003126+00:00',
				dueInDays: 13,
				journeyDue: 'Statement',
				baseUrl: statementBaseUrl
			};

			calculateDueInDays.mockReturnValue(13);

			expect(determineJourneyToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedStatementDetails
			);
		});

		it('returns the final comment details if the comments are next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmittedDate: '2023-07-17T13:53:31.6003126+00:00',
				finalCommentsDueDate: '2023-07-27T13:53:31.6003126+00:00',
				LPACommentsSubmittedDate: null,
				caseStatus: APPEAL_CASE_STATUS.FINAL_COMMENTS,
				caseReference: testCaseRef
			};

			const expectedFinalCommentDetails = {
				deadline: '2023-07-27T13:53:31.6003126+00:00',
				dueInDays: 23,
				journeyDue: 'Final comment',
				baseUrl: finalCommentBaseUrl
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedFinalCommentDetails
			);
		});

		it('returns the proofs of evidence details if the proofs are next in proximity', () => {
			const appealStatementDueDetails = {
				questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
				questionnaireReceived: '2023-07-07T13:54:31.6003126+00:00',
				statementDueDate: '2023-07-17T13:53:31.6003126+00:00',
				LPAStatementSubmittedDate: '2023-07-17T13:53:31.6003126+00:00',
				proofsOfEvidenceDueDate: '2023-07-27T13:53:31.6003126+00:00',
				LPAProofsSubmittedDate: null,
				caseStatus: APPEAL_CASE_STATUS.EVIDENCE,
				caseReference: testCaseRef
			};

			const expectedProofsDetails = {
				deadline: '2023-07-27T13:53:31.6003126+00:00',
				dueInDays: 23,
				journeyDue: 'Proofs of Evidence',
				baseUrl: proofsBaseUrl
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedProofsDetails
			);
		});
	});

	describe('determineDocumentToDisplayRul6Dashboard', () => {
		it('returns default values if no documents are due', () => {
			expect(determineJourneyToDisplayRule6Dashboard({})).toEqual({
				deadline: null,
				dueInDays: 100000,
				journeyDue: null,
				baseUrl: null
			});
		});

		it('returns the rule 6 statement details if the statement is next in proximity', () => {
			const appealStatementDueDetails = {
				statementDueDate: '2023-07-07T13:53:31.6003126+00:00',
				// rule6StatementSubmitted: null,
				caseReference: testCaseRef,
				caseStatus: APPEAL_CASE_STATUS.STATEMENTS
			};

			const expectedStatementDetails = {
				deadline: '2023-07-07T13:53:31.6003126+00:00',
				dueInDays: 13,
				journeyDue: 'Statement',
				baseUrl: `${rule6StatementBaseUrl}`
			};

			calculateDueInDays.mockReturnValue(13);

			expect(determineJourneyToDisplayRule6Dashboard(appealStatementDueDetails)).toEqual(
				expectedStatementDetails
			);
		});

		it('returns the rule 6 proofs of evidence details if the proofs are next in proximity', () => {
			const appealStatementDueDetails = {
				proofsOfEvidenceDueDate: '2023-07-27T13:53:31.6003126+00:00',
				//rule6ProofEvidenceSubmitted: null,
				caseStatus: APPEAL_CASE_STATUS.EVIDENCE,
				caseReference: testCaseRef
			};

			const expectedProofsDetails = {
				deadline: '2023-07-27T13:53:31.6003126+00:00',
				dueInDays: 23,
				journeyDue: 'Proof of Evidence',
				baseUrl: `${rule6ProofsBaseUrl}`
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayRule6Dashboard(appealStatementDueDetails)).toEqual(
				expectedProofsDetails
			);
		});
	});
});
