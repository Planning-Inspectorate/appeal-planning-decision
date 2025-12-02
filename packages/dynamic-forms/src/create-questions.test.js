const { createQuestions } = require('./create-questions');

describe('createQuestions', () => {
	class CheckboxQ {
		constructor(props, response, overrides) {
			this.constructorArgs = { props, response, overrides };
		}
	}
	class RadioQ {
		constructor(props, response, overrides) {
			this.constructorArgs = { props, response, overrides };
		}
	}

	const questionClasses = { checkbox: CheckboxQ, radio: RadioQ };

	const response = {
		referenceId: '123',
		journeyId: '123',
		answers: {},
		LPACode: 'Q1111'
	};

	it('creates an instance per entry keyed by question name', () => {
		const propsRecord = {
			question1: {
				type: 'checkbox',
				title: 't1',
				question: 'q1',
				fieldName: 'f1',
				viewFolder: 'vf1',
				options: []
			},
			question2: {
				type: 'checkbox',
				title: 't2',
				question: 'q2',
				fieldName: 'f2',
				viewFolder: 'vf1',
				options: []
			},
			question3: {
				type: 'radio',
				title: 't3',
				question: 'q3',
				fieldName: 'f3',
				viewFolder: 'vf2',
				options: []
			}
		};

		const overrides = { checkbox: {}, radio: {} };

		const result = createQuestions(response, propsRecord, questionClasses, overrides);

		expect(result.question1).toBeInstanceOf(CheckboxQ);
		expect(result.question2).toBeInstanceOf(CheckboxQ);
		expect(result.question3).toBeInstanceOf(RadioQ);
	});

	it('passes response as second constructor arg', () => {
		const overrides = { checkbox: { custom: () => 'test' } };
		const propsRecord = {
			q1: {
				type: 'checkbox',
				title: 'title',
				question: 'question',
				fieldName: 'field',
				viewFolder: 'vf',
				options: []
			}
		};

		const { q1 } = createQuestions(response, propsRecord, questionClasses, overrides);

		expect(q1.constructorArgs.response).toBe(response);
	});

	it('passes method overrides as third constructor arg', () => {
		const overrides = { checkbox: { custom: () => 'test' } };
		const propsRecord = {
			q1: {
				type: 'checkbox',
				title: 'title',
				question: 'question',
				fieldName: 'field',
				viewFolder: 'vf',
				options: []
			}
		};

		const { q1 } = createQuestions(response, propsRecord, questionClasses, overrides);

		expect(q1.constructorArgs.overrides).toBe(overrides.checkbox);
	});

	it('throws if question type class not supplied', () => {
		const propsRecord = {
			broken: { type: 'boolean', title: 't', question: 'q', fieldName: 'f', viewFolder: 'vf' }
		};
		expect(() => createQuestions(response, propsRecord, questionClasses, {})).toThrow();
	});
});
