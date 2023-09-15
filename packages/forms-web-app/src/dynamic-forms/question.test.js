const Question = require('./question');
const { patchQuestionResponse } = require('../lib/appeals-api-wrapper');
jest.mock('../lib/appeals-api-wrapper');

const { mockRes } = require('../../__tests__/unit/mocks');
const res = mockRes();

describe('./src/dynamic-forms/question.js', () => {
	const TITLE = 'Question1';
	const QUESTION_STRING = 'What is your favourite colour?';
	const DESCRIPTION = 'A question about your favourite colour';
	const TYPE = 'Select';
	const FIELDNAME = 'favouriteColour';
	const URL = '/test';
	const VALIDATORS = [1];
	const HTML = 'resources/question12/content.html';

	const getTestQuestion = ({
		title = TITLE,
		question = QUESTION_STRING,
		description = DESCRIPTION,
		viewFolder = TYPE,
		fieldName = FIELDNAME,
		url = URL,
		validators = VALIDATORS,
		pageTitle = undefined,
		html = undefined
	} = {}) => {
		return new Question({
			title,
			pageTitle,
			question,
			description,
			viewFolder,
			fieldName,
			url,
			validators,
			html
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion({ html: HTML });

			expect(question).toBeTruthy();
			expect(question.title).toEqual(TITLE);
			expect(question.question).toEqual(QUESTION_STRING);
			expect(question.viewFolder).toEqual(TYPE);
			expect(question.fieldName).toEqual(FIELDNAME);
			expect(question.url).toEqual(URL);
			expect(question.pageTitle).toEqual(QUESTION_STRING);
			expect(question.description).toEqual(DESCRIPTION);
			expect(question.validators).toEqual(VALIDATORS);
			expect(question.html).toEqual(HTML);
		});

		it('should use pageTitle if set', () => {
			const pageTitle = 'a';

			const question = getTestQuestion({ pageTitle });

			expect(question.pageTitle).toEqual(pageTitle);
		});

		it('should not set validators if not an array', () => {
			const validators = {};

			const question = getTestQuestion({ validators });

			expect(question.validators).toEqual([]);
		});

		it('should throw if mandatory parameters not supplied to constructor', () => {
			const TITLE = 'Question1';
			const QUESTION_STRING = 'What is your favourite colour?';
			const FIELDNAME = 'favouriteColour';
			const VIEWFOLDER = 'view/';
			expect(
				() =>
					new Question({ question: QUESTION_STRING, fieldName: FIELDNAME, viewFolder: VIEWFOLDER })
			).toThrow('title parameter is mandatory');
			expect(
				() => new Question({ title: TITLE, fieldName: FIELDNAME, viewFolder: VIEWFOLDER })
			).toThrow('question parameter is mandatory');
			expect(
				() => new Question({ title: TITLE, question: QUESTION_STRING, viewFolder: VIEWFOLDER })
			).toThrow('fieldName parameter is mandatory');
			expect(
				() => new Question({ title: TITLE, question: QUESTION_STRING, fieldName: FIELDNAME })
			).toThrow('viewFolder parameter is mandatory');
		});
	});

	describe('prepQuestionForRendering', () => {
		it('should prepQuestionForRendering', () => {
			const question = getTestQuestion();

			const section = {
				name: 'section-name'
			};

			const journey = {
				baseUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				response: {
					answers: {
						[question.fieldName]: { a: 1 }
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				}
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering(section, journey, customViewData);

			expect(result).toEqual(
				expect.objectContaining({
					question: {
						value: journey.response.answers[question.fieldName],
						question: question.question,
						fieldName: question.fieldName,
						pageTitle: question.pageTitle,
						description: question.description,
						html: question.html
					},
					answer: journey.response.answers[question.fieldName],
					layoutTemplate: journey.journeyTemplate,
					pageCaption: section.name,
					navigation: ['', 'back'],
					backLink: 'back',
					showBackToListLink: question.showBackToListLink,
					listLink: journey.baseUrl,
					journeyTitle: journey.journeyTitle,
					hello: 'hi'
				})
			);
		});
	});

	describe('renderAction', () => {
		it('should renderAction', () => {
			const question = getTestQuestion();

			const viewModel = { test: 'data' };

			question.renderAction(res, viewModel);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.viewFolder}/index`,
				viewModel
			);
		});
	});

	describe('saveAction', () => {
		it('should handle validation errors', async () => {
			const expectedErrors = {
				errorViewModel: 'mocked-validation-error'
			};
			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = {};
			const journey = {};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle saving errors', async () => {
			const expectedErrors = {
				errorViewModel: 'mocked-validation-error'
			};
			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn();
			question.saveResponseToDB = jest.fn();
			question.checkForSavingErrors = jest.fn(() => expectedErrors);

			const res = {
				render: jest.fn()
			};

			const req = {};
			const journey = {};
			const section = {};

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.render).toHaveBeenCalledWith(
				`dynamic-components/${question.viewFolder}/index`,
				expectedErrors
			);
		});

		it('should handle saving', async () => {
			const expectedUrl = 'redirect-url';

			const question = getTestQuestion();
			question.checkForValidationErrors = jest.fn();
			question.getDataToSave = jest.fn();
			question.saveResponseToDB = jest.fn();
			question.checkForSavingErrors = jest.fn();
			const res = {
				redirect: jest.fn()
			};
			const req = {};
			const section = {};

			class TestJourney {
				response = {};
				getNextQuestionUrl = jest.fn(() => expectedUrl);
			}
			const journey = new TestJourney();

			await question.saveAction(req, res, journey, section, journey.response);

			expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
		});
	});

	describe('checkForValidationErrors', () => {
		it('should return viewmodel if errors present on req', () => {
			const expectedResult = { a: 1 };
			const req = { body: { errors: { error: 'we have an error' } } };
			const question = getTestQuestion();
			question.prepQuestionForRendering = jest.fn(() => expectedResult);

			const result = question.checkForValidationErrors(req);

			expect(result).toEqual(expectedResult);
		});

		it('should return undefined if errors not present on req', () => {
			const req = { body: {} };
			const question = getTestQuestion();

			const result = question.checkForValidationErrors(req);

			expect(result).toEqual(undefined);
		});
	});

	describe('getDataToSave', () => {
		it('should return anwser from req.body and modify journeyResponse', async () => {
			const question = getTestQuestion();

			const req = {
				body: {
					[question.fieldName]: { a: 1 }
				}
			};
			const journeyResponse = {
				answers: {
					[question.fieldName]: { b: 1 },
					other: 'another-answer'
				}
			};

			const result = await question.getDataToSave(req, journeyResponse);

			const expectedResult = {
				answers: {
					[question.fieldName]: { a: 1 }
				}
			};
			expect(result).toEqual(expectedResult);
			expectedResult.answers.other = 'another-answer';
			expect(journeyResponse).toEqual(expectedResult);
		});

		it('should handle nested properties', async () => {
			const question = getTestQuestion();

			const req = {
				body: {
					[question.fieldName]: { a: 1 },
					[question.fieldName + '_1']: { a: 2 },
					[question.fieldName + '_2']: { a: 3 }
				}
			};
			const journeyResponse = {
				answers: {
					[question.fieldName]: { b: 1 },
					other: 'another-answer'
				}
			};

			const result = await question.getDataToSave(req, journeyResponse);

			const expectedResult = {
				answers: {
					[question.fieldName]: { a: 1 },
					[question.fieldName + '_1']: { a: 2 },
					[question.fieldName + '_2']: { a: 3 }
				}
			};
			expect(result).toEqual(expectedResult);
			expectedResult.answers.other = 'another-answer';
			expect(journeyResponse).toEqual(expectedResult);
		});
	});

	describe('saveResponseToDB', () => {
		it('should call patchQuestionResponse with encoded ref', async () => {
			const journeyResponse = {
				referenceId: '/-123',
				journeyId: 'abc'
			};
			const responseToSave = { a: 1 };

			const question = getTestQuestion();
			await question.saveResponseToDB(journeyResponse, responseToSave);

			expect(patchQuestionResponse).toHaveBeenCalledWith(
				journeyResponse.journeyId,
				'%2F-123',
				responseToSave
			);
		});
	});

	describe('checkForSavingErrors', () => {
		it('should do nothing', async () => {
			const question = getTestQuestion();
			const result = question.checkForSavingErrors();
			expect(result).toEqual(undefined);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should return altText', async () => {
			const question = getTestQuestion();
			question.altText = 'alt';
			const result = question.formatAnswerForSummary({});
			expect(result).toEqual(question.altText);
		});

		it('should return answer if no altText', async () => {
			const question = getTestQuestion();
			question.altText = null;
			const answer = 'yes';
			const result = question.formatAnswerForSummary(answer);
			expect(result).toEqual(answer);
		});

		it('should return answer if no altText or answer', async () => {
			const question = getTestQuestion();
			question.altText = null;
			const defaultResponse = 'Not started';
			const result = question.formatAnswerForSummary(null);
			expect(result).toEqual(defaultResponse);
		});
	});
});
