const AddMoreQuestion = require('../add-more/question');
const AddressAddMoreQuestion = require('./question');
const Address = require('@pins/common/src/lib/address');
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
		it('should format the data correctly', async () => {
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

			const testJourneyResponse = {
				referenceId: 'testRef',
				answers: {
					id: 'testQuestionnaireId'
				},
				journeyId: 'testJourneyId',
				LPACode: 'testLPACode'
			};

			const testAddress = new Address({
				addressLine1: 'Address Line 1',
				addressLine2: 'Address Line 2',
				townCity: 'Test Town',
				postcode: 'WC2A 2AE'
			});

			const result = await addressAddMoreQuestion.getDataToSave(req, testJourneyResponse);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value).toEqual(testAddress);
		});
	});
});
