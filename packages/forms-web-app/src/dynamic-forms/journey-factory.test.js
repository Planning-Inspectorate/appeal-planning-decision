const { JOURNEY_TYPES, getJourney } = require('./journey-factory');

const { HasJourney } = require('./has-questionnaire/journey');

describe('journey-factory', () => {
	describe('getJourney', () => {
		it('should create a journey based on the journeyId', () => {
			const jouney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE
			});

			expect(jouney instanceof HasJourney).toBe(true);
		});

		it('should error if an invalid journey type is used', () => {
			expect(() =>
				getJourney({
					journeyId: 'nope'
				})
			).toThrow('invalid journey type');
		});
	});
});
