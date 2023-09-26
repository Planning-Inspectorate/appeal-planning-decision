const AddMoreQuestion = require('../add-more/question');
const AddressAddMoreQuestion = require('./question');
const uuid = require('uuid');

describe('AddressAddMoreQuestion', () => {
	const TITLE = 'title';
	const QUESTION = 'question';
	const FIELDNAME = 'fieldName';
	const VIEWFOLDER = 'viewFolder';
	const VALIDATORS = [];

	describe('constructor', () => {
		it('should instantiate and inherit from AddMoreQuestion', () => {
			const addressAddMoreQuestion = new AddressAddMoreQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				viewFolder: VIEWFOLDER,
				validators: VALIDATORS
			});
			expect(addressAddMoreQuestion instanceof AddressAddMoreQuestion).toBeTruthy();
			expect(addressAddMoreQuestion instanceof AddMoreQuestion).toBeTruthy();
		});
	});

	describe('getDataToSave', () => {
		it('should return data correctly', async () => {
			const addressAddMoreQuestion = new AddressAddMoreQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				viewFolder: VIEWFOLDER,
				validators: VALIDATORS
			});

			const req = {
				body: {
					[`${FIELDNAME}_addressLine1`]: 'Address Line 1',
					[`${FIELDNAME}_addressLine2`]: 'Address Line 2',
					[`${FIELDNAME}_townCity`]: 'Test Town',
					[`${FIELDNAME}_postcode`]: 'WC2A 2AE'
				}
			};

			const result = await addressAddMoreQuestion.getDataToSave(req);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value.addressLine1).toEqual('Address Line 1');
			expect(result.value.addressLine2).toEqual('Address Line 2');
			expect(result.value.townCity).toEqual('Test Town');
			expect(result.value.postcode).toEqual('WC2A 2AE');
		});
	});
});
