const {
	formatSiteAccessDetails,
	formatSiteSafetyRisks
} = require('./format-questionnaire-details');

describe('format-questionnaire-details', () => {
	describe('formatSiteAccessDetails', () => {
		it('returns array converted to string with newlines', () => {
			const result = formatSiteAccessDetails(['one', 'two', 'three']);
			expect(result).toEqual('one\ntwo\nthree');
		});
		it('excludes null values', () => {
			const result = formatSiteAccessDetails(['', 'two', '']);
			expect(result).toEqual('two');
		});
	});

	describe('formatSiteSafetyRisks', () => {
		it('returns array converted to string with Yes and newlines if details present and provided', () => {
			const result = formatSiteSafetyRisks({ siteSafetyDetails: ['one', 'two', 'three'] }, true);
			expect(result).toEqual('Yes\none\ntwo\nthree');
		});
		it('excludes null values', () => {
			const resultSomeNulls = formatSiteSafetyRisks({ siteSafetyDetails: ['', 'two', ''] }, true);
			const resultAllNulls = formatSiteSafetyRisks({ siteSafetyDetails: ['', '', ''] }, true);
			expect(resultSomeNulls).toEqual('Yes\ntwo');
			expect(resultAllNulls).toEqual('Yes\n');
		});
		it('returns no if false param provided', () => {
			const result = formatSiteSafetyRisks({ siteSafetyDetails: ['one', 'two', 'three'] }, false);
			expect(result).toEqual('No');
		});
	});
});
