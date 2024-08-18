const { getJourney } = require('./journey-factory');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { Journey } = require('./journey');

describe('journey-factory', () => {
	describe('getJourney', () => {
		it('should create LPA Questionnaire journeys based on the journeyId', () => {
			const hasQuestionnaireJourney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
				referenceId: '',
				answers: {},
				LPACode: ''
			});
			const s78QuestionnaireJourney = getJourney({
				journeyId: JOURNEY_TYPES.S78_QUESTIONNAIRE,
				referenceId: '',
				answers: {},
				LPACode: ''
			});

			expect(hasQuestionnaireJourney instanceof Journey).toBe(true);
			expect(s78QuestionnaireJourney instanceof Journey).toBe(true);
		});

		it('should create Appeal Form journeys based on the journeyId', () => {
			const hasAppealJourney = getJourney({
				journeyId: JOURNEY_TYPES.HAS_APPEAL_FORM,
				referenceId: '',
				answers: {},
				LPACode: ''
			});

			expect(hasAppealJourney instanceof Journey).toBe(true);
		});

		it('should error if an invalid journey type is used', () => {
			expect(() =>
				getJourney({
					journeyId: 'nope',
					referenceId: '',
					answers: {},
					LPACode: ''
				})
			).toThrow('invalid journey type');
		});
	});
});
