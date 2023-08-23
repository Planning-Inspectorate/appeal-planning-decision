/**
 * @typedef {import('./journey-types').JourneyType} JourneyType
 */

/**
 * Defines a response to a journey, a set of Answers to the questions
 * @class
 */
class JourneyResponse {
	/**
	 * @type {string} - reference id used in the url for the journey e.g. appeal id - provides a unique lookup for responses in combination with formId
	 */
	referenceId;

	/**
	 * @type {JourneyType} - a reference to the journey type e.g. has-questionnaire - provides a unique lookup for responses in combination with referenceId
	 */
	journeyId;

	/**
	 * @type {Object} - answers to the journey
	 */
	answers;

	/**
	 * creates an instance of a JourneyResponse
	 * @param {JourneyType} journeyId
	 * @param {string} referenceId
	 * @param {Object | undefined} answers
	 */
	constructor(journeyId, referenceId, answers) {
		this.journeyId = journeyId;
		this.referenceId = referenceId;
		if (answers) {
			this.answers = answers;
		} else {
			this.answers = {};
		}
	}
}

module.exports = { JourneyResponse };
