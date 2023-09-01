/***********************************************************
 * This file holds the base class definition for a journey *
 * (e.g. questionnaire). Specific journeys should be       *
 * defined in a class which extends this one               *
 ***********************************************************/

/**
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 * @typedef {import('./question')} Question
 */

/**
 * A journey (An entire set of questions required for a completion of a submission)
 * @class
 * @abstract
 */
class Journey {
	/**
	 * @type {Array.<Section>} sections - sections within the journey
	 */
	sections = [];
	/**
	 * @type {JourneyResponse} response - the user's response to the journey so far
	 */
	response;
	/**
	 * @type {string} baseUrl - base url of the journey, gets prepended to question urls
	 */
	baseUrl = '';

	/**
	 * creates an instance of a journey
	 * @param {string} baseUrl - base url of journey
	 * @param {JourneyResponse} response - user's response (currently unused)
	 */
	constructor(baseUrl, response) {
		if (this.constructor == Journey) {
			throw new Error("Abstract classes can't be instantiated.");
		}

		/**
		 * trim the final slash off of a string
		 * @param {string} urlPath
		 * @returns {string} returns a string without a trailing slash
		 */
		function trimTrailingSlash(urlPath) {
			return urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
		}

		if (baseUrl !== undefined && typeof baseUrl !== 'string') {
			throw new Error('baseUrl should be a string.');
		}

		if (baseUrl) {
			this.baseUrl = trimTrailingSlash(baseUrl);
		}

		this.response = response;
	}

	/**
	 * utility function to build up a url to a question
	 * @param {*} sectionSegment url param for a section
	 * @param {*} questionSegment url param for a question
	 * @returns {string} url for a question
	 */
	#buildQuestionUrl(sectionSegment, questionSegment) {
		return `${this.baseUrl}/${sectionSegment}/${questionSegment}`;
	}

	/**
	 * Gets section based on segment
	 * @param {string} sectionSegment
	 * @returns {Section | undefined}
	 */
	getSection(sectionSegment) {
		return this.sections.find((s) => {
			return s.segment === sectionSegment;
		});
	}

	/**
	 * Get question within a section
	 * @param {Section} section
	 * @param {string} questionSegment
	 * @returns {Question | undefined} question if it belongs in the given section
	 */
	#getQuestion(section, questionSegment) {
		return section?.questions.find((q) => {
			return q.fieldName === questionSegment || q.url === questionSegment;
			// todo: should we rename fieldName on question to segment so it's clear it's used as a url
		});
	}

	/**
	 * gets a question from the object's sections based on a section + question names
	 * @param {string} sectionSegment segment of the section to find the question in
	 * @param {string} questionSegment fieldname of the question to lookup
	 * @returns {Question | undefined} question found by lookup
	 */
	getQuestionBySectionAndName(sectionSegment, questionSegment) {
		const section = this.getSection(sectionSegment);

		if (!section) {
			return undefined;
		}

		return this.#getQuestion(section, questionSegment);
	}

	/**
	 * Get url for the next question in this section
	 * @param {string} sectionSegment - section segment
	 * @param {string} questionSegment - question segment
	 * @param {boolean} reverse - if passed in this will get the previous question
	 * @returns {string} url for the next question
	 */
	getNextQuestionUrl(sectionSegment, questionSegment, reverse) {
		const unmatchedUrl = this.baseUrl;

		// find section index
		const sectionIndex = this.sections.findIndex((s) => s.segment === sectionSegment);
		if (sectionIndex === -1) {
			return unmatchedUrl;
		}

		// find question index
		const questionIndex = this.sections[sectionIndex].questions.findIndex(
			(q) => q.fieldName === questionSegment
		);
		if (questionIndex === -1) {
			return unmatchedUrl;
		}

		// increment or decrement index based on reverse argument
		const newIndex = questionIndex + (reverse ? -1 : 1);

		// check new question exists
		const questionExists = newIndex >= 0 && newIndex < this.sections[sectionIndex].questions.length;
		if (!questionExists) {
			return unmatchedUrl;
		}

		return this.#buildQuestionUrl(
			this.sections[sectionIndex].segment,
			this.sections[sectionIndex].questions[newIndex].url
				? this.sections[sectionIndex].questions[newIndex].url
				: this.sections[sectionIndex].questions[newIndex].fieldName
		);
	}

	/**
	 * Gets the url for the current question
	 * @param {string} sectionSegment - section segment name
	 * @param {string} questionSegment - question segment name
	 * @returns {string} url for the current question
	 */
	getCurrentQuestionUrl = (sectionSegment, questionSegment) => {
		const unmatchedUrl = this.baseUrl;

		// find section
		const matchingSection = this.getSection(sectionSegment);
		if (!matchingSection) {
			return unmatchedUrl;
		}

		// find question
		const matchingQuestion = this.#getQuestion(matchingSection, questionSegment);
		if (!matchingQuestion) {
			return unmatchedUrl;
		}

		return this.#buildQuestionUrl(
			matchingSection.segment,
			matchingQuestion.url ? matchingQuestion.url : matchingQuestion.fieldName
		);
	};
}

module.exports = { Journey };
