const AddMoreQuestion = require('../add-more/question');
const IndividualAddMoreQuestion = require('./question');
const uuid = require('uuid');
const Individual = require('../../lib/individual');

const TITLE = 'title';
const QUESTION = 'question';
const FIELDNAME = 'fieldName';
const VIEWFOLDER = 'viewFolder';
const VALIDATORS = [];

const testFirstName = 'testFirstName';
const testLastName = 'testLastName';

const testNamedIndividual = {
	firstName: testFirstName,
	lastName: testLastName
};
const testFormattedName = `${testFirstName} ${testLastName}`;

const question = new IndividualAddMoreQuestion({
	title: TITLE,
	question: QUESTION,
	fieldName: FIELDNAME,
	viewFolder: VIEWFOLDER,
	validators: VALIDATORS
});

describe('IndividualAddMoreQuestion', () => {
	describe('constructor', () => {
		it('should instantiate and inherit from AddMoreQuestion', () => {
			const individualAddMoreQuestion = new IndividualAddMoreQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				viewFolder: VIEWFOLDER,
				validators: VALIDATORS
			});
			expect(individualAddMoreQuestion instanceof IndividualAddMoreQuestion).toBeTruthy();
			expect(individualAddMoreQuestion instanceof AddMoreQuestion).toBeTruthy();
		});
	});

	describe('getDataToSave', () => {
		it('should format the data correctly', async () => {
			const req = {
				body: {
					[`fieldName_firstName`]: testFirstName,
					[`fieldName_lastName`]: testLastName
				}
			};

			const namedIndividual = new Individual(testNamedIndividual);

			const result = await question.getDataToSave(req);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value).toEqual(namedIndividual);
		});
	});

	describe('format', () => {
		it('should return formatted names from answer', () => {
			const formattedName = question.format(testNamedIndividual);
			expect(formattedName).toBe(testFormattedName);
		});

		it('should return empty string if no answer', () => {
			const formattedName = question.format({});
			expect(formattedName).toBe('');
		});
	});

	describe('getAddMoreAnswers', () => {
		it('should return named individuals for question', () => {
			const fieldName = 'abc';
			const response = {
				answers: {
					SubmissionIndividual: [
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

		it('should return empty array if no named individuals', () => {
			const result = question.getAddMoreAnswers({ answers: {} }, 'fieldName');
			expect(result.length).toBe(0);
		});
	});

	describe('saveList', () => {
		const mockReq = {
			appealsApiClient: {
				postSubmissionIndividual: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId'
		};

		it('should save named individuals and return true', async () => {
			const responseToSave = {
				answers: {
					parentFieldName: [
						{ fieldName: 'testField', value: testNamedIndividual },
						{ fieldName: 'testField', value: testNamedIndividual }
					]
				}
			};

			mockReq.appealsApiClient.postSubmissionIndividual.mockResolvedValueOnce();

			await question.saveList(mockReq, 'parentFieldName', mockJourneyResponse, responseToSave);

			expect(mockReq.appealsApiClient.postSubmissionIndividual).toHaveBeenCalledTimes(2);
			expect(mockReq.appealsApiClient.postSubmissionIndividual).toHaveBeenCalledWith(
				'mockReferenceId',
				{
					fieldName: 'testField',
					...testNamedIndividual
				}
			);
			expect(mockReq.appealsApiClient.postSubmissionIndividual).toHaveBeenCalledWith(
				'mockReferenceId',
				{
					fieldName: 'testField',
					...testNamedIndividual
				}
			);
		});
	});

	describe('removeList', () => {
		const mockReq = {
			appealsApiClient: {
				deleteSubmissionIndividual: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId',
			answers: {
				SubmissionIndividual: [{ id: 'individual1' }, { id: 'individual2' }]
			}
		};

		it('should remove named individual and return updated JourneyResponse', async () => {
			mockReq.appealsApiClient.deleteSubmissionIndividual.mockResolvedValueOnce({
				SubmissionIndividual: [{ id: 'individual2' }]
			});

			const updatedResponse = await question.removeList(
				mockReq,
				mockJourneyResponse,
				'individual2'
			);

			expect(updatedResponse.answers.SubmissionIndividual).toHaveLength(1);
			expect(updatedResponse.answers.SubmissionIndividual[0]).toEqual({
				id: 'individual2'
			});
		});

		it('should return true if no individuals are left after removal', async () => {
			mockReq.appealsApiClient.deleteSubmissionIndividual.mockResolvedValueOnce({
				SubmissionIndividual: []
			});

			const updatedResponse = await question.removeList(
				mockReq,
				mockJourneyResponse,
				'individual1'
			);

			expect(updatedResponse).toBe(true);
		});
	});
});
