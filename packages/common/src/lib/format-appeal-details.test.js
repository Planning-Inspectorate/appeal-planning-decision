const {
	formatHealthAndSafety,
	formatAccessDetails,
	formatDevelopmentType,
	formatSubmissionRelatedAppeals,
	formatFactsForGround,
	hasAppealGround,
	formatInterestInLand,
	formatGroundsOfAppeal,
	formatActSection
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

	describe('formatFactsForGround', () => {
		it('should return an empty string if there is no matching ground', () => {
			const caseData = { EnforcementAppealGroundsDetails: [] };
			const result = formatFactsForGround(caseData, 'a');
			expect(result).toBe('');
		});

		it('should return an empty string if there is a matching ground with no facts', () => {
			const caseData = {
				EnforcementAppealGroundsDetails: [
					{
						appealGroundLetter: 'a',
						groundFacts: null
					}
				]
			};
			const result = formatFactsForGround(caseData, 'a');
			expect(result).toBe('');
		});

		it('should return the facts if there is a matching ground with facts', () => {
			const caseData = {
				EnforcementAppealGroundsDetails: [
					{
						appealGroundLetter: 'a',
						groundFacts: 'test facts'
					}
				]
			};
			const result = formatFactsForGround(caseData, 'a');
			expect(result).toBe('test facts');
		});
	});

	describe('hasAppealGround', () => {
		it('should return false if there is no matching ground', () => {
			const caseData = { EnforcementAppealGroundsDetails: [] };
			const result = hasAppealGround(caseData, 'a');
			expect(result).toBe(false);
		});

		it('should return true if there is a matching ground', () => {
			const caseData = {
				EnforcementAppealGroundsDetails: [
					{
						appealGroundLetter: 'a'
					}
				]
			};
			const result = hasAppealGround(caseData, 'a');
			expect(result).toBe(true);
		});
	});

	describe('formatInterestInLand', () => {
		it('should return an object with interest in land details and permission as null if accepted interest', () => {
			const caseData = { ownerOccupancyStatus: 'Owner' };
			const result = formatInterestInLand(caseData);
			expect(result.interestInLand).toBe('Owner');
			expect(result.hasPermission).toBe(null);
		});

		it('should return an object with interest in land details and permission boolean if not accepted interest', () => {
			const caseData = { ownerOccupancyStatus: 'Other', occupancyConditionsMet: true };
			const result = formatInterestInLand(caseData);
			expect(result.interestInLand).toBe('Other');
			expect(result.hasPermission).toBe(true);
		});
	});

	describe('formatGroundsOfAppeal', () => {
		it('should return string of formatted appeal ground letters, in alphabetical order', () => {
			const testGrounds = [
				{
					appealGroundLetter: 'd',
					groundFacts: 'test facts d'
				},
				{
					appealGroundLetter: 'a',
					groundFacts: 'test facts a'
				},
				{
					appealGroundLetter: 'b',
					groundFacts: 'test facts b'
				}
			];

			const result = formatGroundsOfAppeal(testGrounds);
			expect(result).toBe(`Ground (a)\nGround (b)\nGround (d)`);
		});
	});

	describe('formatActSection', () => {
		const options = [
			{
				input: { applicationMadeUnderActSection: 'existing-development' },
				field: 'applicationMadeUnderActSection',
				expected: 'Existing development'
			},
			{
				input: { applicationMadeUnderActSection: 'proposed-changes-to-a-listed-building' },
				field: 'applicationMadeUnderActSection',
				expected: 'Proposed changes to a listed building'
			},
			{
				input: { applicationMadeUnderActSection: 'proposed-use-of-a-development' },
				field: 'applicationMadeUnderActSection',
				expected: 'Proposed use of a development'
			},
			{
				input: { applicationMadeUnderActSection: 'unknown' },
				field: 'applicationMadeUnderActSection',
				expected: 'unknown'
			},
			{
				input: { appealUnderActSection: 'existing-development' },
				field: 'appealUnderActSection',
				expected: 'Existing development'
			},
			{
				input: { appealUnderActSection: 'proposed-changes-to-a-listed-building' },
				field: 'appealUnderActSection',
				expected: 'Proposed changes to a listed building'
			},
			{
				input: { appealUnderActSection: 'proposed-use-of-a-development' },
				field: 'appealUnderActSection',
				expected: 'Proposed use of a development'
			},
			{
				input: { appealUnderActSection: 'unknown' },
				field: 'appealUnderActSection',
				expected: 'unknown'
			}
		];

		it.each(options)(
			'should return expected values for known enums',
			({ input, field, expected }) => {
				const result = formatActSection(input, field);
				expect(result).toBe(expected);
			}
		);
	});
});
