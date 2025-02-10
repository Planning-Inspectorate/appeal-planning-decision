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
			expect(shouldDisplayStatementsDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(
				true
			);
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
		// it('should return false when rule6ProofEvidenceSubmitted is true', () => {
		// 	caseData.rule6ProofEvidenceSubmitted = true;
		// 	expect(
		// 		shouldDisplayProofEvidenceDueBannerRule6(caseData, APPEAL_USER_ROLES.RULE_6_PARTY)
		// 	).toBe(false);
		// });
	});
});
