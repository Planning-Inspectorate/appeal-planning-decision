const { formatHealthAndSafety, formatAccessDetails } = require('./format-appeal-details');

describe('format-appeal-details', () => {
	describe('formatHealthAndSafety', () => {
		it('returns string of "Yes" plus siteSafetyDetails index 0 string', () => {
			const resultIndex1Empty = formatHealthAndSafety({
				siteSafetyDetails: ['appellant safety details', '']
			});
			const resultAllIndexesPopulated = formatHealthAndSafety({
				siteSafetyDetails: ['appellant safety details', 'lpa safety details']
			});
			expect(resultIndex1Empty).toEqual('Yes \n appellant safety details');
			expect(resultAllIndexesPopulated).toEqual('Yes \n appellant safety details');
		});
		it('returns no if siteSafetyDetails index 0 is empty', () => {
			const resultIndex0Empty = formatHealthAndSafety({
				siteSafetyDetails: ['', 'lpa safety details']
			});
			const resultAllIndexesEmpty = formatHealthAndSafety({ siteSafetyDetails: ['', ''] });
			expect(resultIndex0Empty).toEqual('No');
			expect(resultAllIndexesEmpty).toEqual('No');
		});
	});
	describe('formatAccessDetails', () => {
		it('returns string of "Yes" plus siteAccessDetails index 0 string', () => {
			const resultIndex1Empty = formatAccessDetails({
				siteAccessDetails: ['appellant access details', '']
			});
			const resultAllIndexesPopulated = formatAccessDetails({
				siteAccessDetails: ['appellant access details', 'lpa access details']
			});
			expect(resultIndex1Empty).toEqual('Yes \n appellant access details');
			expect(resultAllIndexesPopulated).toEqual('Yes \n appellant access details');
		});
		it('returns no if siteAccessDetails index 0 is empty', () => {
			const resultIndex0Empty = formatAccessDetails({
				siteAccessDetails: ['', 'lpa access details']
			});
			const resultAllIndexesEmpty = formatAccessDetails({ siteAccessDetails: ['', ''] });
			expect(resultIndex0Empty).toEqual('No');
			expect(resultAllIndexesEmpty).toEqual('No');
		});
	});
});
