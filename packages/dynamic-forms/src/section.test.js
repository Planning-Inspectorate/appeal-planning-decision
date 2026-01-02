const { Section, SECTION_STATUS } = require('./section');

const mockQuestion = {
	fieldName: 'visitFrequently',
	isRequired: () => true,
	shouldDisplay: () => true,
	isAnswered: () => false
};

describe('./src/dynamic-forms/section.js', () => {
	describe('constructor', () => {
		it('should create', () => {
			const SECTION_NAME = 'Section1';
			const SEGMENT = 'A SEGMENT';
			const section = new Section(SECTION_NAME, SEGMENT);
			expect(section.name).toEqual(SECTION_NAME);
			expect(section.segment).toEqual(SEGMENT);
		});
	});

	describe('addQuestion', () => {
		it('should return self from addQuestion method as a fluent api', () => {
			const section = new Section();
			const result = section.addQuestion(mockQuestion);
			expect(result instanceof Section).toEqual(true);
			expect(result).toEqual(section);
		});

		it('should add a question', () => {
			const section = new Section();
			section.addQuestion(mockQuestion);
			expect(section.questions.length).toEqual(1);
			expect(section.questions[0]).toEqual(mockQuestion);
		});
	});

	describe('addQuestions', () => {
		it('should return self from addQuestions method as a fluent api', () => {
			const section = new Section();
			const result = section.addQuestions([{ question: mockQuestion }]);
			expect(result instanceof Section).toEqual(true);
			expect(result).toEqual(section);
		});

		it('should add questions from an array', () => {
			const section = new Section();
			const mockQuestion2 = {
				fieldName: 'visitFrequently',
				isRequired: () => true,
				shouldDisplay: () => true,
				isAnswered: () => false
			};
			section.addQuestions([{ question: mockQuestion }, { question: mockQuestion2 }]);
			expect(section.questions.length).toEqual(2);
			expect(section.questions[0]).toEqual(mockQuestion);
			expect(section.questions[1]).toEqual(mockQuestion2);
		});
	});

	describe('getStatus', () => {
		it('should return NOT_STARTED when no answers are given', () => {
			const mockJourneyResponse = {
				answers: {}
			};
			const section = new Section();
			section.addQuestion(mockQuestion);
			const result = section.getStatus(mockJourneyResponse);
			expect(result).toBe(SECTION_STATUS.NOT_STARTED);
			const isComplete = section.isComplete(mockJourneyResponse);
			expect(isComplete).toBe(false);
		});

		it('should return IN_PROGRESS when at least one answer is given', () => {
			const mockJourneyResponse = {
				answers: {
					visitFrequently: 'Answer 1'
				}
			};

			const section = new Section();
			section.addQuestion({ ...mockQuestion, isAnswered: () => true });
			section.addQuestion({ ...mockQuestion, isAnswered: () => false });
			const result = section.getStatus(mockJourneyResponse);
			expect(result).toBe(SECTION_STATUS.IN_PROGRESS);
			const isComplete = section.isComplete(mockJourneyResponse);
			expect(isComplete).toBe(false);
		});

		it('should return COMPLETE when all required answers are given', () => {
			const mockJourneyResponse = {
				answers: {
					visitFrequently: 'Answer 1',
					anotherFieldName: 'Answer 2'
				}
			};

			const requiredQuestion = {
				fieldName: 'visitFrequently',
				isRequired: () => true,
				shouldDisplay: () => true,
				isAnswered: () => true
			};

			const anotherRequiredQuestion = {
				fieldName: 'anotherFieldName',
				isRequired: () => true,
				shouldDisplay: () => true,
				isAnswered: () => true
			};

			const notARequiredQuestion = {
				fieldName: 'someQuestion',
				isRequired: () => false,
				shouldDisplay: () => true,
				isAnswered: () => false
			};

			const section = new Section();
			section.addQuestion(requiredQuestion);
			section.addQuestion(anotherRequiredQuestion);
			section.addQuestion(notARequiredQuestion);

			const result = section.getStatus(mockJourneyResponse);
			expect(result).toBe(SECTION_STATUS.COMPLETE);
			const isComplete = section.isComplete(mockJourneyResponse);
			expect(isComplete).toBe(true);
		});
	});
	it('should return COMPLETE when a file upload question has files associated with it', () => {
		const mockJourneyResponse = {
			answers: {
				visitFrequently: 'Answer 1',
				anotherFieldName: 'yes',
				SubmissionDocumentUpload: [
					{
						type: 'testDocType'
					}
				]
			}
		};

		const requiredQuestion = {
			fieldName: 'visitFrequently',
			isRequired: () => true,
			shouldDisplay: () => true,
			isAnswered: () => true
		};

		const anotherRequiredQuestion = {
			fieldName: 'anotherFieldName',
			documentType: {
				name: 'testDocType'
			},
			isRequired: () => true,
			shouldDisplay: () => true,
			isAnswered: () => true
		};

		const notARequiredQuestion = {
			fieldName: 'someQuestion',
			isRequired: () => false,
			shouldDisplay: () => true,
			isAnswered: () => false
		};

		const section = new Section();
		section.addQuestion(requiredQuestion);
		section.addQuestion(anotherRequiredQuestion);
		section.addQuestion(notARequiredQuestion);

		const result = section.getStatus(mockJourneyResponse);
		expect(result).toBe(SECTION_STATUS.COMPLETE);
		const isComplete = section.isComplete(mockJourneyResponse);
		expect(isComplete).toBe(true);
	});
	it('should not return COMPLETE when a file upload question has no files associated with it', () => {
		const mockJourneyResponse = {
			answers: {
				visitFrequently: 'Answer 1',
				anotherFieldName: 'yes',
				SubmissionDocumentUpload: [
					{
						type: 'notTestDocType'
					}
				]
			}
		};

		const requiredQuestion = {
			fieldName: 'visitFrequently',
			isRequired: () => true,
			shouldDisplay: () => true,
			isAnswered: () => true
		};

		const anotherRequiredQuestion = {
			fieldName: 'anotherFieldName',
			isRequired: () => true,
			documentType: {
				name: 'testDocType'
			},
			shouldDisplay: () => true,
			isAnswered: () => false
		};

		const notARequiredQuestion = {
			fieldName: 'someQuestion',
			isRequired: () => false,
			shouldDisplay: () => true,
			isAnswered: () => true
		};

		const section = new Section();
		section.addQuestion(requiredQuestion);
		section.addQuestion(anotherRequiredQuestion);
		section.addQuestion(notARequiredQuestion);

		const result = section.getStatus(mockJourneyResponse);
		expect(result).not.toBe(SECTION_STATUS.COMPLETE);
		const isComplete = section.isComplete(mockJourneyResponse);
		expect(isComplete).toBe(false);
	});
	it('should do a noop', () => {
		const section = new Section();
		const question = {
			title: 'ice breaker',
			question: 'Do you come here often?',
			description: 'Chit chat',
			type: 'Boolean',
			fieldName: 'visitFrequently',
			shouldDisplay: () => true
		};
		section.addQuestion(question);
		section.withCondition(() => true);
		expect(section.questions.length).toEqual(1);
		expect(section.questions[0]).toEqual(question);
	});

	describe('withCondition', () => {
		it('should return self from withCondition method as a fluent api', () => {
			const section = new Section('s1', 'S');
			section.addQuestion(mockQuestion);
			const result = section.withCondition(() => false);
			expect(result instanceof Section).toEqual(true);
			expect(result).toEqual(section);
		});

		it('should remove a question', () => {
			const section = new Section('s1', 'S');
			section.addQuestion(mockQuestion);
			section.withCondition(() => false);
			expect(section.questions[0].shouldDisplay()).toEqual(false);
		});

		it('should not allow two conditions in a row', () => {
			const section = new Section('s1', 'S');
			section.addQuestion(mockQuestion);
			section.withCondition(() => false);
			expect(() => section.withCondition(() => false)).toThrow();
		});

		it('should allow alternating questions & conditions', () => {
			const section = new Section('s1', 'S');
			section
				.addQuestion({ ...mockQuestion })
				.withCondition(() => false)
				.addQuestion({ ...mockQuestion })
				.withCondition(() => true)
				.addQuestion({ ...mockQuestion })
				.withCondition(() => true)
				.addQuestion({ ...mockQuestion })
				.withCondition(() => true)
				.addQuestion({ ...mockQuestion })
				.withCondition(() => true)
				.addQuestion({ ...mockQuestion })
				.withCondition(() => false);
			expect(section.questions[0].shouldDisplay()).toEqual(false);
			expect(section.questions[1].shouldDisplay()).toEqual(true);
			expect(section.questions[2].shouldDisplay()).toEqual(true);
			expect(section.questions[3].shouldDisplay()).toEqual(true);
			expect(section.questions[4].shouldDisplay()).toEqual(true);
			expect(section.questions[5].shouldDisplay()).toEqual(false);
		});
	});
});
