const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseS78LPAFinalCommentsUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'S78',
	referenceId: '123',
	answers: [],
	LPACode: 'TEST_LPA_CODE'
};

jest.mock('../questions', () => ({
	getQuestions: jest.fn(() => ({
		lpaContinue: { fieldName: 'statementContinue' },
		lpaFinalComment: { fieldName: 'lpaFinalComment' },
		lpaHowSubmitFinalComment: { fieldName: 'lpaHowSubmitFinalComment' },
		lpaFinalCommentDetails: { fieldName: 'lpaFinalCommentDetails' },
		uploadLPAFinalCommentDocuments: { fieldName: 'uploadLPAFinalCommentDocuments' }
	}))
}));

describe('S78 LPA Final Comments Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new Journey(params);
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});

		it('should set baseUrl', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78LPAFinalCommentsUrl));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(journey.taskListUrl).toEqual('/manage-appeals/final-comments/123');
		});

		it('should set template', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(journey.journeyTemplate).toBe('statement-template.njk');
		});

		it('should set listingPageViewPath', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/final-comments');
		});

		it('should set journeyTitle', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(journey.journeyTitle).toBe('Manage your appeals');
		});

		it('should define sections and questions', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			expect(Array.isArray(journey.sections)).toBe(true);
			expect(journey.sections.length > 0).toBe(true);
			expect(Array.isArray(journey.sections[0].questions)).toBe(true);
			expect(journey.sections[0].questions.length > 0).toBe(true);
		});
	});

	describe('Routing conditions (lpaHowSubmitFinalComment)', () => {
		it('should show the text entry question when "text" is selected', () => {
			const responseWithText = {
				...mockResponse,
				answers: { lpaFinalComment: 'yes', lpaHowSubmitFinalComment: 'text' }
			};
			const journey = new Journey({ ...params, response: responseWithText });
			const section = journey.sections[0];

			const textQuestion = section.questions.find((q) => q.fieldName === 'lpaFinalCommentDetails');
			expect(textQuestion?.shouldDisplay(responseWithText)).toBe(true);

			const uploadQuestion = section.questions.find(
				(q) => q.fieldName === 'uploadLPAFinalCommentDocuments'
			);
			expect(uploadQuestion?.shouldDisplay(responseWithText)).toBe(false);
		});

		it('should show the document upload question when "document" is selected', () => {
			const responseWithDocument = {
				...mockResponse,
				answers: { lpaFinalComment: 'yes', lpaHowSubmitFinalComment: 'document' }
			};
			const journey = new Journey({ ...params, response: responseWithDocument });
			const section = journey.sections[0];

			const uploadQuestion = section.questions.find(
				(q) => q.fieldName === 'uploadLPAFinalCommentDocuments'
			);
			expect(uploadQuestion?.shouldDisplay(responseWithDocument)).toBe(true);

			const textQuestion = section.questions.find((q) => q.fieldName === 'lpaFinalCommentDetails');
			expect(textQuestion?.shouldDisplay(responseWithDocument)).toBe(false);
		});
	});
});
