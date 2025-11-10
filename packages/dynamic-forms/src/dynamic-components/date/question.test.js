const Question = require('../../question');
const DateQuestion = require('./question');

describe('DateQuestion', () => {
	const TITLE = 'title';
	const QUESTION = 'question';
	const FIELDNAME = 'fieldName';
	const HINT = 'hint hint';
	const VALIDATORS = [];

	describe('constructor', () => {
		it('should instantiate and inherit from Question', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});
			expect(dateQuestion instanceof DateQuestion).toBeTruthy();
			expect(dateQuestion instanceof Question).toBeTruthy();
			expect(dateQuestion.viewFolder).toBe('date');
		});
	});

	describe('getDataToSave', () => {
		it('should return data correctly', async () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const expectedAnswerDate = new Date(2023, 1, 1);

			const req = {
				body: {
					[`${FIELDNAME}_day`]: '1',
					[`${FIELDNAME}_month`]: '2',
					[`${FIELDNAME}_year`]: '2023'
				}
			};

			const journeyResponse = {
				answers: {}
			};

			const result = await dateQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toEqual(expectedAnswerDate);
		});
	});

	describe('prepQuestionForRendering', () => {
		it('should add answer data to viewmodel if it exists and no payload', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const date = new Date(2022, 1, 10);

			const formattedDate = {
				[`${[FIELDNAME]}_day`]: '10',
				[`${[FIELDNAME]}_month`]: '2',
				[`${[FIELDNAME]}_year`]: '2022'
			};

			const section = {
				name: 'section-name'
			};

			const journey = {
				baseUrl: '',
				taskListUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: 'journey1',
				response: {
					answers: {
						[FIELDNAME]: date
					}
				},
				getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
				getBackLink: () => {
					return 'back';
				}
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering({ section, journey });

			expect(preppedQuestionViewModel).toEqual(
				expect.objectContaining({
					question: {
						value: formattedDate,
						question: dateQuestion.question,
						hint: HINT,
						fieldName: dateQuestion.fieldName,
						pageTitle: dateQuestion.pageTitle,
						description: dateQuestion.description,
						html: dateQuestion.html
					},
					answer: formattedDate,
					layoutTemplate: journey.journeyTemplate,
					pageCaption: section.name,
					navigation: ['', 'back'],
					payload: undefined,
					backLink: 'back',
					showBackToListLink: dateQuestion.showBackToListLink,
					listLink: journey.taskListUrl,
					journeyTitle: journey.journeyTitle
				})
			);
		});

		it('should add payload data to viewmodel (precedence over saved answer)', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const formattedDate = {
				[`${[FIELDNAME]}_day`]: '99',
				[`${[FIELDNAME]}_month`]: '99',
				[`${[FIELDNAME]}_year`]: '202'
			};

			const section = {
				name: 'section-name'
			};

			const journey = {
				baseUrl: '',
				taskListUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: 'journey1',
				response: {
					answers: {
						[`${[FIELDNAME]}_day`]: '10',
						[`${[FIELDNAME]}_month`]: '2',
						[`${[FIELDNAME]}_year`]: '2022'
					}
				},
				getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
				getBackLink: () => {
					return 'back';
				}
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering({
				section,
				journey,
				customViewData: {},
				payload: formattedDate
			});

			expect(preppedQuestionViewModel).toEqual(
				expect.objectContaining({
					question: {
						value: formattedDate,
						question: dateQuestion.question,
						hint: HINT,
						fieldName: dateQuestion.fieldName,
						pageTitle: dateQuestion.pageTitle,
						description: dateQuestion.description,
						html: dateQuestion.html
					},
					answer: formattedDate,
					layoutTemplate: journey.journeyTemplate,
					pageCaption: section.name,
					navigation: ['', 'back'],
					payload: undefined,
					backLink: 'back',
					showBackToListLink: dateQuestion.showBackToListLink,
					listLink: journey.taskListUrl,
					journeyTitle: journey.journeyTitle
				})
			);
		});

		it('should not add any data to viewmodel if saved or payload data does not exist', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const section = {
				name: 'section-name'
			};

			const journey = {
				baseUrl: '',
				taskListUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				journeyId: 'journey1',
				response: {
					answers: {}
				},
				getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
				getBackLink: () => {
					return 'back';
				}
			};

			const formattedDate = {
				[`${[FIELDNAME]}_day`]: undefined,
				[`${[FIELDNAME]}_month`]: undefined,
				[`${[FIELDNAME]}_year`]: undefined
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering({ section, journey });

			expect(preppedQuestionViewModel).toEqual(
				expect.objectContaining({
					question: {
						value: formattedDate,
						question: dateQuestion.question,
						hint: HINT,
						fieldName: dateQuestion.fieldName,
						pageTitle: dateQuestion.pageTitle,
						description: dateQuestion.description,
						html: dateQuestion.html
					},
					answer: formattedDate,
					layoutTemplate: journey.journeyTemplate,
					pageCaption: section.name,
					navigation: ['', 'back'],
					payload: undefined,
					backLink: 'back',
					showBackToListLink: dateQuestion.showBackToListLink,
					listLink: journey.taskListUrl,
					journeyTitle: journey.journeyTitle
				})
			);
		});

		const tests = [
			{
				date: '2024-02-20T15:00:00.000Z',
				expected: {
					[`${[FIELDNAME]}_day`]: '20',
					[`${[FIELDNAME]}_month`]: '2',
					[`${[FIELDNAME]}_year`]: '2024'
				}
			},
			{
				date: '2024-09-30T20:00:00.000Z',
				expected: {
					[`${[FIELDNAME]}_day`]: '30',
					[`${[FIELDNAME]}_month`]: '9',
					[`${[FIELDNAME]}_year`]: '2024'
				}
			},
			{
				date: '2024-09-30T23:59:00.000Z',
				expected: {
					[`${[FIELDNAME]}_day`]: '1',
					[`${[FIELDNAME]}_month`]: '10',
					[`${[FIELDNAME]}_year`]: '2024'
				}
			},
			{
				date: '2024-10-01T00:00:00.000Z',
				expected: {
					[`${[FIELDNAME]}_day`]: '1',
					[`${[FIELDNAME]}_month`]: '10',
					[`${[FIELDNAME]}_year`]: '2024'
				}
			}
		];

		it.each(tests)('should expect UTC date from server: $date', ({ date, expected }) => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const section = {
				name: 'section-name'
			};

			const journey = {
				journeyId: 'journey1',
				response: {
					answers: {
						[FIELDNAME]: date
					}
				},
				getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
				getBackLink: () => {
					return 'back';
				}
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering({ section, journey });

			expect(preppedQuestionViewModel.question.value).toEqual(expected);
			expect(preppedQuestionViewModel.answer).toEqual(expected);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should return correctly formatted answer if it exists', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const answer = new Date(2023, 0, 1);

			const href = 'fake href';

			const journey = {
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const result = dateQuestion.formatAnswerForSummary('segment', journey, answer);

			expect(result[0].value).toBe('1 January 2023');
			expect(result[0].action.href).toBe(href);
			expect(result[0].action.text).toBe('Change');
			expect(result[0].action.visuallyHiddenText).toBe(QUESTION);
			expect(result[0].key).toBe(TITLE);
		});

		it('should return not started if answer does not exist', () => {
			const dateQuestion = new DateQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				hint: HINT,
				validators: VALIDATORS
			});

			const answer = null;

			const href = 'fake href';

			const journey = {
				getCurrentQuestionUrl: () => {
					return href;
				}
			};

			const result = dateQuestion.formatAnswerForSummary('segment', journey, answer);

			expect(result[0].value).toBe('Not started');
			expect(result[0].action.href).toBe(href);
			expect(result[0].action.text).toBe('Answer');
			expect(result[0].action.visuallyHiddenText).toBe(QUESTION);
			expect(result[0].key).toBe(TITLE);
		});
	});
});
