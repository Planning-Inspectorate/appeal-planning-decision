const { getUserDashboardLink } = require('./get-user-dashboard');

describe('getUserDashboardLink', () => {
	it('returns appeals dashboard path for /appeals/ route', () => {
		const result = getUserDashboardLink('/appeals/1234567/appeal-details');
		expect(result).toBe('/appeals/your-appeals');
	});

	it('returns LPA dashboard path for /manage-appeals/ route', () => {
		const result = getUserDashboardLink('/manage-appeals/1234567/appeal-details');
		expect(result).toBe('/manage-appeals/your-appeals');
	});

	it('returns Rule 6 dashboard path for /rule-6/ route', () => {
		const result = getUserDashboardLink('/rule-6/1234567/appeal-details');
		expect(result).toBe('/rule-6/your-appeals');
	});

	it('throws an error for unsupported base paths', () => {
		expect(() => getUserDashboardLink('not-a-user/123')).toThrow('unknown baseUrl: not-a-user/123');
	});

	it('throws an error for non string input', () => {
		expect(() => getUserDashboardLink('not-a-user/123')).toThrow('unknown baseUrl: not-a-user/123');
	});
});
