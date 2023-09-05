const Question = require('./question');
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

	const getTestQuestion = (
		title = TITLE,
		question = QUESTION_STRING,
		description = DESCRIPTION,
		viewFolder = TYPE,
		fieldName = FIELDNAME,
		url = URL,
		validators = VALIDATORS
	) => {
		return new Question({
			title,
			question,
			description,
			viewFolder,
			fieldName,
			url,
			validators
		});
	};

	it('should create', () => {
		const question = getTestQuestion();

		expect(question).toBeTruthy();
		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION_STRING);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.viewFolder).toEqual(TYPE);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.url).toEqual(URL);
		expect(question.validators).toEqual(VALIDATORS);
	});

	it('should throw if mandatory parameters not supplied to constructor', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const FIELDNAME = 'favouriteColour';
		expect(() => new Question({ question: QUESTION_STRING, fieldName: FIELDNAME })).toThrow(
			'title parameter is mandatory'
		);
		expect(() => new Question({ title: TITLE, fieldName: FIELDNAME })).toThrow(
			'question parameter is mandatory'
		);
		expect(() => new Question({ title: TITLE, question: QUESTION_STRING })).toThrow(
			'fieldName parameter is mandatory'
		);
	});

	describe('renderPage', () => {
		it('should renderPage ', () => {
			const question = getTestQuestion();

			const expectedData = {
				layoutTemplate: 'template',
				pageCaption: 'caption',
				backLink: 'back',
				listLink: 'list',
				answer: { a: 1 }
			};

			const answers = { question: expectedData.answer };

			question.renderPage(res, {
				...expectedData,
				answers: answers
			});

			const expectedUrl = 'dynamic-components/Select/index';
			const additionalData = {
				question: question.prepQuestionForRendering(answers),
				navigation: ['', expectedData.backLink],
				showBackToListLink: question.showBackToListLink
			};

			expect(res.render).toHaveBeenCalledWith(
				expectedUrl,
				expect.objectContaining({
					answer: expectedData.answer,

					layoutTemplate: expectedData.layoutTemplate,
					pageCaption: expectedData.pageCaption,

					navigation: ['', expectedData.backLink],
					backLink: expectedData.backLink,
					showBackToListLink: question.showBackToListLink,
					listLink: expectedData.listLink,
					...additionalData
				})
			);
		});

		it('should use de-nest uploaded files ', () => {
			const question = getTestQuestion();

			const expectedData = {
				layoutTemplate: 'template',
				pageCaption: 'caption',
				backLink: 'back',
				listLink: 'list'
			};

			const answer = { uploadedFiles: [1, 2] };
			const answers = { question: answer };

			question.renderPage(res, {
				...expectedData,
				answers,
				answer
			});

			const expectedUrl = 'dynamic-components/Select/index';

			expect(res.render).toHaveBeenCalledWith(
				expectedUrl,
				expect.objectContaining({
					uploadedFiles: [1, 2]
				})
			);
		});
	});
});
