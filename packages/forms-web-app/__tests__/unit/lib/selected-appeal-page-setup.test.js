const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	formatTitleSuffix,
	formatQuestionnaireHeading,
	formatFinalCommentsHeadingPrefix,
	getFinalCommentUserGroup,
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
	describe('getFinalCommentUserGroup', () => {
		it('should return Rule_6_Party when the url includes other-party-final-comments', () => {
			const url = '/appeals/1234/other-party-final-comments';
			const user = {};
			const userType = APPEAL_USER_ROLES.RULE_6_PARTY;
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(APPEAL_USER_ROLES.RULE_6_PARTY);
		});
		it('should return LPAUser when the url includes lpa-final-comments', () => {
			const url = '/appeals/1234/lpa-final-comments';
			const user = {};
			const userType = '';
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(LPA_USER_ROLE);
		});
		it('should return Appellant when the url includes appellant-final-comments', () => {
			const url = '/appeals/1234/appellant-final-comments';
			const user = { lpaCode: 'LPA123' };
			const userType = '';
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(APPEAL_USER_ROLES.APPELLANT);
		});
		it('should return LPAUser when the user has an lpaCode and the url includes final-comments', () => {
			const url = '/appeals/1234/final-comments';
			const user = { lpaCode: 'LPA123' };
			const userType = '';
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(LPA_USER_ROLE);
		});
		it('should return Appellant when the user is an appellant and the url includes final-comments', () => {
			const url = '/appeals/1234/final-comments';
			const user = { serviceUserId: 'user123' };
			const userType = APPEAL_USER_ROLES.APPELLANT;
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(APPEAL_USER_ROLES.APPELLANT);
		});
		it('should return Rule_6_Party when the user is a Rule 6 party and the url includes final-comments', () => {
			const url = '/appeals/1234/final-comments';
			const user = { serviceUserId: 'user123' };
			const userType = APPEAL_USER_ROLES.RULE_6_PARTY;
			const result = getFinalCommentUserGroup(url, user, userType);
			expect(result).toBe(APPEAL_USER_ROLES.RULE_6_PARTY);
		});
		it('should throw an error when unable to determine final comment type', () => {
			const url = '/appeals/1234/some-other-route';
			const user = { serviceUserId: 'user123' };
			const userType = '';
			expect(() => getFinalCommentUserGroup(url, user, userType)).toThrow(
				'Unable to determine final comment type'
			);
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
		const userAppellant = { lpaCode: null, serviceUserId: 'appellant-user-id' };
		it('should return "lpa" if the URL contains "lpa-statement"', () => {
			const url = '/appeals/1234/lpa-statement';
			const result = getStatementType(url, userLpa, LPA_USER_ROLE);
			expect(result).toBe('lpa');
		});
		it('should return "rule6" if the URL contains "other-party-statements"', () => {
			const url = '/appeals/1234/other-party-statements';
			const result = getStatementType(url, userRule6, APPEAL_USER_ROLES.RULE_6_PARTY);
			expect(result).toBe('rule6');
		});
		it('should return "lpa" if the user is LPA and the URL contains "statement"', () => {
			const url = '/manage-appeals/1234/statement';
			const result = getStatementType(url, userLpa, LPA_USER_ROLE);
			expect(result).toBe('lpa');
		});
		it('should return "rule6" if the user is Rule 6 and the URL contains "statement"', () => {
			const url = '/rule-6-appeals/1234/statement';
			const result = getStatementType(url, userRule6, APPEAL_USER_ROLES.RULE_6_PARTY);
			expect(result).toBe('rule6');
		});
		it('should return "lpa" if the user is appellant and the URL contains "lpa-statement"', () => {
			const url = '/appeals/1234/lpa-statement';
			const result = getStatementType(url, userAppellant, APPEAL_USER_ROLES.APPELLANT);
			expect(result).toBe('lpa');
		});
		it('should return "rule6" if the user is appellant and the URL contains "other-party-statements"', () => {
			const url = '/appeals/1234/other-party-statements';
			const result = getStatementType(url, userAppellant, APPEAL_USER_ROLES.APPELLANT);
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
