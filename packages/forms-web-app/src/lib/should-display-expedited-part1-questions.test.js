const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { APPLICATION_DECISION, TYPE_OF_PLANNING_APPLICATION } =
	require('@pins/business-rules').constants;
const {
	shouldDisplayExpeditedPart1Questions
} = require('./should-display-expedited-part1-questions');

describe('shouldDisplayExpeditedPart1Questions', () => {
	const baseResponse = {
		journeyId: JOURNEY_TYPES.S78_APPEAL_FORM.id,
		expeditedAppealsEnabled: true,
		answers: {
			typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
			onApplicationDate: '2026-04-01T10:00:00.000Z',
			applicationDecision: APPLICATION_DECISION.GRANTED
		}
	};

	it('returns true when flag is enabled and eligibility criteria are met', () => {
		expect(shouldDisplayExpeditedPart1Questions(baseResponse)).toBe(true);
	});

	it('returns false when flag is disabled', () => {
		expect(
			shouldDisplayExpeditedPart1Questions({
				...baseResponse,
				expeditedAppealsEnabled: false
			})
		).toBe(false);
	});

	it('does not depend on journey type', () => {
		expect(
			shouldDisplayExpeditedPart1Questions({
				...baseResponse,
				journeyId: JOURNEY_TYPES.HAS_APPEAL_FORM.id
			})
		).toBe(true);
	});

	it('returns false when expedited criteria are not met', () => {
		expect(
			shouldDisplayExpeditedPart1Questions({
				...baseResponse,
				answers: {
					...baseResponse.answers,
					onApplicationDate: '2026-03-31T10:00:00.000Z'
				}
			})
		).toBe(false);
	});
});
