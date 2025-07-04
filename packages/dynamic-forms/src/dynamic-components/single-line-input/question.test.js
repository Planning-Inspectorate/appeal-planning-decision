const SingleLineInputQuestion = require('./question');

describe('./src/dynamic-forms/dynamic-components/single-line-input/question.js', () => {
	it('should create', () => {
		const TITLE = 'title';
		const QUESTION = 'Question?';
		const FIELDNAME = 'field-name';
		const VALIDATORS = [1, 2];
		const HTML = '/path/to/html.njk';
		const HINT = 'hint';
		const LABEL = 'A label';

		const question = new SingleLineInputQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			validators: VALIDATORS,
			html: HTML,
			hint: HINT,
			label: LABEL
		});

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('single-line-input');
		expect(question.validators).toEqual(VALIDATORS);
		expect(question.html).toEqual(HTML);
		expect(question.hint).toEqual(HINT);
		expect(question.label).toEqual(LABEL);
	});
});
