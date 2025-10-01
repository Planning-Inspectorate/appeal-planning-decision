const { APPEAL_USER_ROLES } = require('../constants');
const { formatHeadlineData } = require('./appeal-headline');

describe('formatHeadlineData', () => {
	it('should return the site address data when only siteAddress in caseData', () => {
		const caseData = {
			caseReference: 'APP/X1230/W/22/3301234',
			appealTypeCode: '1001',
			caseProcedure: 'writtenRepresentation',
			users: [
				{
					role: 'appellant',
					name: 'John Doe'
				}
			],
			applicationReference: 'A12345',
			siteAddressLine1: '123 Test Street',
			siteAddressLine2: 'Test Town',
			siteAddressTown: 'Test City',
			siteAddressPostcode: 'TE1 1ST'
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
			caseReference: 'APP/X1230/W/22/3301234',
			appealTypeCode: '1001',
			caseProcedure: 'writtenRepresentation',
			users: [
				{
					role: 'appellant',
					name: 'John Doe'
				}
			],
			applicationReference: 'A12345',
			siteGridReferenceEasting: '123456',
			siteGridReferenceNorthing: '654321'
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
			caseReference: 'APP/X1230/W/22/3301234',
			appealTypeCode: '1001',
			caseProcedure: 'writtenRepresentation',
			users: [
				{
					role: 'appellant',
					name: 'John Doe'
				}
			],
			applicationReference: 'A12345',
			siteAddressLine1: '123 Test Street',
			siteAddressLine2: 'Test Town',
			siteAddressTown: 'Test City',
			siteAddressPostcode: 'TE1 1ST',
			siteGridReferenceEasting: '123456',
			siteGridReferenceNorthing: '654321'
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
});
