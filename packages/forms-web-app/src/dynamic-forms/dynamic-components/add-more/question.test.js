const AddMoreQuestion = require('./question');
const Question = require('../../question');
const uuid = require('uuid');
jest.mock('uuid');

const { mockRes } = require('../../../../__tests__/unit/mocks');
const res = mockRes();

const TITLE = 'Question1';
const QUESTION_STRING = 'What is your favourite colour?';
const DESCRIPTION = 'A question about your favourite colour';
const FIELDNAME = 'favouriteColour';
const URL = '/test';
const VALIDATORS = [1];

describe('./src/dynamic-forms/dynamic-components/question.js', () => {
	const getTestQuestion = () => {
		return new AddMoreQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			url: URL,
			validators: VALIDATORS,
			viewFolder: 'test'
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion();
			expect(question).toBeTruthy();
		});
	});

	describe('getDataToSave', () => {
		it('should add a uuid to the data to save', async () => {
			const expectedId = 'abc';
			uuid.v4.mockReturnValue(expectedId);

			const question = getTestQuestion();

			const req = {
				body: {
					[question.fieldName]: { a: 1 }
				}
			};
			const journeyResponse = {
				answers: {
					other: 'another-answer'
				}
			};

			const expectedSaveData = {
				[question.fieldName]: { a: 1, addMoreId: expectedId }
			};

			const result = await question.getDataToSave(req, journeyResponse);

			const expectedResult = {
				answers: {
					[question.fieldName]: [expectedSaveData]
				}
			};
			expect(result).toEqual(expectedResult);
			expectedResult.answers.other = 'another-answer';
			expect(journeyResponse).toEqual(expectedResult);
		});
	});
});
