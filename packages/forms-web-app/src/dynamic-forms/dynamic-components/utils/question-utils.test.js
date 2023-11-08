const { getConditionalAnswer, getConditionalFieldName } = require('./question-utils');

describe('getConditionalFieldName', () => {
	it('returns conditional field name given parent and child name', () => {
		expect(getConditionalFieldName('parent', 'child')).toEqual('parent_child');
	});
});

describe('getConditionalAnswer', () => {
	let answers;
	let question;
	beforeEach(() => {
		answers = {
			field: 'yes',
			otherField: 'yes',
			field_conditional: 'test'
		};
		question = {
			fieldName: 'field',
			options: [
				{
					value: 'yes',
					conditional: {
						fieldName: 'conditional'
					}
				},
				{
					value: 'no'
				}
			]
		};
	});

	it('returns conditional field value when it exists', () => {
		const expectedResult = 'test';
		expect(getConditionalAnswer(answers, question, 'yes')).toEqual(expectedResult);
	});

	it('returns null when option chosen does not have conditional value', () => {
		answers.field = 'no';
		expect(getConditionalAnswer(answers, question, 'no')).toEqual(null);
	});

	it('returns null when question does not have conditional value', () => {
		delete question.options[0].conditional;
		expect(getConditionalAnswer(answers, question, 'yes')).toEqual(null);
	});
});
