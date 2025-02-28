const {
	formatAddress,
	determineJourneyToDisplayLPADashboard,
	determineJourneyToDisplayRule6Dashboard,
	isNewAppeal,
	shouldDisplayQuestionnaireDueNotification,
	shouldDisplayStatementsDueBannerLPA,
	isLpaStatementOpen,
	shouldDisplayStatementsDueBannerRule6,
	shouldDisplayFinalCommentsDueBannerLPA,
	shouldDisplayFinalCommentsDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerLPA,
	shouldDisplayProofEvidenceDueBannerRule6
} = require('./dashboard-functions');
const { deadlineHasPassed } = require('./deadline-has-passed');
const { calculateDueInDays } = require('./calculate-due-in-days');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');

const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { addDays, subDays } = require('date-fns');

const { APPEAL_CASE_STATUS } = require('pins-data-model');

jest.mock('./calculate-due-in-days');
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
const statementBaseUrl = `/manage-appeals/appeal-statement/${testCaseRef}/appeal-statement`;
const finalCommentBaseUrl = `/manage-appeals/final-comments/${testCaseRef}`;
const proofsBaseUrl = `/manage-appeals/proof-evidence/${testCaseRef}`;
const rule6StatementBaseUrl = '/rule-6/appeal-statement/';
const rule6ProofsBaseUrl = '/rule-6/proof-evidence/';

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
				baseUrl: `${rule6StatementBaseUrl}${testCaseRef}`
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
				baseUrl: `${rule6ProofsBaseUrl}${testCaseRef}`
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayRule6Dashboard(appealStatementDueDetails)).toEqual(
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

	describe('Action Banner Tests', () => {
		let currentDate = new Date();
		let caseData;
		beforeEach(() => {
			const { calculateDueInDays: realCalculateDueInDays } =
				jest.requireActual('./calculate-due-in-days');
			calculateDueInDays.mockImplementation((dateDue) => realCalculateDueInDays(dateDue));

			caseData = {
				// lpaq
				lpaQuestionnaireDueDate: addDays(currentDate, 7),
				lpaQuestionnaireSubmittedDate: null,
				lpaQuestionnairePublishedDate: null,
				// statements
				statementDueDate: addDays(currentDate, 35),
				appellantStatementSubmittedDate: null,
				LPAStatementSubmittedDate: null,
				// ip comments
				interestedPartyRepsDueDate: addDays(currentDate, 38),
				// final comments
				finalCommentsDueDate: addDays(currentDate, 40),
				LPACommentsSubmittedDate: null,
				appellantCommentsSubmittedDate: null,
				// proofs
				proofsOfEvidenceDueDate: addDays(currentDate, 42),
				appellantProofsSubmittedDate: null,
				LPAProofsSubmittedDate: null
			};
		});

		describe('shouldDisplayQuestionnaireDueNotification', () => {
			it('should return true when userType is LPA, questionnaire is due and not submitted', () => {
				expect(shouldDisplayQuestionnaireDueNotification(caseData, LPA_USER_ROLE)).toBe(true);
			});
			it('should return false when questionnaire has been submitted', () => {
				caseData.lpaQuestionnaireSubmittedDate = subDays(currentDate, 2);
				expect(shouldDisplayQuestionnaireDueNotification(caseData, LPA_USER_ROLE)).toBe(false);
			});
		});

		describe('shouldDisplayStatementsDueBannerLPA', () => {
			it('should return true when the statement deadline has not past and statement is not submitted', () => {
				caseData.lpaQuestionnaireDueDate = subDays(currentDate, 1);
				console.log(
					caseData.lpaQuestionnaireDueDate,
					deadlineHasPassed(caseData.lpaQuestionnaireDueDate),
					deadlineHasPassed(caseData.statementDueDate)
				);
				expect(shouldDisplayStatementsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
			});
			it('should return false for HAS with no statementDueDate', () => {
				const hasCaseData = {
					lpaQuestionnaireSubmittedDate: null,
					lpaQuestionnaireDueDate: subDays(currentDate, 1),
					lpaQuestionnairePublishedDate: null,
					statementDueDate: null
				};
				expect(shouldDisplayStatementsDueBannerLPA(hasCaseData, LPA_USER_ROLE)).toBe(false);
			});
			it('should return false when LPAStatementSubmittedDate has not past', () => {
				caseData.LPAStatementSubmittedDate = subDays(currentDate, 1);
				expect(shouldDisplayStatementsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(false);
			});
			it('should display both LPA statement and LPAQ banner if past questionnaire deadline and it has not been submitted', () => {
				caseData.lpaQuestionnaireDueDate = subDays(currentDate, 1);
				expect(shouldDisplayQuestionnaireDueNotification(caseData, LPA_USER_ROLE)).toBe(true);
				expect(shouldDisplayStatementsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
			});
			it('should only display LPA statement if past questionnaire deadline and it has been submitted', () => {
				caseData.lpaQuestionnaireDueDate = subDays(currentDate, 1);
				caseData.lpaQuestionnaireSubmittedDate = currentDate;
				expect(shouldDisplayQuestionnaireDueNotification(caseData, LPA_USER_ROLE)).toBe(false);
				expect(shouldDisplayStatementsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
			});
		});

		describe('shouldDisplayStatementsDueBannerRule6', () => {
			it('should return true for Rule 6 party with published LPAQ and statement due', () => {
				caseData.lpaQuestionnairePublishedDate = subDays(currentDate, 1);
				expect(
					shouldDisplayStatementsDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)
				).toBe(true);
			});
			// it('should return false when rule6StatementSubmitted is true', () => {
			// 	caseData.rule6StatementSubmitted = true;
			// 	expect(shouldDisplayStatementsDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(
			// 		false
			// 	);
			// });
		});

		describe('shouldDisplayFinalCommentsDueBannerLPA', () => {
			it('should return true when final comments are due for LPA', () => {
				caseData.statementDueDate = subDays(currentDate, 5);
				caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
				expect(shouldDisplayFinalCommentsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
			});
			it('should return false when final comments are published', () => {
				caseData.lpaFinalCommentsPublished = true;
				expect(shouldDisplayFinalCommentsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(false);
			});
		});

		describe('shouldDisplayFinalCommentsDueBannerAppellant', () => {
			it('should return true when final comments are due for the appellant', () => {
				caseData.statementDueDate = subDays(currentDate, 5);
				caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
				expect(
					shouldDisplayFinalCommentsDueBannerAppellant(caseData, APPEAL_USER_ROLES.APPELLANT)
				).toBe(true);
			});
			it('should return false when appellantCommentsSubmittedDate is set', () => {
				caseData.appellantCommentsSubmittedDate = new Date();
				expect(
					shouldDisplayFinalCommentsDueBannerAppellant(caseData, APPEAL_USER_ROLES.APPELLANT)
				).toBe(false);
			});
		});

		describe('shouldDisplayProofEvidenceDueBannerAppellant', () => {
			it('should return true when proofs of evidence are due for the appellant', () => {
				caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
				caseData.statementDueDate = subDays(currentDate, 5);
				caseData.finalCommentsDueDate = subDays(currentDate, 3);
				expect(
					shouldDisplayProofEvidenceDueBannerAppellant(caseData, APPEAL_USER_ROLES.APPELLANT)
				).toBe(true);
			});
			it('should return false when appellantProofsSubmittedDate is true', () => {
				caseData.appellantProofsSubmittedDate = true;
				expect(
					shouldDisplayProofEvidenceDueBannerAppellant(caseData, APPEAL_USER_ROLES.APPELLANT)
				).toBe(false);
			});
		});

		describe('shouldDisplayProofEvidenceDueBannerLPA', () => {
			it('should return true when proofs of evidence are due for the LPA', () => {
				caseData.LPAProofsSubmittedDate = null;
				caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
				caseData.statementDueDate = subDays(currentDate, 5);
				caseData.finalCommentsDueDate = subDays(currentDate, 3);
				expect(shouldDisplayProofEvidenceDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
			});
			it('should return false when lpaProofEvidenceSubmitted is set', () => {
				caseData.LPAProofsSubmittedDate = new Date();
				expect(shouldDisplayProofEvidenceDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(false);
			});
		});

		describe('shouldDisplayProofEvidenceDueBannerRule6', () => {
			it('should return true when proofs of evidence are due for Rule 6 party', () => {
				caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
				caseData.statementDueDate = subDays(currentDate, 5);
				caseData.finalCommentsDueDate = subDays(currentDate, 3);
				expect(
					shouldDisplayProofEvidenceDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)
				).toBe(true);
			});
			it('should return false when rule6ProofEvidenceSubmitted is true', () => {
				caseData.rule6ProofEvidenceSubmitted = true;
				expect(
					shouldDisplayProofEvidenceDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)
				).toBe(false);
			});
		});
	});
	describe('isLpaStatementOpen', () => {
		const currentDate = new Date();
		beforeEach(() => {
			const { calculateDueInDays: realCalculateDueInDays } =
				jest.requireActual('./calculate-due-in-days');
			calculateDueInDays.mockImplementation((dateDue) => realCalculateDueInDays(dateDue));
		});
		it('should return false if lpaQuestionnaireDueDate is in the future and caseStatus is not STATEMENTS', () => {
			const appeal = {
				lpaQuestionnaireDueDate: addDays(currentDate, 2),
				caseStatus: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE
			};
			expect(isLpaStatementOpen(appeal)).toBe(false);
		});
		it('should return true if lpaQuestionnaireDueDate is in the past and caseStatus is not STATEMENTS', () => {
			const appeal = {
				lpaQuestionnaireDueDate: subDays(currentDate, 2),
				caseStatus: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE
			};
			expect(isLpaStatementOpen(appeal)).toBe(true);
		});
		it('should return true if caseStatus is STATEMENTS even if lpaQuestionnaireDueDate is in the future', () => {
			const appeal = {
				lpaQuestionnaireDueDate: addDays(currentDate, 2),
				caseStatus: APPEAL_CASE_STATUS.STATEMENTS
			};
			expect(isLpaStatementOpen(appeal)).toBe(true);
		});
		it('should return true if caseStatus is STATEMENTS and lpaQuestionnaireDueDate is in the past', () => {
			const appeal = {
				lpaQuestionnaireDueDate: subDays(currentDate, 2),
				caseStatus: APPEAL_CASE_STATUS.STATEMENTS
			};
			expect(isLpaStatementOpen(appeal)).toBe(true);
		});
	});
});
