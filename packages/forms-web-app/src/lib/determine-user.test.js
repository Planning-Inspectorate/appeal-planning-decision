const { determineUser } = require('./determine-user');

jest.mock('@pins/common/src/constants', () => ({
	APPEAL_USER_ROLES: {
		RULE_6_PARTY: 'RULE_6_PARTY',
		APPELLANT: 'APPELLANT'
	},
	LPA_USER_ROLE: 'LPA_USER'
}));

describe('determineUser', () => {
	it('returns RULE_6_PARTY for /rule-6/ urls', () => {
		expect(determineUser('/some/path/rule-6/123')).toBe('RULE_6_PARTY');
	});

	it('returns APPELLANT for /appeals/ urls', () => {
		expect(determineUser('/appeals/456')).toBe('APPELLANT');
	});

	it('returns LPA_USER for /manage-appeals/ urls', () => {
		expect(determineUser('/manage-appeals/789')).toBe('LPA_USER');
	});

	it('returns null for unknown urls', () => {
		expect(determineUser('/random/path')).toBeNull();
	});
});
