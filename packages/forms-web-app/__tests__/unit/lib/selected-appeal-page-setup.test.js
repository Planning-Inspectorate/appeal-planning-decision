const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	formatFinalCommentsHeadingPrefix,
	isAppellantComments,
	getFinalComments,
	formatStatementHeading,
	formatPlanningObligationTitlePrefix
} = require('../../../src/lib/selected-appeal-page-setup');
describe('Content setup functions for selected appeal page', () => {
	describe('formatTitleSuffix', () => {
		it('should return "Manage your appeals" for LPA user type', () => {
			expect(formatTitleSuffix(LPA_USER_ROLE)).toBe('Manage your appeals');
		});
		it('should return "Appeal a planning decision" for non-LPA user type', () => {
			expect(formatTitleSuffix(APPEAL_USER_ROLES.APPELLANT)).toBe('Appeal a planning decision');
		});
	});
	describe('formatQuestionnaireHeading', () => {
		it('should return "Questionnaire" for LPA user type', () => {
			expect(formatQuestionnaireHeading(LPA_USER_ROLE)).toBe('Questionnaire');
		});
		it('should return "Local planning authority questionnaire" for non-LPA user type', () => {
			expect(formatQuestionnaireHeading(APPEAL_USER_ROLES.APPELLANT)).toBe(
				'Local planning authority questionnaire'
			);
		});
	});
	describe('formatFinalCommentsHeadingPrefix', () => {
		it('should return "Local planning authority" for LPA final comments URL', () => {
			expect(formatFinalCommentsHeadingPrefix('/lpa-final-comments')).toBe(
				'Local planning authority'
			);
		});
		it(`should return "Appellant's" for appellant final comments URL`, () => {
			expect(formatFinalCommentsHeadingPrefix('/appellant-final-comments')).toBe(`Appellant's`);
		});
		it('should return "Your" for other URLs', () => {
			expect(formatFinalCommentsHeadingPrefix('/final-comments')).toBe('Your');
		});
	});
	describe('isAppellantComments', () => {
		it('should return true for appellant final comments URL', () => {
			expect(isAppellantComments('/appellant-final-comments', APPEAL_USER_ROLES.APPELLANT)).toBe(
				true
			);
		});
		it('should return true for non-LPA user and /final-comments URL', () => {
			expect(isAppellantComments('/final-comments', APPEAL_USER_ROLES.RULE_6_PARTY)).toBe(true);
		});
		it('should return false for LPA user and /final-comments URL', () => {
			expect(isAppellantComments('/final-comments', LPA_USER_ROLE)).toBe(false);
		});
	});
	describe('getFinalComments', () => {
		const mockCaseData = {
			appellantFinalCommentDetails: 'Appellant final comments',
			lpaFinalCommentDetails: 'LPA final comments'
		};
		it('should return appellant final comments when isAppellantComments is true', () => {
			expect(getFinalComments(mockCaseData, true)).toBe('Appellant final comments');
		});
		it('should return LPA final comments when isAppellantComments is false', () => {
			expect(getFinalComments(mockCaseData, false)).toBe('LPA final comments');
		});
	});
	describe('formatStatementHeading', () => {
		it('should return "Your" for LPA user type', () => {
			expect(formatStatementHeading(LPA_USER_ROLE)).toBe('Your');
		});
		it('should return "Local planning authority" for non-LPA user type', () => {
			expect(formatStatementHeading(APPEAL_USER_ROLES.APPELLANT)).toBe('Local planning authority');
		});
	});
	describe('formatPlanningObligationTitlePrefix', () => {
		it('should return "Appellant" for non-appellant user type', () => {
			expect(formatPlanningObligationTitlePrefix(LPA_USER_ROLE)).toBe('Appellant');
		});
		it('should return "Your" for appellant user type', () => {
			expect(formatPlanningObligationTitlePrefix(APPEAL_USER_ROLES.APPELLANT)).toBe('Your');
		});
	});
});
