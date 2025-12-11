const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseEnforcementUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'enforcement-questionnaire',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Enforcement Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseEnforcementUrl));
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

	it('should include the "Notifying relevant parties" section and verify its structure', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		console.log(
			'Available Section Names:',
			journey.sections.map((s) => s.name)
		);
		const sectionTitle = 'Notifying relevant parties';
		const notifiedSection = journey.sections.find((s) => s.name === sectionTitle);

		expect(notifiedSection).toBeDefined();

		if (notifiedSection) {
			const questions = notifiedSection.questions || [];

			expect(notifiedSection.name).toBe(sectionTitle);
			expect(questions.length).toBe(2);

			const question1 = questions[0];
			expect(question1.title).toBe(
				'Upload the list of people that you served the enforcement notice to'
			);
			expect(question1.fieldName).toBe('listOfPeopleSentEnforcementNotice');
			expect(question1.url).toContain('upload-enforcement-list');

			const question2 = questions[1];
			expect(question2.title).toBe(
				'Upload the appeal notification letter and the list of people that you notified'
			);
			expect(question2.fieldName).toBe('appealNotification');
			expect(question2.url).toContain('appeal-notification-letter');
		}
	});
});
