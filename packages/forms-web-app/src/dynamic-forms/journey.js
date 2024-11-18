/***********************************************************
 * This file holds the base class definition for a journey *
 * (e.g. questionnaire). Specific journeys should be       *
 * instances of this class                                 *
 ***********************************************************/

const config = require('../config');

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
	/** @type {string} journeyId - a unique, human-readable id for this journey */
	journeyId;
	/** @type {Array.<Section>} sections - sections within the journey */
	sections = [];
	/** @type {JourneyResponse} response - the user's response to the journey so far */
	response;
	/** @type {string} baseUrl - base url of the journey, gets prepended to question urls */
	baseUrl = '';
	/** @type {(journeyResponse: JourneyResponse) => string} baseUrl - base url of the journey, gets prepended to question urls */
	makeBaseUrl = () => '';
	/** @type {string} taskListUrl - url that renders the task list */
	taskListUrl = '';
	/** @type {string} journeyTemplate - nunjucks template file used for */
	journeyTemplate = '';
	/** @type {string} listingPageViewPath - nunjucks template file used for listing page */
	listingPageViewPath = '';
	/** @type {string} informationPageViewPath - nunjucks template file used for pdf summary information page */
	informationPageViewPath = '';
	/** @type {boolean} defines how the next/previous question handles end of sections */
	returnToListing = false;
	/**@type {string} used as part of the overall page title */
	journeyTitle;

	/**
	 * creates an instance of a journey
	 * @param {object} options
	 * @param {string} options.journeyId - a unique, human-readable id for this journey
	 * @param {(response: JourneyResponse) => string} options.makeBaseUrl - base url of journey
	 * @param {string} [options.taskListUrl] - task list url - added to base url, can be left undefined
	 * @param {JourneyResponse} options.response - user's response
	 * @param {string} options.journeyTemplate - template used for all views
	 * @param {string} options.listingPageViewPath - path to njk view for listing page
	 * @param {string} [options.informationPageViewPath] - path to njk view for pdf summary page
	 * @param {string} options.journeyTitle - part of the title in the njk view
	 * @param {boolean} [options.returnToListing] - defines how the next/previous question handles end of sections
	 * @param {Section[]} options.sections
	 */
	constructor({
		journeyId,
		makeBaseUrl,
		taskListUrl,
		response,
		journeyTemplate,
		listingPageViewPath,
		informationPageViewPath,
		journeyTitle,
		returnToListing,
		sections
	}) {
		if (!journeyId || typeof journeyId !== 'string') {
			throw new Error('journeyId should be a string.');
		}

		this.journeyId = journeyId;

		this.makeBaseUrl = makeBaseUrl;
		const baseUrlStr = makeBaseUrl(response);
		if (!baseUrlStr || typeof baseUrlStr !== 'string') {
			throw new Error('baseUrl should be a string.');
		}
		this.baseUrl = this.#trimTrailingSlash(baseUrlStr);

		this.taskListUrl = this.#prependPathToUrl(this.baseUrl, taskListUrl);

		if (!journeyTemplate || typeof journeyTemplate !== 'string') {
			throw new Error('journeyTemplate should be a string.');
		}
		this.journeyTemplate = journeyTemplate;

		if (!listingPageViewPath || typeof listingPageViewPath !== 'string') {
			throw new Error('listingPageViewPath should be a string.');
		}
		this.listingPageViewPath = listingPageViewPath;

		this.informationPageViewPath = informationPageViewPath || '';

		if (!journeyTitle || typeof journeyTitle !== 'string') {
			throw new Error('journeyTitle should be a string.');
		}
		this.journeyTitle = journeyTitle;

		this.returnToListing = returnToListing ?? false;

		this.response = response;

		this.sections = sections;
	}

	/**
	 * trim the final slash off of a string
	 * @param {string} urlPath
	 * @returns {string} returns a string without a trailing slash
	 */
	#trimTrailingSlash(urlPath) {
		return urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
	}

	/**
	 * @param {string} originalUrl
	 * @param {string} [pathToPrepend]
	 * @returns {string}
	 */
	#prependPathToUrl(originalUrl, pathToPrepend) {
		if (!pathToPrepend) return originalUrl;

		const urlObject = new URL(originalUrl, 'http://example.com'); // requires a base url, not returned
		urlObject.pathname = this.#trimTrailingSlash(urlObject.pathname) + '/' + pathToPrepend;

		let relativeUrl = urlObject.pathname + urlObject.search;

		if (!originalUrl.startsWith('/')) relativeUrl = relativeUrl.substring(1);

		return relativeUrl;
	}

	/**
	 * utility function to build up a url to a question
	 * @param {string} sectionSegment url param for a section
	 * @param {string} questionSegment url param for a question
	 * @returns {string} url for a question
	 */
	#buildQuestionUrl(sectionSegment, questionSegment) {
		if (sectionSegment === config.dynamicForms.DEFAULT_SECTION) {
			return this.#prependPathToUrl(this.baseUrl, `${questionSegment}`);
		}
		return this.#prependPathToUrl(this.baseUrl, `${sectionSegment}/${questionSegment}`);
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

	#flattenQuestions() {
		/** @typedef {{ section: Section, question: Question, sectionIndex: number, questionIndex: number }} FlattenedQuestion */
		/** @type {FlattenedQuestion[]} */
		const initialAccI = [];
		/** @type {FlattenedQuestion[]} */
		const initialAccJ = [];
		return this.sections.reduce(
			(acci, section, sectionIndex) => [
				...acci,
				...section.questions.reduce(
					(accj, question, questionIndex) => [
						...accj,
						{ section, question, sectionIndex, questionIndex }
					],
					initialAccJ
				)
			],
			initialAccI
		);
	}

	/**
	 * Get url for the next question in this section
	 * @param {string} sectionSegment - section segment
	 * @param {string} questionSegment - question segment
	 * @returns {string} url for the next question
	 */
	getNextQuestionUrl(sectionSegment, questionSegment) {
		const flattenedQuestions = this.#flattenQuestions();

		const currentQuestionIndex = flattenedQuestions.findIndex(
			({ section: { segment }, question: { fieldName } }) =>
				segment === sectionSegment && fieldName === questionSegment
		);

		if (currentQuestionIndex === -1) return this.taskListUrl;

		const currentQuestion = flattenedQuestions[currentQuestionIndex];

		if (currentQuestion.question.shouldLoopBack(this.response)) {
			return this.getPerviousQuestionUrl(sectionSegment, questionSegment);
		}

		for (let ii = currentQuestionIndex + 1; ii < flattenedQuestions.length; ii++) {
			const flattenedQuestion = flattenedQuestions[ii];
			if (this.returnToListing && flattenedQuestion.sectionIndex !== currentQuestion.sectionIndex) {
				// Return user to task list if the next question is outside this segment
				return this.taskListUrl;
			}

			if (flattenedQuestion.question.shouldDisplay(this.response)) {
				return this.#buildQuestionUrl(
					flattenedQuestion.section.segment,
					flattenedQuestion.question.url || flattenedQuestion.question.fieldName
				);
			}
		}

		return this.taskListUrl;
	}

	/**
	 * Get url for the next question in this section
	 * @param {string} sectionSegment - section segment
	 * @param {string} questionSegment - question segment
	 * @returns {string} url for the next question
	 */
	getPerviousQuestionUrl(sectionSegment, questionSegment) {
		const flattenedQuestions = this.#flattenQuestions();

		const currentQuestionIndex = flattenedQuestions.findIndex(
			({ section: { segment }, question: { fieldName } }) =>
				segment === sectionSegment && fieldName === questionSegment
		);

		if (currentQuestionIndex === -1) return this.taskListUrl;

		const currentQuestion = flattenedQuestions[currentQuestionIndex];

		for (let ii = currentQuestionIndex - 1; ii >= 0; ii--) {
			const flattenedQuestion = flattenedQuestions[ii];
			if (this.returnToListing && flattenedQuestion.sectionIndex !== currentQuestion.sectionIndex) {
				// Return user to task list if the next question is outside this segment
				return this.taskListUrl;
			}

			if (flattenedQuestion.question.shouldDisplay(this.response)) {
				return this.#buildQuestionUrl(
					flattenedQuestion.section.segment,
					flattenedQuestion.question.url || flattenedQuestion.question.fieldName
				);
			}
		}

		return this.taskListUrl;
	}

	/**
	 * Gets the url for the current question
	 * @param {string} sectionSegment - section segment name
	 * @param {string} questionSegment - question segment name
	 * @returns {string} url for the current question
	 */
	getCurrentQuestionUrl = (sectionSegment, questionSegment) => {
		const unmatchedUrl = this.taskListUrl;

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

	/**
	 * Gets the url for the current question
	 * @param {string} questionSegment - question segment name
	 * @returns {string} url for the current question
	 */
	getCurrentQuestionUrlWithoutSection = (questionSegment) => {
		return `${this.baseUrl}/${encodeURIComponent(questionSegment)}`;
	};

	/**
	 * Gets the url for the current question
	 * @param {string} sectionSegment - section segment name
	 * @param {string} questionSegment - question segment name
	 * @param {string} addition - question segment name
	 * @returns {string} url for the current question
	 */
	addToCurrentQuestionUrl = (sectionSegment, questionSegment, addition) => {
		const unmatchedUrl = this.taskListUrl;

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

		const questionUrl = matchingQuestion.url ?? matchingQuestion.fieldName;

		return this.#buildQuestionUrl(matchingSection.segment, questionUrl + addition);
	};

	/**
	 * Gets the overall completeness status of a journey based on the response associated with it and the complete state of each section.
	 * @returns {boolean} Boolean indicating if a journey response is complete
	 */
	isComplete() {
		return this.sections.every((section) => section.isComplete(this.response));
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 */
	setResponse(journeyResponse) {
		this.response = journeyResponse;
		this.baseUrl = this.#trimTrailingSlash(this.makeBaseUrl(journeyResponse));
	}
}

module.exports = { Journey };
