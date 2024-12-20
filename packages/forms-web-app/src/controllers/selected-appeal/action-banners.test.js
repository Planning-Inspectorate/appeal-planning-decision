const {
	shouldDisplayQuestionnaireDueNotification,
	shouldDisplayStatementsDueBannerLPA,
	shouldDisplayStatementsDueBannerRule6,
	shouldDisplayFinalCommentsDueBannerLPA,
	shouldDisplayFinalCommentsDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerLPA,
	shouldDisplayProofEvidenceDueBannerRule6
} = require('./action-banners');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { addDays, subDays } = require('date-fns');

const currentDate = new Date();

describe('Action Banner Tests', () => {
	let caseData;
	beforeEach(() => {
		caseData = {
			lpaQuestionnaireSubmittedDate: null,
			lpaQuestionnaireDueDate: addDays(currentDate, 7),
			lpaQuestionnairePublishedDate: null,
			statementDueDate: addDays(currentDate, 35),
			rule6StatementDueDate: addDays(currentDate, 35),
			interestedPartyRepsDueDate: addDays(currentDate, 38),
			finalCommentsDueDate: addDays(currentDate, 40),
			proofsOfEvidenceDueDate: addDays(currentDate, 42),
			rule6ProofEvidenceDueDate: addDays(currentDate, 42),
			LPAStatementSubmitted: false,
			lpaFinalCommentsPublished: false,
			appellantFinalCommentsSubmitted: false,
			appellantsProofsSubmitted: false,
			lpaProofEvidenceSubmitted: false,
			rule6ProofEvidenceSubmitted: false,
			rule6StatementSubmitted: false
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
			expect(shouldDisplayStatementsDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
		});
		it('should return false when LPAStatementSubmitted is true', () => {
			caseData.LPAStatementSubmitted = true;
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
			expect(shouldDisplayStatementsDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(
				true
			);
		});
		it('should return false when rule6StatementSubmitted is true', () => {
			caseData.rule6StatementSubmitted = true;
			expect(shouldDisplayStatementsDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(
				false
			);
		});
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
		it('should return false when appellantFinalCommentsSubmitted is true', () => {
			caseData.appellantFinalCommentsSubmitted = true;
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
		it('should return false when appellantsProofsSubmitted is true', () => {
			caseData.appellantsProofsSubmitted = true;
			expect(
				shouldDisplayProofEvidenceDueBannerAppellant(caseData, APPEAL_USER_ROLES.APPELLANT)
			).toBe(false);
		});
	});
	describe('shouldDisplayProofEvidenceDueBannerLPA', () => {
		it('should return true when proofs of evidence are due for the LPA', () => {
			caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
			caseData.statementDueDate = subDays(currentDate, 5);
			caseData.finalCommentsDueDate = subDays(currentDate, 3);
			expect(shouldDisplayProofEvidenceDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(true);
		});
		it('should return false when lpaProofEvidenceSubmitted is true', () => {
			caseData.lpaProofEvidenceSubmitted = true;
			expect(shouldDisplayProofEvidenceDueBannerLPA(caseData, LPA_USER_ROLE)).toBe(false);
		});
	});
	describe('shouldDisplayProofEvidenceDueBannerRule6', () => {
		it('should return true when proofs of evidence are due for Rule 6 party', () => {
			caseData.interestedPartyRepsDueDate = subDays(currentDate, 5);
			caseData.rule6StatementDueDate = subDays(currentDate, 5);
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
