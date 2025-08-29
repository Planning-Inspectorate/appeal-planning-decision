const {
	mapToLPADashboardDisplayData,
	mapToAppellantDashboardDisplayData,
	mapToRule6DashboardDisplayData,
	formatAddress,
	determineJourneyToDisplayLPADashboard,
	determineJourneyToDisplayRule6Dashboard,
	updateChildAppealDisplayData
} = require('./dashboard-functions');
const { calculateDueInDays } = require('@pins/common/src/lib/calculate-due-in-days');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');
const {
	APPEAL_CASE_STATUS,
	APPEAL_LINKED_CASE_STATUS
} = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_ID, APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const { SUBMISSIONS } = require('@pins/common/src/constants');

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

const testQuestionnaireJourney = {
	deadline: 'Tomorrow',
	dueInDays: 1,
	journeyDue: SUBMISSIONS.QUESTIONNAIRE,
	baseUrl: 'testQuestionnaireUrl'
};

const testLead1StatementJourney = {
	deadline: 'Tomorrow',
	dueInDays: 1,
	journeyDue: SUBMISSIONS.STATEMENT,
	baseUrl: 'testLead1StatementUrl'
};

const testLead2StatementJourney = {
	deadline: 'Tomorrow',
	dueInDays: 1,
	journeyDue: SUBMISSIONS.STATEMENT,
	baseUrl: 'testLead2StatementUrl'
};

const testChildStatementJourney = {
	deadline: 'Tomorrow and a day',
	dueInDays: 2,
	journeyDue: SUBMISSIONS.STATEMENT,
	baseUrl: 'testChildStatementUrl'
};

const testLeadDashboardData = {
	appealNumber: 'TestLeadCase',
	nextJourneyDue: testLead1StatementJourney,
	linkedCaseDetails: {
		linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.LEAD,
		leadCaseReference: 'TestLeadCase',
		linkedCaseStatusLabe: 'Lead'
	}
};
const testLeadDashboardData2 = {
	appealNumber: 'TestLeadCase2',
	nextJourneyDue: testLead2StatementJourney,
	linkedCaseDetails: {
		linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.LEAD,
		leadCaseReference: 'TestLeadCase2',
		linkedCaseStatusLabe: 'Lead'
	}
};
const testChildDashboardData = {
	appealNumber: 'TestChildCase',
	nextJourneyDue: testChildStatementJourney,
	linkedCaseDetails: {
		linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.CHILD,
		leadCaseReference: testLeadDashboardData.appealNumber,
		linkedCaseStatusLabe: 'Child'
	}
};

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
				journeyDue: SUBMISSIONS.QUESTIONNAIRE,
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
				journeyDue: SUBMISSIONS.STATEMENT,
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
				journeyDue: SUBMISSIONS.FINAL_COMMENT,
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
				journeyDue: SUBMISSIONS.PROOFS_EVIDENCE,
				baseUrl: proofsBaseUrl
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayLPADashboard(appealStatementDueDetails)).toEqual(
				expectedProofsDetails
			);
		});
	});

	describe('determineDocumentToDisplayRule6Dashboard', () => {
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
				journeyDue: SUBMISSIONS.STATEMENT,
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
				journeyDue: SUBMISSIONS.PROOFS_EVIDENCE,
				baseUrl: `${rule6ProofsBaseUrl}`
			};

			calculateDueInDays.mockReturnValue(23);

			expect(determineJourneyToDisplayRule6Dashboard(appealStatementDueDetails)).toEqual(
				expectedProofsDetails
			);
		});
	});

	describe('updateChildAppealDisplayData', () => {
		it('returns the input array if there are no lead cases', () => {
			expect(updateChildAppealDisplayData([testChildDashboardData])).toEqual([
				testChildDashboardData
			]);
		});

		it('does not update child appeal data if the child next journey is questionnaire', () => {
			const testChildDataAtQuestionnaire = structuredClone(testChildDashboardData);
			testChildDataAtQuestionnaire.nextJourneyDue = testQuestionnaireJourney;

			const testInputArray = [
				testLeadDashboardData,
				testLeadDashboardData2,
				testChildDataAtQuestionnaire
			];

			expect(updateChildAppealDisplayData(testInputArray)).toEqual(testInputArray);
		});

		it('updates a child appeal data with the relevant lead appeal journey', () => {
			const testInputArray = [
				testLeadDashboardData,
				testLeadDashboardData2,
				testChildDashboardData
			];

			const expectedUpdatedChild = {
				appealNumber: 'TestChildCase',
				nextJourneyDue: testLeadDashboardData.nextJourneyDue,
				linkedCaseDetails: {
					linkedCaseStatus: APPEAL_LINKED_CASE_STATUS.CHILD,
					leadCaseReference: testLeadDashboardData.appealNumber,
					linkedCaseStatusLabe: 'Child'
				}
			};

			const expectedOutputArray = [
				testLeadDashboardData,
				testLeadDashboardData2,
				expectedUpdatedChild
			];

			expect(updateChildAppealDisplayData(testInputArray)).toEqual(expectedOutputArray);
		});
	});

	const caseTypes = Object.values(CASE_TYPES);

	describe('mapToLPADashboardDisplayData', () => {
		caseTypes.forEach((caseType) => {
			it(`Appeal case returns the case type name for ${caseType.type}`, () => {
				expect(
					mapToLPADashboardDisplayData({
						...testLeadDashboardData,
						appealTypeCode: caseType.processCode
					})
				).toEqual(
					expect.objectContaining({
						appealType: caseType.type
					})
				);
			});
		});
	});

	describe('mapToAppellantDashboardDisplayData', () => {
		caseTypes.forEach((caseType) => {
			it(`Appeal case returns the case type name for ${caseType.type}`, () => {
				expect(
					mapToAppellantDashboardDisplayData({
						...testLeadDashboardData,
						appealTypeCode: caseType.processCode
					})
				).toEqual(
					expect.objectContaining({
						appealType: caseType.type
					})
				);
			});

			it(`V2 appeal drafts display on dashboard for ${caseType.type}`, () => {
				expect(
					mapToAppellantDashboardDisplayData({
						AppellantSubmission: {
							submitted: false,
							appealTypeCode: caseType.processCode,
							applicationDecisionDate: new Date().toISOString(),
							SubmissionAddress: [{}]
						}
					})
				).toEqual(
					expect.objectContaining({
						appealType: caseType.type
					})
				);
			});
		});

		it(`V1 appeal drafts displays on dashboard`, () => {
			expect(
				mapToAppellantDashboardDisplayData({
					appeal: {
						decisionDate: new Date().toISOString(),
						appealType: APPEAL_ID.PLANNING_SECTION_78,
						applicationDecision: APPLICATION_DECISION.REFUSED
					}
				})
			).toEqual(
				expect.objectContaining({
					appealType: 'Full appeal'
				})
			);

			expect(
				mapToAppellantDashboardDisplayData({
					appeal: {
						decisionDate: new Date().toISOString(),
						appealType: APPEAL_ID.HOUSEHOLDER,
						applicationDecision: APPLICATION_DECISION.REFUSED
					}
				})
			).toEqual(
				expect.objectContaining({
					appealType: 'Householder appeal'
				})
			);
		});
	});

	describe('mapToRule6DashboardDisplayData', () => {
		caseTypes.forEach((caseType) => {
			it(`Appeal case returns the case type name for ${caseType.type}`, () => {
				expect(
					mapToRule6DashboardDisplayData({
						...testLeadDashboardData,
						appealTypeCode: caseType.processCode
					})
				).toEqual(
					expect.objectContaining({
						appealType: caseType.type
					})
				);
			});
		});
	});
});
