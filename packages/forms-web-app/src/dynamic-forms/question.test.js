const Question = require('./question');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

const { mockRes } = require('../../__tests__/unit/mocks');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const res = mockRes();

const apiClient = {
	patchLPAQuestionnaire: jest.fn(),
	updateAppellantSubmission: jest.fn()
};

jest.mock('../middleware/session-helper', () => ({
	getNavigationHistory: jest.fn()
}));

describe('./src/dynamic-forms/question.js', () => {
	const TITLE = 'Question1';
	const QUESTION_STRING = 'What is your favourite colour?';
	const DESCRIPTION = 'A question about your favourite colour';
	const TYPE = 'Select';
	const FIELDNAME = 'favouriteColour';
	const URL = '/test';
	const VALIDATORS = [1];
	const HTML = 'resources/question12/content.html';
	const HINT = 'This is how you submit the form';
	const LPACode = 'Q9999';
	const VARIABLES = [QUESTION_VARIABLES.APPEAL_TYPE];

	const getTestQuestion = ({
		title = TITLE,
		question = QUESTION_STRING,
		description = DESCRIPTION,
		viewFolder = TYPE,
		fieldName = FIELDNAME,
		url = URL,
		validators = VALIDATORS,
		pageTitle = undefined,
		html = undefined,
		hint = undefined,
		variables = VARIABLES
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
			html,
			hint,
			getAction: () => {
				return 'http://example.com/action';
			},
			variables
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion({ html: HTML, hint: HINT });

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
			expect(question.hint).toEqual(HINT);
		});

		it('should use pageTitle if set', () => {
			const pageTitle = 'a';

			const question = getTestQuestion({ pageTitle });

			expect(question.pageTitle).toEqual(pageTitle);
		});

		it('should replace pageTitle if variable is set', () => {
			const title = `This is my ${QUESTION_VARIABLES.APPEAL_TYPE}`;
			const section = {
				name: 'section-name',
				sectionVariables: { [QUESTION_VARIABLES.APPEAL_TYPE]: 'Tester' }
			};
			const question = getTestQuestion({ title });
			const journey = {
				baseUrl: '',
				taskListUrl: 'task',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE.id,
				section,
				variables: [[QUESTION_VARIABLES.APPEAL_TYPE]],
				response: {
					answers: {
						[question.fieldName]: { a: 1 }
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getSection: () => section,
				getCurrentQuestionUrl: jest.fn()
			};
			const result = question.formatAnswerForSummary('segment', journey, null);
			expect(result[0].key).toEqual('This is my Tester');
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
		it('should prepQuestionForRendering for a long journey', () => {
			const question = getTestQuestion();

			const section = {
				name: 'section-name'
			};

			const journey = {
				baseUrl: '',
				taskListUrl: 'task',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE.id,
				response: {
					answers: {
						[question.fieldName]: { a: 1 }
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				},
				getSection: jest.fn(),
				getBackLink: () => 'back'
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section, journey, customViewData });

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
					listLink: journey.taskListUrl,
					journeyTitle: journey.journeyTitle,
					hello: 'hi'
				})
			);
		});
		it('should prepQuestionForRendering for a short journey', () => {
			const question = getTestQuestion();
			const section = {
				segment: 'section-name',
				questions: [question]
			};
			const journey = {
				baseUrl: '',
				taskListUrl: 'task',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: JOURNEY_TYPES.LPA_PROOF_EVIDENCE.id,
				sections: [section],
				response: {
					answers: {
						[question.fieldName]: { a: 1 }
					}
				},
				getCurrentQuestionUrl: jest.fn(
					(sectionName, fieldName) => `/mock-url/${sectionName}/${fieldName}`
				),
				getBackLink: jest.fn(() => 'back')
			};
			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section, journey, customViewData });
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
					listLink: journey.taskListUrl,
					journeyTitle: journey.journeyTitle,
					hello: 'hi'
				})
			);

			expect(journey.getBackLink).toHaveBeenCalledWith(
				section.segment,
				question.fieldName,
				undefined
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
		it('should return answer from req.body and modify journeyResponse', async () => {
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
				journeyId: 'has-questionnaire',
				LPACode: LPACode
			};
			const responseToSave = { answers: { a: 1 } };

			const question = getTestQuestion();
			await question.saveResponseToDB(apiClient, journeyResponse, responseToSave);

			expect(apiClient.patchLPAQuestionnaire).toHaveBeenCalledWith('/-123', responseToSave.answers);
		});
		it('should call updateAppellantSubmission with encoded ref', async () => {
			const journeyResponse = {
				referenceId: '/-123',
				journeyId: 'has-appeal-form',
				LPACode: LPACode
			};
			const responseToSave = { answers: { a: 1 } };

			const question = getTestQuestion();
			await question.saveResponseToDB(apiClient, journeyResponse, responseToSave);

			expect(apiClient.updateAppellantSubmission).toHaveBeenCalledWith(
				'/-123',
				responseToSave.answers
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
		it('should return answer if no altText', async () => {
			const journey = {
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return 'current';
				},

				getSection: jest.fn()
			};
			const question = getTestQuestion();
			const answer = 'Yes';
			const result = question.formatAnswerForSummary('segment', journey, answer);
			expect(result[0].value).toEqual(answer);
		});

		it('should return "Not Started" if no value for answer', async () => {
			const journey = {
				getNextQuestionUrl: () => {
					return 'back';
				},
				getCurrentQuestionUrl: () => {
					return 'current';
				},
				getSection: jest.fn()
			};
			const question = getTestQuestion();
			const result = question.formatAnswerForSummary('segment', journey, null);
			expect(result[0].value).toEqual(question.NOT_STARTED);
		});
	});

	describe('isFirstQuestion', () => {
		it('should return true if the current question is the first question', () => {
			const question = getTestQuestion();

			const journey = {
				getCurrentQuestionUrl: jest.fn().mockReturnValue('/section/testField'),
				sections: [
					{
						questions: [{ url: '/section/testField' }]
					}
				],
				getSection: jest.fn()
			};
			const section = { name: 'section' };
			expect(question.isFirstQuestion(journey, section)).toBe(true);
		});
		it('should return false if the current question is not the first question', () => {
			const question = getTestQuestion();

			const journey = {
				getCurrentQuestionUrl: jest.fn().mockReturnValue('/section/otherField'),
				sections: [
					{
						questions: [{ url: '/section/testField' }]
					}
				]
			};
			const section = { name: 'section' };
			expect(question.isFirstQuestion(journey, section)).toBe(false);
		});
	});

	describe('isShortJourney', () => {
		it('should return true for a short journey', () => {
			const question = getTestQuestion();

			const journey = { journeyId: JOURNEY_TYPES.LPA_STATEMENT.id };
			const journey2 = { journeyId: JOURNEY_TYPES.APPELLANT_FINAL_COMMENTS.id };
			const journey3 = { journeyId: JOURNEY_TYPES.LPA_FINAL_COMMENTS.id };
			const journey4 = { journeyId: JOURNEY_TYPES.APPELLANT_PROOF_EVIDENCE.id };
			const journey5 = { journeyId: JOURNEY_TYPES.LPA_PROOF_EVIDENCE.id };
			const journey6 = { journeyId: JOURNEY_TYPES.RULE_6_PROOF_EVIDENCE.id };
			const journey7 = { journeyId: JOURNEY_TYPES.RULE_6_STATEMENT.id };

			expect(question.isShortJourney(journey)).toBe(true);
			expect(question.isShortJourney(journey2)).toBe(true);
			expect(question.isShortJourney(journey3)).toBe(true);
			expect(question.isShortJourney(journey4)).toBe(true);
			expect(question.isShortJourney(journey5)).toBe(true);
			expect(question.isShortJourney(journey6)).toBe(true);
			expect(question.isShortJourney(journey7)).toBe(true);
		});
		it('should return false for a long journey', () => {
			const question = getTestQuestion();

			const journey = { journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE.id };
			const journey2 = { journeyId: JOURNEY_TYPES.S78_QUESTIONNAIRE.id };
			const journey3 = { journeyId: JOURNEY_TYPES.HAS_APPEAL_FORM.id };
			const journey4 = { journeyId: JOURNEY_TYPES.S78_APPEAL_FORM.id };
			const journey5 = { journeyId: JOURNEY_TYPES.S20_APPEAL_FORM.id };
			const journey6 = { journeyId: JOURNEY_TYPES.ADVERTS_APPEAL_FORM.id };
			const journey7 = { journeyId: JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id };
			const journey8 = { journeyId: JOURNEY_TYPES.CAS_PLANNING_APPEAL_FORM.id };
			const journey9 = { journeyId: JOURNEY_TYPES.CAS_PLANNING_QUESTIONNAIRE.id };

			expect(question.isShortJourney(journey)).toBe(false);
			expect(question.isShortJourney(journey2)).toBe(false);
			expect(question.isShortJourney(journey3)).toBe(false);
			expect(question.isShortJourney(journey4)).toBe(false);
			expect(question.isShortJourney(journey5)).toBe(false);
			expect(question.isShortJourney(journey6)).toBe(false);
			expect(question.isShortJourney(journey7)).toBe(false);
			expect(question.isShortJourney(journey8)).toBe(false);
			expect(question.isShortJourney(journey9)).toBe(false);
		});
	});

	describe('getDashboardUrl', () => {
		it('should return the correct URL for an appellant journey', () => {
			const question = getTestQuestion();

			expect(question.getDashboardUrl(JOURNEY_TYPES.APPELLANT_FINAL_COMMENTS.id)).toBe(
				'/appeals/your-appeals'
			);
		});
		it('should return the correct URL for an LPA journey', () => {
			const question = getTestQuestion();

			expect(question.getDashboardUrl(JOURNEY_TYPES.LPA_FINAL_COMMENTS.id)).toBe(
				'/manage-appeals/your-appeals'
			);
		});
		it('should return the correct URL for a Rule 6 journey', () => {
			const question = getTestQuestion();

			expect(question.getDashboardUrl(JOURNEY_TYPES.RULE_6_PROOF_EVIDENCE.id)).toBe(
				'/rule-6/your-appeals'
			);
		});
		it('should return "/" for an unknown journey ID', () => {
			const question = getTestQuestion();

			expect(question.getDashboardUrl('unknown-journey-id')).toBe('/');
		});
	});

	describe('getUrlSlug', () => {
		it('should use url', () => {
			const question = getTestQuestion();
			const urlSlug = question.getUrlSlug();
			expect(urlSlug).toBe(URL);
		});

		it('should fallback to fieldname', () => {
			const question = getTestQuestion();
			question.url = undefined;
			const urlSlug = question.getUrlSlug();
			expect(urlSlug).toBe(FIELDNAME);
		});
	});

	describe('replaceVariables', () => {
		const question = getTestQuestion();
		let section;
		beforeEach(() => {
			question.variables = [QUESTION_VARIABLES.APPEAL_TYPE];
			section = {
				name: 'section-name',
				sectionVariables: { [QUESTION_VARIABLES.APPEAL_TYPE]: 'Last Name' }
			};
		});

		it('should replace all variables in object properties', () => {
			const testObject = {
				name: `tester ${QUESTION_VARIABLES.APPEAL_TYPE}`,
				address: 'tester'
			};
			const result = question.replaceVariables(section, testObject);
			expect(result).toEqual({
				name: 'tester Last Name',
				address: 'tester'
			});
		});
		it('should replace all variables in array properties', () => {
			const testObject = [
				{
					name: `tester ${QUESTION_VARIABLES.APPEAL_TYPE}`,
					address: 'tester'
				}
			];
			const result = question.replaceVariables(section, testObject);
			expect(result).toEqual([
				{
					name: 'tester Last Name',
					address: 'tester'
				}
			]);
		});

		it('should replace all variables in string', () => {
			const testString = 'tester Last Name';
			const result = question.replaceVariables(section, testString);
			expect(result).toEqual('tester Last Name');
		});

		it('should replace all variables in child objects', () => {
			const testObject = {
				name: `tester ${QUESTION_VARIABLES.APPEAL_TYPE}`,
				address: {
					postcode: 'fg45 5gh',
					address1: `tester main address ${QUESTION_VARIABLES.APPEAL_TYPE}`
				},
				moreInfo: [
					{
						place: `test place ${QUESTION_VARIABLES.APPEAL_TYPE}`,
						address: `test address ${QUESTION_VARIABLES.APPEAL_TYPE}`
					}
				]
			};
			const result = question.replaceVariables(section, testObject);
			expect(result).toEqual({
				name: 'tester Last Name',
				address: {
					postcode: 'fg45 5gh',
					address1: 'tester main address Last Name'
				},
				moreInfo: [
					{
						place: 'test place Last Name',
						address: 'test address Last Name'
					}
				]
			});
		});
	});
});
