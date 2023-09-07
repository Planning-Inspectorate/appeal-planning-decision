const { Journey } = require('./journey');

const mockSections = [
	{
		segment: 'section1',
		questions: [
			{ fieldName: 'question1', text: 'Question 1' },
			{ fieldName: 'question2', text: 'Question 2', prepQuestionForRendering: jest.fn() },
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
	constructor(baseUrl, response, journeyTemplate, listingPageViewPath) {
		super(baseUrl, response, journeyTemplate, listingPageViewPath);
	}
}

describe('Journey class', () => {
	let constructorArgs;

	beforeEach(() => {
		jest.resetAllMocks();
		constructorArgs = {
			baseUrl: '',
			response: {
				answers: {}
			},
			journeyTemplate: '',
			listingPageViewPath: ''
		};
	});

	describe('constructor', () => {
		it('should not be possible to instantiate the base class', () => {
			expect(() => new Journey()).toThrow("Abstract classes can't be instantiated.");
		});

		it('should throw if no arguments passed into constructor', () => {
			expect(() => new TestJourney()).toThrow();
		});

		it('should set response when passed into constructor', () => {
			constructorArgs.response = { a: 1 };
			const journey = new TestJourney(...Object.values(constructorArgs));
			expect(journey.response).toBe(constructorArgs.response);
		});

		it('should error if baseUrl is not a string', () => {
			constructorArgs.baseUrl = { a: 1 };
			expect(() => new TestJourney(...Object.values(constructorArgs))).toThrow(
				'baseUrl should be a string.'
			);
		});

		it('should set baseUrl', () => {
			constructorArgs.baseUrl = '/abc';
			const journey = new TestJourney(...Object.values(constructorArgs));

			expect(journey.baseUrl).toBe(constructorArgs.baseUrl);
		});

		it('should remove trailing / to baseUrl', () => {
			constructorArgs.baseUrl = '/abc/';
			const journey = new TestJourney(...Object.values(constructorArgs));

			expect(journey.baseUrl).toBe('/abc');
		});

		it('should set journeyTemplate', () => {
			constructorArgs.journeyTemplate = 'test';
			const journey = new TestJourney(...Object.values(constructorArgs));

			expect(journey.journeyTemplate).toBe(constructorArgs.journeyTemplate);
		});

		it('should set listingPageViewPath', () => {
			constructorArgs.listingPageViewPath = 'test';
			const journey = new TestJourney(...Object.values(constructorArgs));

			expect(journey.listingPageViewPath).toBe(constructorArgs.listingPageViewPath);
		});
	});

	describe('getSection', () => {
		it('should return the correct section by section segment', () => {
			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const question = journey.getSection(mockSections[0].segment);

			expect(question).toEqual(mockSections[0]);
		});

		it('should return undefined if section is not found', () => {
			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const section = journey.getSection('a', 'b');

			expect(section).toBe(undefined);
		});
	});

	describe('getQuestionBySectionAndName', () => {
		it('should return the correct question by section and name', () => {
			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const question = journey.getQuestionBySectionAndName(
				mockSections[0].segment,
				mockSections[0].questions[1].fieldName
			);

			expect(question).toEqual(mockSections[0].questions[1]);
		});

		it('should return undefined if section is not found', () => {
			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const question = journey.getQuestionBySectionAndName('a', 'b');

			expect(question).toBe(undefined);
		});

		it('should return undefined if question is not found', () => {
			const journey = new TestJourney(...Object.values(constructorArgs));
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

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(`/${section}/${nextQuestionName}`);
		});

		it('should return the next question URL with baseUrl', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[0].fieldName;
			const nextQuestionName = mockSections[0].questions[1].fieldName;
			constructorArgs.baseUrl = '/test/test';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(`${constructorArgs.baseUrl}/${section}/${nextQuestionName}`);
		});

		it('should return the previous question url if reversed', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;
			const prevQuestionName = mockSections[0].questions[0].fieldName;

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, true);

			expect(nextQuestionUrl).toBe(`/${section}/${prevQuestionName}`);
		});

		it('should return the questionnaire URL if section is not found', () => {
			const section = 'section3'; // Non-existent section
			const name = mockSections[0].questions[1].fieldName;
			constructorArgs.baseUrl = 'base';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(constructorArgs.baseUrl);
		});

		it('should return the questionnaire URL if question is not found', () => {
			const section = mockSections[0].segment;
			const name = 'nope'; // Non-existent question
			constructorArgs.baseUrl = 'base';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(constructorArgs.baseUrl);
		});

		it('should return the questionnaire URL if there is no next question in the current section', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[3].fieldName;
			constructorArgs.baseUrl = 'base';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, false);

			expect(nextQuestionUrl).toBe(constructorArgs.baseUrl);
		});

		it('should return the questionnaire URL if there is no previous question in the current section', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[0].fieldName;
			constructorArgs.baseUrl = 'base';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getNextQuestionUrl(section, name, true);

			expect(nextQuestionUrl).toBe(constructorArgs.baseUrl);
		});
	});

	describe('getCurrentQuestionUrl', () => {
		it('should return the current question URL if found', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(`/${section}/${name}`);
		});

		it('should return the questionnaire URL if section or question is not found', () => {
			const section = 'nope';
			const name = mockSections[0].questions[1].fieldName;

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(``);
		});

		it('should return the questionnaire URL with baseUrl', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[1].fieldName;
			constructorArgs.baseUrl = '/test/test';

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const nextQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(nextQuestionUrl).toBe(`${constructorArgs.baseUrl}/${section}/${name}`);
		});

		it('should return the current question URL using url slug if set', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[3].url;

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(`/${section}/${name}`);
		});

		it('should return the current question URL using url slug if set', () => {
			const section = mockSections[0].segment;
			const name = mockSections[0].questions[3].url;

			const journey = new TestJourney(...Object.values(constructorArgs));
			journey.sections = mockSections;

			const currentQuestionUrl = journey.getCurrentQuestionUrl(section, name);

			expect(currentQuestionUrl).toBe(`/${section}/${name}`);
		});
	});
});
