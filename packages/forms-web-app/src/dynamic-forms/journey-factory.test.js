const { getJourney } = require('./journey-factory');
const { JOURNEY_TYPES } = require('./journey-types');

const { HasJourney } = require('./has-questionnaire/journey');
const { S78Journey } = require('./s78-questionnaire/journey');

describe('journey-factory', () => {
	describe('getJourney', () => {
		it('should create a journey based on the journeyId', () => {
			const hasJourney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE
			});
			const s78Journey = getJourney({
				journeyId: JOURNEY_TYPES.S78_QUESTIONNAIRE
			});

			expect(hasJourney instanceof HasJourney).toBe(true);
			expect(s78Journey instanceof S78Journey).toBe(true);
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
