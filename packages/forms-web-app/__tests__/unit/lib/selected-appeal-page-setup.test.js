const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	formatFinalCommentsHeadingPrefix,
	isAppellantComments,
	getFinalComments,
	formatStatementHeading,
	getStatementType,
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
		it('should return "Your statement" if the URL contains "statement"', () => {
			const url = '/manage-appeals/1234/statement';
			const result = formatStatementHeading(url);
			expect(result).toBe('Your statement');
		});
		it('should return "Local planning authority statement" if the URL contains "lpa-statement"', () => {
			const url = '/appeals/1234/lpa-statement';
			const result = formatStatementHeading(url);
			expect(result).toBe('Local planning authority statement');
		});
		it('should return "Statements from other parties" if the URL does not contain "statement" or "lpa-statement"', () => {
			const url = '/appeals/1234/other-party-statements';
			const result = formatStatementHeading(url);
			expect(result).toBe('Statements from other parties');
		});
	});
	describe('getStatementType', () => {
		const userLpa = { lpaCode: 'Q9999', serviceUserId: null };
		const userRule6 = { lpaCode: null, serviceUserId: 'some-user-id' };
		it('should return "lpa" if the URL contains "lpa-statement"', () => {
			const url = '/appeals/1234/lpa-statement';
			const result = getStatementType(url, userLpa);
			expect(result).toBe('lpa');
		});
		it('should return "rule6" if the URL contains "other-party-statements"', () => {
			const url = '/appeals/1234/other-party-statements';
			const result = getStatementType(url, userRule6);
			expect(result).toBe('rule6');
		});
		it('should return "lpa" if the user is LPA and the URL contains "statement"', () => {
			const url = '/manage-appeals/1234/statement';
			const result = getStatementType(url, userLpa);
			expect(result).toBe('lpa');
		});
		it('should return "rule6" if the user is Rule 6 and the URL contains "statement"', () => {
			const url = '/rule-6-appeals/1234/statement';
			const result = getStatementType(url, userRule6);
			expect(result).toBe('rule6');
		});
		it('should throw an error if unable to determine statement type', () => {
			const url = '/appeals/1234/unknown';
			expect(() => getStatementType(url, {})).toThrow('Unable to determine statement type');
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
