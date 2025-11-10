const SingleLineInputQuestion = require('./question');

describe('/single-line-input/question.js', () => {
	const section = { segment: 'test-section', name: 'Test section' };
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const FIELDNAME = 'field-name';
	const VALIDATORS = [1, 2];
	const HTML = '/path/to/html.njk';
	const HINT = 'hint';
	const LABEL = 'A label';
	const INPUT_ATTRIBUTES = { attr1: 'val1', attr2: 'val2' };

	const buildQuestion = () =>
		new SingleLineInputQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			validators: VALIDATORS,
			html: HTML,
			hint: HINT,
			label: LABEL,
			inputAttributes: INPUT_ATTRIBUTES
		});

	const buildJourney = (answerVal) => {
		const journey = {
			response: { answers: { [FIELDNAME]: answerVal } },
			getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
			getBackLink: jest.fn().mockReturnValue('/back')
		};
		return journey;
	};

	it('should create', () => {
		const question = buildQuestion();

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('single-line-input');
		expect(question.validators).toEqual(VALIDATORS);
		expect(question.html).toEqual(HTML);
		expect(question.hint).toEqual(HINT);
		expect(question.label).toEqual(LABEL);
	});

	describe('prepQuestionForRendering', () => {
		it('should return view model for question', () => {
			const answer = 'test';
			const question = buildQuestion();
			const journey = buildJourney(answer);
			const result = question.prepQuestionForRendering({ section, journey });
			expect(result).toEqual(
				expect.objectContaining({
					answer: answer,
					question: expect.objectContaining({
						label: LABEL,
						value: answer,
						attributes: INPUT_ATTRIBUTES
					})
				})
			);
		});

		it('should use payload for question value if provided', () => {
			const answer = 'test';
			const question = buildQuestion();
			const journey = buildJourney(answer);
			const result = question.prepQuestionForRendering({
				section,
				journey,
				payload: {
					[FIELDNAME]: 'different'
				}
			});
			expect(result).toEqual(
				expect.objectContaining({
					answer: answer,
					question: expect.objectContaining({
						value: 'different'
					})
				})
			);
		});
	});
});
