const { Journey } = require('@pins/dynamic-forms/src/journey');
const config = require('../../config');
const { baseAppellantFinalCommentUrl, ...params } = require('./journey');
const mockResponse = {
	journeyId: 'S78',
	referenceId: '123',
	answers: []
};

jest.mock('../questions', () => ({
	getQuestions: jest.fn(() => ({
		appellantContinue: {},
		appellantFinalComment: {},
		appellantFinalCommentDetails: {},
		appellantFinalCommentDocuments: {},
		uploadAppellantFinalCommentDocuments: {}
	}))
}));

jest.mock('../../config', () => ({
	betaBannerText: 'BETA:',
	generateBetaBannerFeedbackLink: jest.fn((url) => `LINK:${url}`),
	getAppealTypeFeedbackUrl: jest.fn((code) => `URL_FOR:${code ?? 'DEFAULT'}`),
	dynamicForms: {
		DEFAULT_SECTION: 'default'
	}
}));

describe('S78 Final Comments Journey', () => {
	describe('constructor', () => {
		it('should throw error when response is undefined', () => {
			expect(() => new Journey(params)).toThrow(
				"Cannot read properties of undefined (reading 'referenceId')"
			);
		});

		it('should set baseUrl with correct path and referenceId', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.baseUrl).toContain(baseAppellantFinalCommentUrl);
			expect(journey.baseUrl).toContain(mockResponse.referenceId);
		});

		it('should set taskListUrl with referenceId', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.taskListUrl).toBe('/appeals/final-comments/123');
		});

		it('should set correct journey template', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.journeyTemplate).toBe('final-comments-template.njk');
		});

		it('should set correct listing page view path', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/final-comments');
		});

		it('should set journey title', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.journeyTitle).toBe('Appeal a planning decision');
		});

		it('should initialize sections with questions', () => {
			const journey = new Journey({ ...params, response: mockResponse });

			expect(journey.sections).toBeInstanceOf(Array);
			expect(journey.sections.length).toBeGreaterThan(0);
			expect(journey.sections[0].questions).toBeInstanceOf(Array);
			expect(journey.sections[0].questions.length).toBeGreaterThan(0);
		});
	});

	describe('makeBannerHtmlOverride', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it.each(['S78', 'HAS', 'ADVERTS', 'LDC'])(
			'should use appealTypeCode "%s" to generate feedback link',
			(appealTypeCode) => {
				const html = params.makeBannerHtmlOverride({
					referenceId: '123',
					answers: { AppealCase: { appealTypeCode } }
				});

				expect(config.getAppealTypeFeedbackUrl).toHaveBeenCalledWith(appealTypeCode);
				expect(html).toBe(`BETA:LINK:URL_FOR:${appealTypeCode}`);
			}
		);

		it('should use default feedback URL when appealTypeCode is not present', () => {
			const html = params.makeBannerHtmlOverride({
				referenceId: '123',
				answers: {}
			});

			expect(config.getAppealTypeFeedbackUrl).toHaveBeenCalledWith(undefined);
			expect(html).toBe('BETA:LINK:URL_FOR:DEFAULT');
		});
	});
});
