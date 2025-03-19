const {
	formatHealthAndSafety,
	formatAccessDetails,
	formatDevelopmentType,
	formatSubmissionRelatedAppeals
} = require('./format-appeal-details');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const escape = require('escape-html');

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

	describe('formatSubmissionRelatedAppeals', () => {
		it('should return an empty string if there are no submissionLinkedCases', () => {
			const caseData = { submissionLinkedCases: [] };
			const result = formatSubmissionRelatedAppeals(
				caseData,
				fieldNames.appellantLinkedCaseReference
			);
			expect(result).toBe('');
		});

		it('should return an empty string if no cases match the type', () => {
			const caseData = {
				submissionLinkedCases: [
					{ fieldName: fieldNames.changedListedBuildingNumber, caseReference: '123' }
				]
			};
			const result = formatSubmissionRelatedAppeals(
				caseData,
				fieldNames.appellantLinkedCaseReference
			);
			expect(result).toBe('');
		});

		it('should return a single case reference if one case matches the type', () => {
			const caseData = {
				submissionLinkedCases: [
					{ fieldName: fieldNames.appellantLinkedCaseReference, caseReference: '123' }
				]
			};
			const result = formatSubmissionRelatedAppeals(
				caseData,
				fieldNames.appellantLinkedCaseReference
			);
			expect(result).toBe(escape('123'));
		});

		it('should return multiple case references joined by newline if multiple cases match the type', () => {
			const caseData = {
				submissionLinkedCases: [
					{ fieldName: fieldNames.appellantLinkedCaseReference, caseReference: '123' },
					{ fieldName: fieldNames.appellantLinkedCaseReference, caseReference: '456' }
				]
			};
			const result = formatSubmissionRelatedAppeals(
				caseData,
				fieldNames.appellantLinkedCaseReference
			);
			expect(result).toBe(`${escape('123')}\n${escape('456')}`);
		});

		it('should escape special characters in case references', () => {
			const caseData = {
				submissionLinkedCases: [
					{
						fieldName: fieldNames.appellantLinkedCaseReference,
						caseReference: '<script>alert("xss")</script>'
					}
				]
			};
			const result = formatSubmissionRelatedAppeals(
				caseData,
				fieldNames.appellantLinkedCaseReference
			);
			expect(result).toBe(escape('<script>alert("xss")</script>'));
		});
	});

	describe('formatDevelopmentType', () => {
		it('returns expected value from development type', () => {
			expect(formatDevelopmentType('minor-offices')).toEqual(
				'Minor offices, light industry or research and development'
			);
		});

		it('returns empty string if development type is nullish', () => {
			expect(formatDevelopmentType(null)).toEqual('');
			expect(formatDevelopmentType('')).toEqual('');
			expect(formatDevelopmentType(undefined)).toEqual('');
		});

		it('throws if unknown development type', () => {
			expect(() => formatDevelopmentType('nope')).toThrow('unhandled developmentType mapping');
		});
	});
});
