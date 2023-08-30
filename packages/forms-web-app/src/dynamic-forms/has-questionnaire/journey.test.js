const { HasJourney } = require('./journey');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('HAS Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			try {
				new HasJourney();
			} catch (err) {
				expect(err.message).toBe("Cannot read properties of undefined (reading 'referenceId')");
			}
		});

		it('should error if no referenceId is defined on response', () => {
			try {
				new HasJourney({});
			} catch (err) {
				expect(err.message).toBe("Cannot read properties of undefined (reading 'referenceId')");
			}
		});

		it('should define sections and questions', () => {
			const journey = new HasJourney(mockResponse);
			expect(Array.isArray(journey.sections)).toBe(true);
			expect(journey.sections.length > 0).toBe(true);
			expect(Array.isArray(journey.sections[0].questions)).toBe(true);
			expect(journey.sections[0].questions.length > 0).toBe(true);
		});
	});
});
