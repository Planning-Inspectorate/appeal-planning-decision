const { Section, SECTION_STATUS } = require('./section');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const RequiredValidator = require('./validator/required-validator');

const mockQuestion = {
	fieldName: 'visitFrequently'
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

	describe('withCondition', () => {
		it('should return self from withCondition method as a fluent api', () => {
			const section = new Section();
			section.addQuestion(mockQuestion);
			const result = section.withCondition(false);
			expect(result instanceof Section).toEqual(true);
			expect(result).toEqual(section);
		});

		it('should remove a question', () => {
			const section = new Section();
			section.addQuestion(mockQuestion);
			section.withCondition(false);
			expect(section.questions.length).toEqual(0);
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
			section.addQuestion(mockQuestion);
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
				validators: [new RequiredValidator()]
			};

			const anotherRequiredQuestion = {
				fieldName: 'anotherFieldName',
				validators: [new RequiredFileUploadValidator()]
			};

			const notARequiredQuestion = {
				fieldName: 'someQuestion',
				validators: []
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
	it('should not return COMPLETE when a file upload question has no files associated with it', () => {
		const mockJourneyResponse = {
			answers: {
				visitFrequently: 'Answer 1',
				anotherFieldName: { uploadedFiles: [] }
			}
		};

		const requiredQuestion = {
			fieldName: 'visitFrequently',
			validators: [new RequiredValidator()]
		};

		const anotherRequiredQuestion = {
			fieldName: 'anotherFieldName',
			validators: [new RequiredFileUploadValidator()]
		};

		const notARequiredQuestion = {
			fieldName: 'someQuestion',
			validators: []
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
			fieldName: 'visitFrequently'
		};
		section.addQuestion(question);
		section.withCondition(true);
		expect(section.questions.length).toEqual(1);
		expect(section.questions[0]).toEqual(question);
	});
});
