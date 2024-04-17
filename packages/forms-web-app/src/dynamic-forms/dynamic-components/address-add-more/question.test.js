const AddMoreQuestion = require('../add-more/question');
const AddressAddMoreQuestion = require('./question');
const Address = require('@pins/common/src/lib/address');
const uuid = require('uuid');

const TITLE = 'title';
const QUESTION = 'question';
const FIELDNAME = 'fieldName';
const VIEWFOLDER = 'viewFolder';
const VALIDATORS = [];

const testAddress = {
	addressLine1: 'Address Line 1',
	addressLine2: 'Address Line 2',
	townCity: 'Test Town',
	postcode: 'WC2A 2AE'
};
const testAddress1Line = `${testAddress.addressLine1}, ${testAddress.addressLine2}, ${testAddress.townCity}, ${testAddress.postcode}`;

const question = new AddressAddMoreQuestion({
	title: TITLE,
	question: QUESTION,
	fieldName: FIELDNAME,
	viewFolder: VIEWFOLDER,
	validators: VALIDATORS
});

describe('AddressAddMoreQuestion', () => {
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

			const address = new Address(testAddress);

			const result = await question.getDataToSave(req, testJourneyResponse);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value).toEqual(address);
		});
	});

	describe('format', () => {
		it('should return formatted address from answer', () => {
			const formattedCase = question.format(testAddress);
			expect(formattedCase).toBe(testAddress1Line);
		});

		it('should return empty string if no answer', () => {
			const formattedCase = question.format({});
			expect(formattedCase).toBe('');
		});
	});

	describe('getAddMoreAnswers', () => {
		it('should return addresses for question', () => {
			const fieldName = 'abc';
			const response = {
				answers: {
					SubmissionAddress: [
						{
							fieldName,
							data: 1
						},
						{
							fieldName,
							data: 2
						},
						{
							fieldName: 'other',
							data: 3
						}
					]
				}
			};
			const result = question.getAddMoreAnswers(response, fieldName);
			expect(result.length).toBe(2);
		});

		it('should return empty array if no addresses', () => {
			const result = question.getAddMoreAnswers({ answers: {} }, 'fieldName');
			expect(result.length).toBe(0);
		});
	});

	describe('saveList', () => {
		const mockReq = {
			appealsApiClient: {
				postSubmissionAddress: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId'
		};

		it('should save addresses and return true', async () => {
			const responseToSave = {
				answers: {
					parentFieldName: [
						{ fieldName: 'testField', value: testAddress },
						{ fieldName: 'testField', value: testAddress }
					]
				}
			};

			mockReq.appealsApiClient.postSubmissionAddress.mockResolvedValueOnce();

			await question.saveList(mockReq, 'parentFieldName', mockJourneyResponse, responseToSave);

			expect(mockReq.appealsApiClient.postSubmissionAddress).toHaveBeenCalledTimes(2);
			expect(mockReq.appealsApiClient.postSubmissionAddress).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					...testAddress
				}
			);
			expect(mockReq.appealsApiClient.postSubmissionAddress).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					...testAddress
				}
			);
		});
	});

	describe('removeList', () => {
		const mockReq = {
			appealsApiClient: {
				deleteSubmissionAddress: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId',
			answers: {
				SubmissionLinkedCase: [{ id: 'case1' }, { id: 'case2' }]
			}
		};

		it('should remove address and return updated JourneyResponse', async () => {
			mockReq.appealsApiClient.deleteSubmissionAddress.mockResolvedValueOnce({
				SubmissionAddress: [{ id: 'address2' }]
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'address2');

			expect(updatedResponse.answers.SubmissionAddress).toHaveLength(1);
			expect(updatedResponse.answers.SubmissionAddress[0]).toEqual({ id: 'address2' });
		});

		it('should return true if no linked cases are left after removal', async () => {
			mockReq.appealsApiClient.deleteSubmissionAddress.mockResolvedValueOnce({
				SubmissionAddress: []
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'address1');

			expect(updatedResponse).toBe(true);
		});
	});
});
