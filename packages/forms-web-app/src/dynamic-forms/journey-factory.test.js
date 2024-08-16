const { getJourney } = require('./journey-factory');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

const { HasJourney } = require('../journeys/lpa/has');
const { S78Journey } = require('../journeys/s78-questionnaire');
const { HasAppealFormJourney } = require('../journeys/has/appellant/journey');

describe('journey-factory', () => {
	describe('getJourney', () => {
		it('should create LPA Questionnaire journeys based on the journeyId', () => {
			const hasQuestionnaireJourney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE
			});
			const s78QuestionnaireJourney = getJourney({
				journeyId: JOURNEY_TYPES.S78_QUESTIONNAIRE
			});

			expect(hasQuestionnaireJourney instanceof HasJourney).toBe(true);
			expect(s78QuestionnaireJourney instanceof S78Journey).toBe(true);
		});

		it('should create Appeal Form journeys based on the journeyId', () => {
			const hasAppealJourney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_APPEAL_FORM
			});

			expect(hasAppealJourney instanceof HasAppealFormJourney).toBe(true);
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
