const { JourneyResponse } = require('./journey-response');

describe('JourneyResponse class', () => {
	describe('constructor', () => {
		it('should handle instantiation with no args to constructor', () => {
			const response = new JourneyResponse();
			expect(response.journeyId).toBe(undefined);
			expect(response.referenceId).toBe(undefined);
			expect(response.answers).toStrictEqual({});
		});

		it('should set journeyId when passed into constructor', () => {
			const ref = 'test';
			const response = new JourneyResponse(ref);
			expect(response.journeyId).toBe(ref);
		});

		it('should set referenceId when passed into constructor', () => {
			const ref = 'test';
			const response = new JourneyResponse('', ref);
			expect(response.referenceId).toBe(ref);
		});

		it('should set answers when passed into constructor', () => {
			const answers = [1, 2];
			const response = new JourneyResponse('', '', answers);
			expect(response.answers).toBe(answers);
		});
	});
});
