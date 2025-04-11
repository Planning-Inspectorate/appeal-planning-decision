const { getUserDashboardLink, getParentPathLink } = require('./get-user-back-links');

describe('getUserBackLinks', () => {
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
			expect(() => getUserDashboardLink('not-a-user/123')).toThrow(
				'unknown baseUrl: not-a-user/123'
			);
		});

		it('throws an error for non string input', () => {
			expect(() => getUserDashboardLink('not-a-user/123')).toThrow(
				'unknown baseUrl: not-a-user/123'
			);
		});
	});

	describe('getParentPathLink', () => {
		it('removes the last segment from a standard appeal URL', () => {
			const result = getParentPathLink('/appeals/1234567/appeal-details');
			expect(result).toBe('/appeals/1234567');
		});

		it('removes the last segment from a URL with trailing slash', () => {
			const result = getParentPathLink('/appeals/1234567/appeal-details/');
			expect(result).toBe('/appeals/1234567');
		});

		it('handles longer paths with multiple nested segments', () => {
			const result = getParentPathLink('/manage-appeals/1234567/some/sub/section');
			expect(result).toBe('/manage-appeals/1234567/some/sub');
		});
	});
});
