const { Journey } = require('./journey');

const mockSections = [
	{
		segment: 'section1',
		questions: [
			{ fieldName: 'question1', text: 'Question 1' },
			{ fieldName: 'question2', text: 'Question 2' },
			{ fieldName: 'question3', text: 'Question 3' },
			{ fieldName: 'question4', text: 'Question 4', url: 'q4_alternative_url' }
		]
	},
	{
		segment: 'section2',
		questions: [
			{ fieldName: 'question3', text: 'Question 3' },
			{ fieldName: 'question4', text: 'Question 4' }
		]
	}
];

class TestJourney extends Journey {
	constructor(baseUrl, response) {
		super(baseUrl, response);
	}
}

describe('Journey class', () => {
	describe('constructor', () => {
		it('should not be possible to instantiate the base class', () => {
			expect(() => new Journey()).toThrow("Abstract classes can't be instantiated.");
		});

		it('should handle instantiation with no args to constructor', () => {
			const journey = new TestJourney();
			expect(journey.baseUrl).toBe('');
			expect(journey.response).toBe(undefined);
		});

		it('should set response when passed into constructor', () => {
			const mockResponse = { a: 1 };
			const journey = new TestJourney('', mockResponse);
			expect(journey.response).toBe(mockResponse);
		});

		it('should error if baseUrl is not a string', () => {
			try {
				new TestJourney({}, {});
			} catch (err) {
				expect(err.message).toBe('baseUrl should be a string.');
			}
		});

		it('should set baseUrl', () => {
			const baseUrl = '/abc';
			const journey = new TestJourney(baseUrl);

			expect(journey.baseUrl).toBe(baseUrl);
		});

		it('should remove trailing / to baseUrl', () => {
			const baseUrl = '/abc/';
			const journey = new TestJourney(baseUrl, {});

			expect(journey.baseUrl).toBe('/abc');
		});
	});

	describe('getSection', () => {
		it('should return the correct section by section segment', () => {
			const journey = new TestJourney();
			journey.sections = mockSections;

			const question = journey.getSection(mockSections[0].segment);

			expect(question).toEqual(mockSections[0]);
		});

		it('should return undefined if section is not found', () => {
			const journey = new TestJourney();
			journey.sections = mockSections;

			const section = journey.getSection('a', 'b');

			expect(section).toBe(undefined);
		});
	});

	describe('getQuestionBySectionAndName', () => {
		it('should return the correct question by section and name', () => {
			const journey = new TestJourney();
			journey.sections = mockSections;

			const question = journey.getQuestionBySectionAndName(
				mockSections[0].segment,
				mockSections[0].questions[1].fieldName
			);

			expect(question).toEqual(mockSections[0].questions[1]);
		});

		it('should return undefined if section is not found', () => {
			const journey = new TestJourney();
			journey.sections = mockSections;

			const question = journey.getQuestionBySectionAndName('a', 'b');

			expect(question).toBe(undefined);
		});

		it('should return undefined if question is not found', () => {
			const journey = new TestJourney();
			journey.sections = mockSections;

			const question = journey.getQuestionBySectionAndName(mockSections[0].segment, 'nope');

			expect(question).toBe(undefined);
		});
	});

	describe('getNextQuestionUrl', () => {
		it('should return the url for the next question', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[0].fieldName;
			const nextQuestionName = mockSections[0].questions[1].fieldName;

			const journey = new TestJourney();
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(`/${section}/${nextQuestionName}`);
		});

		it('should return the next question URL with baseUrl', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[0].fieldName;
			const nextQuestionName = mockSections[0].questions[1].fieldName;
			const baseUrl = '/test/test';

			const journey = new TestJourney(baseUrl, {});
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(`${baseUrl}/${section}/${nextQuestionName}`);
		});

		it('should return the previous question url if reversed', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;
			const prevQuestionName = mockSections[0].questions[0].fieldName;

			const journey = new TestJourney();
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, true);

			expect(nextQuestionUrl).toBe(`/${section}/${prevQuestionName}`);
		});

		it('should return the questionnaire URL if section is not found', () => {
			const section = 'section3'; // Non-existent section
			const name = mockSections[0].questions[1].fieldName;
			const baseUrl = 'base';

			const journey = new TestJourney(baseUrl);
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(baseUrl);
		});

		it('should return the questionnaire URL if question is not found', () => {
			const section = mockSections[0].segment;
			const name = 'nope'; // Non-existent question
			const baseUrl = 'base';

			const journey = new TestJourney(baseUrl);
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(baseUrl);
		});

		it('should return the questionnaire URL if there is no next question in the current section', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[2].fieldName;
			const baseUrl = 'base';

			const journey = new TestJourney(baseUrl);
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(baseUrl);
		});

		it('should return the questionnaire URL if there is no previous question in the current section', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[0].fieldName;
			const baseUrl = 'base';

			const journey = new TestJourney(baseUrl);
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, true);

			expect(nextQuestionUrl).toBe(baseUrl);
		});
	});

	describe('getCurrentQuestionUrl', () => {
		it('should return the current question URL if found', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;

			const journey = new TestJourney();
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(`/${section}/${name}`);
		});

		it('should return the questionnaire URL if section or question is not found', () => {
			const section = 'nope';
			const name = mockSections[0].questions[1].fieldName;

			const journey = new TestJourney();
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(``);
		});

		it('should return the questionnaire URL with baseUrl', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;
			const baseUrl = '/test/test';

			const journey = new TestJourney(baseUrl, {});
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(nextQuestionUrl).toBe(`${baseUrl}/${section}/${name}`);
		});

		it('should return the current question URL using url slug if set', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[3].url;

			const journey = new TestJourney();
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(`/${section}/${name}`);
		});
	});
});
