const ValidOptionValidator = require('../../validator/valid-option-validator');
const RadioQuestion = require('./question');
const nunjucks = require('nunjucks');

jest.mock('nunjucks');

const TITLE = 'Radio question';
const QUESTION = 'A radio question';
const DESCRIPTION = 'A description of a radio question';
const FIELDNAME = 'radio-question';
const VIEWFOLDER = 'boolean-text';
const HTML = 'some/html/path';
const LABEL = 'a label';
const OPTIONS = [
	{
		text: 'Yes',
		value: 'yes',
		conditional: {
			question: 'Write some text',
			type: 'text'
		}
	},
	{
		text: 'No',
		value: 'no'
	}
];

describe('./src/dynamic-forms/dynamic-components/radio/question.js', () => {
	it('should create', () => {
		const radioQuestion = new RadioQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			html: HTML,
			label: LABEL,
			options: OPTIONS
		});

		expect(radioQuestion.title).toEqual(TITLE);
		expect(radioQuestion.question).toEqual(QUESTION);
		expect(radioQuestion.description).toEqual(DESCRIPTION);
		expect(radioQuestion.fieldName).toEqual(FIELDNAME);
		expect(radioQuestion.viewFolder).toEqual('radio');
		expect(radioQuestion.html).toEqual(HTML);
		expect(radioQuestion.label).toEqual(LABEL);
		expect(radioQuestion.options).toEqual(OPTIONS);
		expect(radioQuestion.validators).toEqual([new ValidOptionValidator()]);
	});

	it('should add label property to view model when preparing question for rendering', () => {
		nunjucks.render.mockResolvedValue({});

		const radioQuestion = new RadioQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			viewFolder: VIEWFOLDER,
			html: HTML,
			label: LABEL,
			options: OPTIONS
		});

		const section = {
			name: 'section-name'
		};

		const journey = {
			baseUrl: 'list',
			journeyTemplate: 'template',
			journeyTitle: 'title',
			response: {
				answers: {
					[FIELDNAME]: { a: 1 }
				}
			},
			getNextQuestionUrl: () => {
				return 'back';
			}
		};

		const customViewData = { hello: 'hi' };

		const preppedQuestion = radioQuestion.prepQuestionForRendering(
			section,
			journey,
			customViewData
		);

		expect(preppedQuestion.question.label).toEqual(LABEL);
	});
});
