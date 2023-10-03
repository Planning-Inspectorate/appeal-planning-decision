const ValidOptionValidator = require('../../validator/valid-option-validator');
const BooleanTextQuestion = require('./question');
const nunjucks = require('nunjucks');

jest.mock('nunjucks');

const TITLE = 'Boolean text question';
const QUESTION = 'A boolean text question';
const DESCRIPTION = 'A description of a boolean text question';
const FIELDNAME = 'boolean-text-question';
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

describe('./src/dynamic-forms/dynamic-components/boolean/question.js', () => {
	it('should create', () => {
		const booleanTextQuestion = new BooleanTextQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			html: HTML,
			label: LABEL,
			options: OPTIONS
		});

		expect(booleanTextQuestion.title).toEqual(TITLE);
		expect(booleanTextQuestion.question).toEqual(QUESTION);
		expect(booleanTextQuestion.description).toEqual(DESCRIPTION);
		expect(booleanTextQuestion.fieldName).toEqual(FIELDNAME);
		expect(booleanTextQuestion.html).toEqual(HTML);
		expect(booleanTextQuestion.label).toEqual(LABEL);
		expect(booleanTextQuestion.options).toEqual(OPTIONS);
		expect(booleanTextQuestion.validators).toEqual([new ValidOptionValidator()]);
		expect(booleanTextQuestion.viewFolder).toEqual('boolean-text');
	});

	it('should add label property to view model when preparing question for rendering', () => {
		nunjucks.render.mockResolvedValue({});

		const booleanTextQuestion = new BooleanTextQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
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

		const preppedQuestion = booleanTextQuestion.prepQuestionForRendering(
			section,
			journey,
			customViewData
		);

		expect(preppedQuestion.question.label).toEqual(LABEL);
	});
});
