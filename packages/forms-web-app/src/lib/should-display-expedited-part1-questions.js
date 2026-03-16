const { isExpeditedPart1Eligible } = require('./is-expedited-part1-eligible');

/**
 * @param {import('@pins/dynamic-forms/src/journey-response').JourneyResponse & { expeditedAppealsEnabled?: boolean }} response
 * @returns {boolean}
 */
const shouldDisplayExpeditedPart1Questions = (response) => {
	if (response?.expeditedAppealsEnabled !== true) {
		return false;
	}

	return isExpeditedPart1Eligible({
		typeOfPlanningApplication: response?.answers?.typeOfPlanningApplication,
		applicationDate: response?.answers?.onApplicationDate,
		eligibility: {
			applicationDecision: response?.answers?.applicationDecision
		}
	});
};

module.exports = {
	shouldDisplayExpeditedPart1Questions
};
