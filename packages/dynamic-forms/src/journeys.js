const { Journey } = require('./journey');

/**
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('./journey').Journey>[0], 'response'>} JourneyParameters
 */

class Journeys {
	/** @type {Record<string, JourneyParameters>} */
	journeyParams = {};

	/** @param {JourneyParameters} journeyParams */
	registerJourney(journeyParams) {
		const { journeyId } = journeyParams;
		if (this.journeyParams[journeyId]) {
			throw new Error(`A journey with id ${journeyId} has already been registered`);
		}

		this.journeyParams[journeyId] = journeyParams;
	}

	/** @returns {string[]} */
	getRegisteredJourneyIds() {
		return Object.keys(this.journeyParams);
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Journey}
	 */
	getJourney(journeyResponse) {
		const { journeyId } = journeyResponse;
		if (!this.journeyParams[journeyId]) {
			throw new Error(`No journey with id ${journeyId} has been registered`);
		}

		const journey = new Journey({ ...this.journeyParams[journeyId], response: journeyResponse });
		journey.setResponse(journeyResponse);
		return journey;
	}
}

module.exports = {
	Journeys
};
