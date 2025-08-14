const {
	isNewAppealForLPA,
	isLPAQuestionnaireOpen,
	isLPAQuestionnaireDue,
	isLPAStatementOpen,
	isRule6StatementOpen,
	isAppellantProofsOfEvidenceOpen,
	isLPAProofsOfEvidenceOpen,
	isRule6ProofsOfEvidenceOpen,
	isAppellantFinalCommentOpen,
	isLPAFinalCommentOpen
} = require('./case-due-dates');
const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');
const { deadlineHasPassed } = require('@pins/common/src/lib/deadline-has-passed');
const { representationExists } = require('@pins/common/src/lib/representations');

jest.mock('@pins/common/src/lib/deadline-has-passed');
jest.mock('@pins/common/src/lib/representations');

describe('case-due-dates', () => {
	/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */
	let appealCaseData;

	beforeEach(() => {
		appealCaseData = {
			caseReference: 'testCaseReference',
			lpaQuestionnaireDueDate: null,
			lpaQuestionnaireSubmittedDate: null,
			caseStatus: null,
			statementDueDate: null,
			lpaQuestionnaireValidationOutcomeDate: null,
			LPAStatementSubmittedDate: null,
			proofsOfEvidenceDueDate: null,
			appellantProofsSubmittedDate: null,
			LPACommentsSubmittedDate: null,
			finalCommentsDueDate: null,
			appellantCommentsSubmittedDate: null,
			Representations: []
		};
	});

	describe('LPAQ', () => {
		describe('isNewAppealForLPA', () => {
			it('should return true if lpaQuestionnaireDueDate not set', () => {
				expect(isNewAppealForLPA(appealCaseData)).toBe(true);
			});

			it('should return false if lpaQuestionnaireDueDate is set', () => {
				appealCaseData.lpaQuestionnaireDueDate = '2025-03-01';
				expect(isNewAppealForLPA(appealCaseData)).toBe(false);
			});
		});

		describe('isLPAQuestionnaireOpen', () => {
			it('should return true if lpaQuestionnaireDueDate is set and lpaq has not been submitted', () => {
				appealCaseData.lpaQuestionnaireDueDate = '2025-03-01';
				expect(isLPAQuestionnaireOpen(appealCaseData)).toBe(true);
			});

			it('should return false if lpaQuestionnaireDueDate is not set', () => {
				expect(isLPAQuestionnaireOpen(appealCaseData)).toBe(false);
			});

			it('should return false if and lpaq has been submitted', () => {
				appealCaseData.lpaQuestionnaireDueDate = '2025-03-01';
				appealCaseData.lpaQuestionnaireSubmittedDate = '2025-03-02';
				expect(isLPAQuestionnaireOpen(appealCaseData)).toBe(false);
			});
		});

		describe('isLPAQuestionnaireDue', () => {
			it('should return true if questionnaire is open and caseStatus is LPA_QUESTIONNAIRE', () => {
				appealCaseData.lpaQuestionnaireDueDate = '2025-03-01';
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE;
				expect(isLPAQuestionnaireDue(appealCaseData)).toBe(true);
			});

			it('should return false if questionnaire is not open', () => {
				expect(isLPAQuestionnaireDue(appealCaseData)).toBe(false);
			});

			it('should return false if caseStatus is not LPA_QUESTIONNAIRE', () => {
				appealCaseData.lpaQuestionnaireDueDate = '2025-03-01';
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.STATEMENTS;
				expect(isLPAQuestionnaireDue(appealCaseData)).toBe(false);
			});
		});
	});

	describe('Statement', () => {
		describe('isLPAStatementOpen', () => {
			it('should return true if lpaq has been submitted and not statement submitted already', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValueOnce(false);
				appealCaseData.lpaQuestionnaireValidationOutcomeDate = '2025-03-01';
				expect(isLPAStatementOpen(appealCaseData)).toBe(true);
			});

			it('should return true if lpaQuestionnaireDueDate has passed and statement not submitted already', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValueOnce(false);
				deadlineHasPassed.mockReturnValueOnce(true);
				expect(isLPAStatementOpen(appealCaseData)).toBe(true);
			});

			it('should return true if in STATEMENTS stage and statement not submitted already', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.STATEMENTS;
				expect(isLPAStatementOpen(appealCaseData)).toBe(true);
			});

			it('should return true if case is a lead linked case and other conditions are satisfied', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValueOnce(false);
				appealCaseData.lpaQuestionnaireValidationOutcomeDate = '2025-03-01';
				appealCaseData.linkedCases = [
					{
						childCaseReference: 'aDifferentCase',
						leadCaseReference: appealCaseData.caseReference
					}
				];
				expect(isLPAStatementOpen(appealCaseData)).toBe(true);
			});

			it('should return false if statements are not open', () => {
				expect(isLPAStatementOpen(appealCaseData)).toBe(false);
			});

			it('should return false if LPAStatementSubmittedDate is set', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.STATEMENTS;
				appealCaseData.LPAStatementSubmittedDate = '2025-03-02';
				expect(isLPAStatementOpen(appealCaseData)).toBe(false);
			});

			it('should return false if case is a child linked case', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValueOnce(false);
				appealCaseData.lpaQuestionnaireValidationOutcomeDate = '2025-03-01';
				appealCaseData.linkedCases = [
					{
						childCaseReference: appealCaseData.caseReference,
						leadCaseReference: 'testLeadReference'
					}
				];
				expect(isLPAStatementOpen(appealCaseData)).toBe(false);
			});
		});

		describe('isRule6StatementOpen', () => {
			it('should return true if statements are open and no representation exists for rule 6 parties', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.STATEMENTS;
				representationExists.mockReturnValue(false);
				expect(isRule6StatementOpen(appealCaseData)).toBe(true);
			});

			it('should return false if statements are not open', () => {
				expect(isRule6StatementOpen(appealCaseData)).toBe(false);
			});

			it('should return false if representation exists for rule 6 parties', () => {
				appealCaseData.statementDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.STATEMENTS;
				representationExists.mockReturnValue(true);
				expect(isRule6StatementOpen(appealCaseData)).toBe(false);
			});
		});
	});

	describe('Proofs', () => {
		describe('isAppellantProofsOfEvidenceOpen', () => {
			it('should return true if proofs are open and appellantProofsSubmittedDate is not set', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				expect(isAppellantProofsOfEvidenceOpen(appealCaseData)).toBe(true);
			});

			it('should return false if proofs are not open', () => {
				expect(isAppellantProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});

			it('should return false if appellantProofsSubmittedDate is set', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				appealCaseData.appellantProofsSubmittedDate = '2025-03-02';
				expect(isAppellantProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});
		});

		describe('isLPAProofsOfEvidenceOpen', () => {
			it('should return true if proofs are open and lpa has not submitted proofs', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				expect(isLPAProofsOfEvidenceOpen(appealCaseData)).toBe(true);
			});

			it('should return false if proofs are not open', () => {
				expect(isLPAProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});

			it('should return false if and lpa has already submitted proofs', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				appealCaseData.LPAProofsSubmittedDate = '2025-03-02';
				expect(isLPAProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});
		});

		describe('isRule6ProofsOfEvidenceOpen', () => {
			it('should return true if proofs are open and no representation exists for rule 6 parties', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				representationExists.mockReturnValue(false);
				expect(isRule6ProofsOfEvidenceOpen(appealCaseData)).toBe(true);
			});

			it('should return false if proofs are not open', () => {
				expect(isRule6ProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});

			it('should return false if representation exists for rule 6 parties', () => {
				appealCaseData.proofsOfEvidenceDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.EVIDENCE;
				representationExists.mockReturnValue(true);
				expect(isRule6ProofsOfEvidenceOpen(appealCaseData)).toBe(false);
			});
		});
	});

	describe('Final Comments', () => {
		describe('isAppellantFinalCommentOpen', () => {
			it('should return true if final comments are open and appellant has not submitted', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				expect(isAppellantFinalCommentOpen(appealCaseData)).toBe(true);
			});

			it('should return true if case is a lead linked case and other conditions satisfied', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.linkedCases = [
					{
						childCaseReference: 'aDifferentCaseReference',
						leadCaseReference: appealCaseData.caseReference
					}
				];
				expect(isAppellantFinalCommentOpen(appealCaseData)).toBe(true);
			});

			it('should return false if final comments are not open', () => {
				expect(isAppellantFinalCommentOpen(appealCaseData)).toBe(false);
			});

			it('should return false if final comments are open and appellant has already submitted', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.appellantCommentsSubmittedDate = '2025-03-02';
				expect(isAppellantFinalCommentOpen(appealCaseData)).toBe(false);
			});

			it('should return false if case is a child linked case', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.linkedCases = [
					{
						childCaseReference: appealCaseData.caseReference,
						leadCaseReference: 'testLeadReference'
					}
				];
				expect(isAppellantFinalCommentOpen(appealCaseData)).toBe(false);
			});
		});

		describe('isLPAFinalCommentOpen', () => {
			it('should return true if final comments are open and lpa has not submitted', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				expect(isLPAFinalCommentOpen(appealCaseData)).toBe(true);
			});

			it('should return true if case is a lead linked case and other conditions are satisfied', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.linkedCases = [
					{
						childCaseReference: 'aDifferentCaseReference',
						leadCaseReference: appealCaseData.caseReference
					}
				];
				expect(isLPAFinalCommentOpen(appealCaseData)).toBe(true);
			});

			it('should return false if final comments are not open', () => {
				expect(isLPAFinalCommentOpen(appealCaseData)).toBe(false);
			});

			it('should return false if final comments are open and lpa has already submitted', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.LPACommentsSubmittedDate = '2025-03-02';
				expect(isLPAFinalCommentOpen(appealCaseData)).toBe(false);
			});

			it('should return false if case is a child linked case', () => {
				appealCaseData.finalCommentsDueDate = '2025-03-01';
				deadlineHasPassed.mockReturnValue(false);
				appealCaseData.caseStatus = APPEAL_CASE_STATUS.FINAL_COMMENTS;
				appealCaseData.linkedCases = [
					{
						childCaseReference: appealCaseData.caseReference,
						leadCaseReference: 'testLeadReference'
					}
				];
				expect(isLPAFinalCommentOpen(appealCaseData)).toBe(false);
			});
		});
	});
});
