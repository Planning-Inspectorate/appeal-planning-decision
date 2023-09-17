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

	describe('renderPage', () => {
		it('should renderPage ', () => {
			const question = getTestQuestion();

			const expectedData = {
				layoutTemplate: 'template',
				pageCaption: 'caption',
				backLink: 'back',
				listLink: 'list',
				answer: { a: 1 },
				journeyTitle: 'title'
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
					journeyTitle: expectedData.journeyTitle,
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
