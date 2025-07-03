const ListAddMoreQuestion = require('../../dynamic-components/list-add-more/question');
const { getAddMoreIfPresent } = require('./utils');

describe('getSubquestionIfPresent', () => {
	it('should return subQuestion if not on add more', () => {
		const req = { body: { field2: 'someval' } };

		const question = new ListAddMoreQuestion({
			title: 'title',
			question: 'question',
			validators: [],
			fieldName: 'field1',
			subQuestionProps: {
				type: 'case',
				title: 'sub-title',
				question: 'sub-question',
				viewFolder: 'sub-view',
				fieldName: 'field2',
				validators: []
			}
		});

		const result = getAddMoreIfPresent(req, question);
		expect(result).toEqual(question.subQuestion);
	});

	it('should return question if on add more', () => {
		const req = {
			body: {
				'add-more-question': undefined
			}
		};
		const question = { subQuestion: {} };
		const result = getAddMoreIfPresent(req, question);
		expect(result).toEqual(question);
	});

	it('should return question if no subQuestion', () => {
		const req = { body: {} };
		const question = {};
		const result = getAddMoreIfPresent(req, question);
		expect(result).toEqual(question);
	});
});

describe('mapDBResponseToJourneyResponseFormat', () => {
	const { mapDBResponseToJourneyResponseFormat } = require('./utils');

	it('should convert true to "yes" and false to "no"', () => {
		const dbResponse = {
			field1: true,
			field2: false,
			field3: 'some string',
			field4: 123
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({
			field1: 'yes',
			field2: 'no',
			field3: 'some string',
			field4: 123
		});
	});

	it('should handle empty object', () => {
		const result = mapDBResponseToJourneyResponseFormat({});
		expect(result).toEqual({});
	});

	it('should leave non-boolean values unchanged', () => {
		const dbResponse = {
			field1: null,
			field2: undefined,
			field3: [1, 2, 3],
			field4: { a: 1 }
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual(dbResponse);
	});
});
