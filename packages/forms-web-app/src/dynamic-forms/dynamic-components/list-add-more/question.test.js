const ListAddMoreQuestion = require('./question');
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

class TestQuestion extends Question {
	constructor() {
		super({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			fieldName: 'sub' + FIELDNAME,
			url: URL,
			validators: VALIDATORS,
			viewFolder: 'view'
		});
	}
}

describe('./src/dynamic-forms/dynamic-components/question.js', () => {
	const testSubQuestion = new TestQuestion();
	const testSubQuestionLabel = 'subQuestion';
	const getTestQuestion = (
		{ subQuestion = undefined, subQuestionLabel = undefined } = {
			subQuestion: testSubQuestion,
			subQuestionLabel: testSubQuestionLabel
		}
	) => {
		return new ListAddMoreQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			url: URL,
			validators: VALIDATORS,
			subQuestion,
			subQuestionLabel
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion();

			expect(question).toBeTruthy();
			expect(question.subQuestion).toEqual(testSubQuestion);
			expect(question.subQuestionLabel).toEqual(testSubQuestionLabel);
		});

		it('should throw if mandatory parameters not supplied to constructor', () => {
			expect(() => getTestQuestion({ subQuestion: undefined })).toThrow(
				'subQuestion parameter is mandatory'
			);
			expect(() => getTestQuestion({ subQuestion: {} })).toThrow(
				'subQuestion parameter is mandatory'
			);
		});
	});

	describe('renderAction', () => {
		it('should call subquestion renderAction', () => {
			const question = getTestQuestion();

			const viewModel = { test: 'data' };

			question.renderAction(res, viewModel);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				viewModel
			);
		});

		it('should renderAction with addMoreAnswers', () => {
			const question = getTestQuestion();

			const viewModel = { test: 'data', addMoreAnswers: [1] };

			question.renderAction(res, viewModel);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.viewFolder}/index`,
				viewModel
			);
		});
	});

	describe('prepQuestionForRendering', () => {
		it('should add addMoreAnswers data to model', () => {
			const question = getTestQuestion();

			const journey = {
				response: {
					answers: {
						[question.fieldName]: [{ [question.subQuestion.fieldName]: 'yes', addMoreId: 123 }]
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return 'current';
				}
			};

			const result = question.prepQuestionForRendering({}, journey);

			expect(result).toEqual(
				expect.objectContaining({
					addMoreAnswers: [
						{
							answer: 'yes',
							label: 'subQuestion 1',
							removeLink: 'current/123'
						}
					]
				})
			);
		});
	});

	describe('getDataToSave', () => {
		it('should nest sub question answer into array with id', async () => {
			const expectedId = 'abc';
			uuid.v4.mockReturnValue(expectedId);

			const question = getTestQuestion();

			const req = {
				body: {
					[question.subQuestion.fieldName]: { a: 1 }
				}
			};
			const journeyResponse = {
				answers: {
					[question.fieldName]: [],
					other: 'another-answer'
				}
			};

			const expectedSaveData = {
				[question.subQuestion.fieldName]: { a: 1, addMoreId: expectedId }
			};
			question.subQuestion.getDataToSave = jest.fn(async () => expectedSaveData);

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

	describe('saveAction', () => {
		it('should handle add more validation errors', async () => {
			const expectedErrors = {
				errorViewModel: 'mocked-validation-error'
			};
			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = { body: { 'add-more-question': 1 } };
			const journey = {};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle add more yes response', async () => {
			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn();

			const res = {
				render: jest.fn()
			};

			const expectedBackLink = 'back';
			const req = { body: { 'add-more-question': 1, [question.fieldName]: 'yes' } };
			const journey = {
				response: { answers: {} },
				getNextQuestionUrl: jest.fn(),
				getCurrentQuestionUrl: jest.fn(() => expectedBackLink)
			};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				expect.objectContaining({
					backLink: expectedBackLink,
					navigation: ['', expectedBackLink]
				})
			);
		});

		it('should handle add more no response', async () => {
			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn();

			const res = {
				redirect: jest.fn()
			};

			const expectedUrl = 'test';
			const req = { body: { 'add-more-question': 1, [question.fieldName]: 'no' } };
			const journey = { response: { answers: {} }, getNextQuestionUrl: jest.fn(() => expectedUrl) };
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
		});

		it('should handle subquestion validation errors', async () => {
			const expectedErrors = {
				errorViewModel: 'mocked-validation-error'
			};
			const question = getTestQuestion();
			question.subQuestion.checkForValidationErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = { body: {} };
			const journey = {};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle subquestion saving errors', async () => {
			const expectedErrors = {
				errorViewModel: 'mocked-validation-error'
			};
			const question = getTestQuestion();
			question.subQuestion.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn();
			question.saveResponseToDB = jest.fn();
			question.subQuestion.checkForSavingErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = { body: {} };
			const journey = {};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle subquestion saving', async () => {
			const expectedUrl = 'redirect-url';

			const question = getTestQuestion();
			question.subQuestion.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn();
			question.saveResponseToDB = jest.fn();
			question.subQuestion.checkForSavingErrors = jest.fn();
			const res = {
				redirect: jest.fn()
			};
			const req = { body: {} };
			const section = {};

			class TestJourney {
				response = {};
				getCurrentQuestionUrl = jest.fn(() => expectedUrl);
			}
			const journey = new TestJourney();

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
		});
	});

	describe('removeAction', () => {
		it('should remove answer', async () => {
			const question = getTestQuestion();
			question.saveResponseToDB = jest.fn();
			const addMoreId = '123';

			const answer0 = { addMoreId: addMoreId, data: { a: 1 } };
			const answer1 = { addMoreId: 'other', data: { b: 2 } };
			const journeyResponse = {
				answers: {
					[question.fieldName]: [answer0, answer1]
				}
			};

			const result = await question.removeAction(journeyResponse, addMoreId);

			const expectedResult = {
				answers: {
					[question.fieldName]: [answer1]
				}
			};
			expect(question.saveResponseToDB).toHaveBeenCalledWith(expectedResult, expectedResult);
			expect(result).toEqual(expectedResult);
		});

		it('should handle not finding answer answer', async () => {
			const question = getTestQuestion();
			question.saveResponseToDB = jest.fn();
			const addMoreId = '123';

			const answer0 = { addMoreId: 'other', data: { a: 1 } };
			const journeyResponse = {
				answers: {
					[question.fieldName]: [answer0]
				}
			};

			const result = await question.removeAction(journeyResponse, addMoreId);

			const expectedResult = {
				answers: {
					[question.fieldName]: [answer0]
				}
			};

			expect(question.saveResponseToDB).not.toHaveBeenCalled();
			expect(result).toEqual(expectedResult);
		});

		it('should handle no current answers', async () => {
			const question = getTestQuestion();
			question.saveResponseToDB = jest.fn();

			const journeyResponse = {
				answers: {}
			};

			const result = await question.removeAction(journeyResponse, 'nope');

			expect(question.saveResponseToDB).not.toHaveBeenCalled();
			expect(result).toEqual(journeyResponse);
		});
	});
});
