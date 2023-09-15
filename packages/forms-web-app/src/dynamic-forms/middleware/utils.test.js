const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');
const Question = require('../question');
const { getSubquestionIfPresent } = require('./utils');

describe('getSubquestionIfPresent', () => {
	it('should return subQuestion if not on add more', () => {
		const req = { body: {} };

		class TestQuestion extends Question {}

		const question = new ListAddMoreQuestion({
			title: 'title',
			question: 'question',
			validators: [],
			fieldName: 'field1',
			subQuestion: new TestQuestion({
				pageTitle: 'test',
				title: 'sub-title',
				question: 'sub-question',
				viewFolder: 'sub-view',
				fieldName: 'field2',
				validators: []
			})
		});

		const result = getSubquestionIfPresent(req, question);
		expect(result).toEqual(question.subQuestion);
	});

	it('should return question if on add more', () => {
		const req = {
			body: {
				'add-more-question': undefined
			}
		};
		const question = { subQuestion: {} };
		const result = getSubquestionIfPresent(req, question);
		expect(result).toEqual(question);
	});

	it('should return question if no subQuestion', () => {
		const req = { body: {} };
		const question = {};
		const result = getSubquestionIfPresent(req, question);
		expect(result).toEqual(question);
	});
});
