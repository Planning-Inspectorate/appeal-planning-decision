const { Section } = require('./section');
describe('./src/dynamic-forms/section.js', () => {
	it('should create', () => {
		const SECTION_NAME = 'Section1';
		const SEGMENT = 'A SEGMENT';
		const section = new Section(SECTION_NAME, SEGMENT);
		expect(section.name).toEqual(SECTION_NAME);
		expect(section.segment).toEqual(SEGMENT);
	});
	it('should return self from addQuestion method as  a fluent api', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently'
		};
		const result = section.addQuestion(question);
		expect(result instanceof Section).toEqual(true);
		expect(result).toEqual(section);
	});
	it('should return self from withCondition method as  a fluent api', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently'
		};
		section.addQuestion(question);
		const result = section.withCondition(false);
		expect(result instanceof Section).toEqual(true);
		expect(result).toEqual(section);
	});
	it('should add a question', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently'
		};
		section.addQuestion(question);
		expect(section.questions.length).toEqual(1);
		expect(section.questions[0]).toEqual(question);
	});
	it('should remove a question', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently'
		};
		section.addQuestion(question);
		section.withCondition(false);
		expect(section.questions.length).toEqual(0);
	});
	it('should do a noop', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently'
		};
		section.addQuestion(question);
		section.withCondition(true);
		expect(section.questions.length).toEqual(1);
		expect(section.questions[0]).toEqual(question);
	});
});
