const SiteAddressQuestion = require('./question');
const Address = require('@pins/common/src/lib/address');

describe('SiteAddressQuestion', () => {
	let question, req, mockApi;

	const TITLE = 'What is the site address?';
	const QUESTION = 'Enter the site address details:';
	const FIELDNAME = 'siteAddress';
	const VIEWFOLDER = 'address-entry';
	const VALIDATORS = [];

	const testAddress = {
		addressLine1: '123 Main St',
		addressLine2: 'Floor 2',
		townCity: 'Testville',
		postcode: 'TE1 2ST',
		county: 'Testshire'
	};

	beforeEach(() => {
		question = new SiteAddressQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			viewFolder: VIEWFOLDER,
			validators: VALIDATORS
		});

		mockApi = {
			postSubmissionAddress: jest.fn().mockResolvedValue({}),
			updateAppellantSubmission: jest.fn().mockResolvedValue()
		};

		req = {
			body: {
				siteAddress_addressLine1: '123 Main St',
				siteAddress_addressLine2: 'Floor 2',
				siteAddress_townCity: 'Testville',
				siteAddress_postcode: 'TE1 2ST',
				siteAddress_county: 'Testshire',
				fieldName: FIELDNAME
			},
			appealsApiClient: mockApi
		};
	});

	describe('getDataToSave', () => {
		it('should format the data correctly to be saved', async () => {
			const expectedAddress = new Address(testAddress);

			const journeyResponse = {
				answers: {}
			};

			const dataToSave = await question.getDataToSave(req, journeyResponse);

			expect(dataToSave).toEqual({
				address: expect.objectContaining({
					addressLine1: expectedAddress.addressLine1,
					townCity: expectedAddress.townCity,
					postcode: expectedAddress.postcode
				}),
				fieldName: FIELDNAME,
				siteAddressSet: true,
				addressId: undefined,
				answers: {}
			});
		});
	});

	describe('format', () => {
		it('should return formatted address from answer', () => {
			const formattedAddress = question.format(testAddress);
			expect(formattedAddress).toBe('123 Main St\nFloor 2\nTestville\nTestshire\nTE1 2ST');
		});
	});
});
