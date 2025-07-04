const BooleanQuestion = require('./question');

describe('./src/dynamic-forms/dynamic-components/boolean/question.js', () => {
	it('should create', () => {
		const TITLE = 'A boolean question';
		const QUESTION = 'Do you like Tina Turner, Ted?';
		const DESCRIPTION = 'Tina Turner question';
		const FIELDNAME = 'likeTinaTurner';
		const HTML = 'some/path.html';
		const booleanQuestion = new BooleanQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			html: HTML
		});
		expect(booleanQuestion.title).toEqual(TITLE);
		expect(booleanQuestion.question).toEqual(QUESTION);
		expect(booleanQuestion.description).toEqual(DESCRIPTION);
		expect(booleanQuestion.fieldName).toEqual(FIELDNAME);
		expect(booleanQuestion.html).toEqual(HTML);
		expect(booleanQuestion.options[0].text).toEqual('Yes');
		expect(booleanQuestion.options[0].value).toEqual('yes');
		expect(booleanQuestion.options[1].text).toEqual('No');
		expect(booleanQuestion.options[1].value).toEqual('no');
		expect(booleanQuestion.viewFolder).toEqual('boolean');
	});
});
