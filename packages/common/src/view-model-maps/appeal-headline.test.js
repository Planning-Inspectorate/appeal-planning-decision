const { APPEAL_USER_ROLES } = require('../constants');
const { formatHeadlineData } = require('./appeal-headline');

describe('formatHeadlineData', () => {
	const testCaseData = {
		caseReference: 'APP/X1230/W/22/3301234',
		appealTypeCode: 'HAS',
		caseProcedure: 'writtenRepresentation',
		users: [
			{
				role: 'appellant',
				name: 'John Doe'
			}
		],
		applicationReference: 'A12345'
	};

	const testSiteAddress = {
		siteAddressLine1: '123 Test Street',
		siteAddressLine2: 'Test Town',
		siteAddressTown: 'Test City',
		siteAddressPostcode: 'TE1 1ST'
	};

	const testGridReferences = {
		siteGridReferenceEasting: '123456',
		siteGridReferenceNorthing: '654321'
	};

	it('should return the site address data when only siteAddress in caseData', () => {
		const caseData = {
			...testCaseData,
			...testSiteAddress
		};
		const result = formatHeadlineData({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});

		expect(result[2]).toEqual(
			expect.objectContaining({
				key: { text: 'Appeal site' },
				value: { html: '123 Test Street, Test Town, Test City, TE1 1ST' }
			})
		);
	});
	it('should return the grid reference data when only grid reference in caseData', () => {
		const caseData = {
			...testCaseData,
			...testGridReferences
		};
		const result = formatHeadlineData({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});

		expect(result[2]).toEqual(
			expect.objectContaining({
				key: { text: 'Appeal site' },
				value: { html: 'Eastings: 123456<br>Northings: 654321' }
			})
		);
	});

	it('should return the site address data when siteAddress and grid reference in caseData', () => {
		const caseData = {
			...testCaseData,
			...testSiteAddress,
			...testGridReferences
		};
		const result = formatHeadlineData({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});

		expect(result[2]).toEqual(
			expect.objectContaining({
				key: { text: 'Appeal site' },
				value: { html: '123 Test Street, Test Town, Test City, TE1 1ST' }
			})
		);
	});

	it('should return the application reference for non-enforcement planning appeals', () => {
		const caseData = {
			...testCaseData,
			...testSiteAddress
		};
		const result = formatHeadlineData({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});

		expect(result[5]).toEqual(
			expect.objectContaining({
				key: { text: 'Application number' },
				value: { text: 'A12345' }
			})
		);
	});

	it('should return the enforcement reference for an enforcement notice appeal', () => {
		const caseData = {
			...testCaseData,
			...testSiteAddress,
			appealTypeCode: 'ENFORCEMENT',
			enforcementReference: 'testEnfRef'
		};
		const result = formatHeadlineData({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});

		expect(result[5]).toEqual(
			expect.objectContaining({
				key: { text: 'Enforcement notice reference' },
				value: { text: 'testEnfRef' }
			})
		);
	});
});
