const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseHASUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'HAS',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

const getVisibleQuestionUrls = (journey, response) =>
	journey.sections.flatMap((s) =>
		s.questions.filter((q) => q.shouldDisplay(response)).map((q) => q.url)
	);

describe('HAS Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseHASUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/manage-appeals/questionnaire/123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('questionnaire-template.njk');
	});

	it('should set listingPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/questionnaire');
	});

	it('should set informationPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.informationPageViewPath).toBe('dynamic-components/submission-information/index');
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

	describe('expedited questions (on or after 1 April 2026)', () => {
		const ALWAYS_VISIBLE_EXPEDITED_URLS = [
			'significant-changes',
			'design-and-access-statement',
			'list-of-documents'
		];

		const UPLOAD_DESIGN_ACCESS_URL = 'design-access-statement-upload';

		const makeExpeditedResponse = (applicationDate, designAccessStatement) => ({
			...mockResponse,
			answers: {
				designAccessStatement,
				AppealCase: {
					applicationDate
				}
			}
		});

		it('should include expedited questions when applicationDate is on the cutoff date', () => {
			const response = makeExpeditedResponse(new Date('2026-04-01'));
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			ALWAYS_VISIBLE_EXPEDITED_URLS.forEach((url) => expect(urls).toContain(url));
		});

		it('should include expedited questions when applicationDate is after the cutoff date', () => {
			const response = makeExpeditedResponse(new Date('2026-06-15'));
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			ALWAYS_VISIBLE_EXPEDITED_URLS.forEach((url) => expect(urls).toContain(url));
		});

		it('should show upload design access statement when designAccessStatement is "yes"', () => {
			const response = makeExpeditedResponse(new Date('2026-04-01'), 'yes');
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			expect(urls).toContain(UPLOAD_DESIGN_ACCESS_URL);
		});

		it('should NOT show upload design access statement when designAccessStatement is "no"', () => {
			const response = makeExpeditedResponse(new Date('2026-04-01'), 'no');
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			expect(urls).not.toContain(UPLOAD_DESIGN_ACCESS_URL);
		});

		it('should NOT include expedited questions when applicationDate is before the cutoff date', () => {
			const response = makeExpeditedResponse(new Date('2026-03-31'));
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			ALWAYS_VISIBLE_EXPEDITED_URLS.forEach((url) => expect(urls).not.toContain(url));
			expect(urls).not.toContain(UPLOAD_DESIGN_ACCESS_URL);
		});

		it('should NOT include expedited questions when applicationDate is null', () => {
			const response = makeExpeditedResponse(null);
			const journey = new Journey({ ...params, response });
			const urls = getVisibleQuestionUrls(journey, response);
			ALWAYS_VISIBLE_EXPEDITED_URLS.forEach((url) => expect(urls).not.toContain(url));
			expect(urls).not.toContain(UPLOAD_DESIGN_ACCESS_URL);
		});

		it('should NOT include expedited questions when applicationDate is absent', () => {
			const journey = new Journey({ ...params, response: mockResponse });
			const urls = getVisibleQuestionUrls(journey, mockResponse);
			ALWAYS_VISIBLE_EXPEDITED_URLS.forEach((url) => expect(urls).not.toContain(url));
			expect(urls).not.toContain(UPLOAD_DESIGN_ACCESS_URL);
		});
	});
});
