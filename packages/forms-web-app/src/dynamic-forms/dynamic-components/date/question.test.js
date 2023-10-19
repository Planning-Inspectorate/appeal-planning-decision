const Question = require('../../question');
const DateQuestion = require('./question');

describe('DataQuestion', () => {
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
				baseUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				response: {
					answers: {
						[FIELDNAME]: date
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				}
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering(section, journey);

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
					listLink: journey.baseUrl,
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
				baseUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				response: {
					answers: {
						[`${[FIELDNAME]}_day`]: '10',
						[`${[FIELDNAME]}_month`]: '2',
						[`${[FIELDNAME]}_year`]: '2022'
					}
				},
				getNextQuestionUrl: () => {
					return 'back';
				}
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering(
				section,
				journey,
				{},
				formattedDate
			);

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
					listLink: journey.baseUrl,
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
				baseUrl: 'list',
				journeyTemplate: 'template',
				journeyTitle: 'title',
				response: {
					answers: {}
				},
				getNextQuestionUrl: () => {
					return 'back';
				}
			};

			const formattedDate = {
				[`${[FIELDNAME]}_day`]: undefined,
				[`${[FIELDNAME]}_month`]: undefined,
				[`${[FIELDNAME]}_year`]: undefined
			};

			const preppedQuestionViewModel = dateQuestion.prepQuestionForRendering(section, journey);

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
					listLink: journey.baseUrl,
					journeyTitle: journey.journeyTitle
				})
			);
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
