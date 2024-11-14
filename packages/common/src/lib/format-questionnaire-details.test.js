const {
	formatSiteAccessDetails,
	formatSiteSafetyRisks
} = require('./format-questionnaire-details');

describe('format-questionnaire-details', () => {
	describe('formatSiteAccessDetails', () => {
		it('returns siteAccessDetails index 1 string if it exists', () => {
			const resultIndex0Empty = formatSiteAccessDetails({
				siteAccessDetails: ['', 'lpa access details']
			});
			const resultAllIndexesPopulated = formatSiteAccessDetails({
				siteAccessDetails: ['appellant access details', 'lpa access details']
			});
			expect(resultIndex0Empty).toEqual('lpa access details');
			expect(resultAllIndexesPopulated).toEqual('lpa access details');
		});
		it('returns empty string if siteAccessDetails index 1 is empty', () => {
			const resultIndex1Empty = formatSiteAccessDetails({
				siteAccessDetails: ['appellant access details', '']
			});
			const resultAllIndexesEmpty = formatSiteAccessDetails({ siteAccessDetails: ['', ''] });
			expect(resultIndex1Empty).toEqual('');
			expect(resultAllIndexesEmpty).toEqual('');
		});
	});

	describe('formatSiteSafetyRisks', () => {
		it('returns string of "Yes" plus siteSafetyDetails index 1 string', () => {
			const resultIndex0Empty = formatSiteSafetyRisks({
				siteSafetyDetails: ['', 'lpa safety details']
			});
			const resultAllIndexesPopulated = formatSiteSafetyRisks({
				siteSafetyDetails: ['appellant safety details', 'lpa safety details']
			});
			expect(resultIndex0Empty).toEqual('Yes\nlpa safety details');
			expect(resultAllIndexesPopulated).toEqual('Yes\nlpa safety details');
		});
		it('returns no if siteSafetyDetails index 1 is empty', () => {
			const resultIndex1Empty = formatSiteSafetyRisks({
				siteSafetyDetails: ['appellant safety details', '']
			});
			const resultAllIndexesEmpty = formatSiteSafetyRisks({ siteSafetyDetails: ['', ''] });
			expect(resultIndex1Empty).toEqual('No');
			expect(resultAllIndexesEmpty).toEqual('No');
		});
	});
});
