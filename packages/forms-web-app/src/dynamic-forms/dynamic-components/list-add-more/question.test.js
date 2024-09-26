const ListAddMoreQuestion = require('./question');
const CaseAddMoreQuestion = require('../case-add-more/question');
const { mockRes } = require('../../../../__tests__/unit/mocks');

const res = mockRes();

const TITLE = 'Question1';
const QUESTION_STRING = 'What is your favourite colour?';
const DESCRIPTION = 'A question about your favourite colour';
const FIELDNAME = 'SubmissionLinkedCase';
const URL = '/test';
const VALIDATORS = [1];

describe('./src/dynamic-forms/dynamic-components/question.js', () => {
	const testSubQuestionLabel = 'subQuestion';
	const getTestQuestion = () => {
		return new ListAddMoreQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			url: URL,
			validators: VALIDATORS,
			subQuestionProps: {
				type: 'case',
				title: TITLE,
				question: QUESTION_STRING,
				fieldName: 'sub' + FIELDNAME,
				validators: VALIDATORS,
				viewFolder: 'view'
			},
			subQuestionLabel: testSubQuestionLabel
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion();

			expect(question).toBeTruthy();
			expect(question.subQuestion).toBeInstanceOf(CaseAddMoreQuestion);
			expect(question.subQuestionLabel).toEqual(testSubQuestionLabel);
			expect(question.viewFolder).toEqual('list-add-more');
		});

		it('should throw if mandatory parameters not supplied to constructor', () => {
			expect(
				() =>
					new ListAddMoreQuestion({
						title: TITLE,
						question: QUESTION_STRING,
						description: DESCRIPTION,
						fieldName: FIELDNAME
					})
			).toThrow("Cannot read properties of undefined (reading 'type')");

			expect(
				() =>
					new ListAddMoreQuestion({
						title: TITLE,
						question: QUESTION_STRING,
						description: DESCRIPTION,
						fieldName: FIELDNAME,
						subQuestionProps: {}
					})
			).toThrow('subQuestions[subQuestionProps.type] is not a constructor');
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
						[question.fieldName]: [
							{ fieldName: 'subSubmissionLinkedCase', addMoreId: 123, caseReference: '1010101' }
						]
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				addToCurrentQuestionUrl: () => {
					return 'current/123';
				}
			};

			const result = question.prepQuestionForRendering({}, journey);

			expect(result).toEqual(
				expect.objectContaining({
					addMoreAnswers: [
						{
							answer: '1010101',
							label: 'subQuestion 1',
							removeLink: 'current/123'
						}
					]
				})
			);
		});
	});

	describe('getDataToSave', () => {
		it('should nest sub question answer into array', async () => {
			const expectedId = 'abc';

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
				errorViewModel: 'mocked-validation-error',
				question: {}
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
			const testResponseToSave = {
				answers: {}
			};
			testResponseToSave.answers[FIELDNAME] = 'test';
			const question = getTestQuestion();
			question.subQuestion.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn(() => testResponseToSave);
			question.saveResponseToDB = jest.fn();
			question.subQuestion.checkForSavingErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = { body: {} };
			const journey = {
				response: {}
			};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.subQuestion.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle subquestion saving', async () => {
			const expectedUrl = 'redirect-url';

			const testResponseToSave = {
				answers: {}
			};
			testResponseToSave.answers[FIELDNAME] = 'test';
			const question = getTestQuestion();
			question.subQuestion.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn(() => testResponseToSave);
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
		const req = {
			appealsApiClient: {
				deleteSubmissionLinkedCase: jest.fn(() => ({ SubmissionLinkedCase: [] }))
			}
		};
		it("should call sub-question's remove function", async () => {
			const question = getTestQuestion();
			question.saveResponseToDB = jest.fn();
			const addMoreId = '123';

			const answer0 = { addMoreId: addMoreId, data: { a: 1 } };
			const answer1 = { addMoreId: 'other', data: { b: 2 } };
			const journeyResponse = {
				journeyId: 'journey_123',
				referenceId: 'ref_123',
				answers: {
					[question.fieldName]: [answer0, answer1]
				}
			};

			await question.removeAction(req, journeyResponse, addMoreId);
			expect(req.appealsApiClient.deleteSubmissionLinkedCase).toHaveBeenCalledWith(
				'journey_123',
				'ref_123',
				'123'
			);
		});
	});
});
