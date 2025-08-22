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
