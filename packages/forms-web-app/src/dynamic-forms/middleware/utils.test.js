const ListAddMoreQuestion = require('@pins/dynamic-forms/src/dynamic-components/list-add-more/question');
const { getAddMoreIfPresent, mapDBResponseToJourneyResponseFormat } = require('./utils');

describe('getAddMoreIfPresent', () => {
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
	it('should convert true to "yes" and false to "no"', () => {
		const dbResponse = {
			field1: true,
			field2: false,
			field3: 'other'
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({
			field1: 'yes',
			field2: 'no',
			field3: 'other'
		});
	});

	it('should handle empty object', () => {
		const dbResponse = {};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({});
	});

	it('should not convert non-boolean values', () => {
		const dbResponse = {
			field1: 0,
			field2: 1,
			field3: null,
			field4: undefined,
			field5: 'yes'
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({
			field1: 0,
			field2: 1,
			field3: null,
			field4: undefined,
			field5: 'yes'
		});
	});
});
