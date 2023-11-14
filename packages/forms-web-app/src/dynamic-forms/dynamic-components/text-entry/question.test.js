const TextEntryQuestion = require('./question');

describe('./src/dynamic-forms/dynamic-components/text-entry/question.js', () => {
	it('should create', () => {
		const TITLE = 'title';
		const QUESTION = 'Question?';
		const DESCRIPTION = 'Describe';
		const FIELDNAME = 'field-name';
		const URL = 'url';
		const PAGE_TITLE = 'this appears in <title>';
		const VALIDATORS = [1, 2];
		const HTML = '/path/to/html.njk';
		const HINT = 'hint';

		const question = new TextEntryQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			url: URL,
			pageTitle: PAGE_TITLE,
			validators: VALIDATORS,
			html: HTML,
			hint: HINT
		});

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('text-entry');
		expect(question.url).toEqual(URL);
		expect(question.pageTitle).toEqual(PAGE_TITLE);
		expect(question.validators).toEqual(VALIDATORS);
		expect(question.html).toEqual(HTML);
		expect(question.hint).toEqual(HINT);
	});
});
