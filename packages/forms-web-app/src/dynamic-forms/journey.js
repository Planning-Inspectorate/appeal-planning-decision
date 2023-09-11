/***********************************************************
 * This file holds the base class definition for a journey *
 * (e.g. questionnaire). Specific journeys should be       *
 * defined in a class which extends this one               *
 ***********************************************************/
const { SECTION_STATUS } = require('./section');

/**
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 * @typedef {import('./question')} Question
 * @typedef {import('../../node_modules/express/lib/request')} ExpressRequest
 */

/**
 * @typedef {Object} ListingPageData
 * @property {SummaryListView} summaryListData
 * @property {string|null} pageCaption
 * @property {Object|null} customData
 */

/**
 * A journey (An entire set of questions required for a completion of a submission)
 * @class
 * @abstract
 */
class Journey {
	/** @type {Array.<Section>} sections - sections within the journey */
	sections = [];
	/** @type {JourneyResponse} response - the user's response to the journey so far */
	response;
	/** @type {string} baseUrl - base url of the journey, gets prepended to question urls */
	baseUrl = '';
	/** @type {string} journeyTemplate - nunjucks template file used for */
	journeyTemplate = '';
	/** @type {string} listingPageViewPath - nunjucks template file used for listing page */
	listingPageViewPath = '';
	/** @type {boolean} defines how the next/previous question handles end of sections */
	returnToListing = false;

	/**
	 * creates an instance of a journey
	 * @param {string} baseUrl - base url of journey
	 * @param {JourneyResponse} response - user's response
	 * @param {string} journeyTemplate - template used for all views
	 * @param {string} listingPageViewPath - path to njk view for listing page
	 */
	constructor(baseUrl, response, journeyTemplate, listingPageViewPath) {
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

		if (!journeyTemplate && typeof journeyTemplate !== 'string') {
			throw new Error('journeyTemplate should be a string.');
		}
		this.journeyTemplate = journeyTemplate;

		if (!listingPageViewPath && typeof listingPageViewPath !== 'string') {
			throw new Error('listingPageViewPath should be a string.');
		}
		this.listingPageViewPath = listingPageViewPath;

		this.response = response;
	}

	/**
	 * utility function to build up a url to a question
	 * @param {string} sectionSegment url param for a section
	 * @param {string} questionSegment url param for a question
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
		const numberOfSections = this.sections.length;
		const sectionsStart = reverse ? numberOfSections - 1 : 0;

		let currentSectionIndex;
		let foundSection = false;
		let takeNextQuestion = false;

		for (let i = sectionsStart; reverse ? i >= 0 : i < numberOfSections; reverse ? i-- : i++) {
			const currentSection = this.sections[i];
			const numberOfQuestions = currentSection.questions.length;

			if (currentSection.segment === sectionSegment) {
				foundSection = true;
				currentSectionIndex = i;
			}

			if (foundSection) {
				if (this.returnToListing && i !== currentSectionIndex) {
					return unmatchedUrl;
				}

				const questionsStart = reverse ? numberOfQuestions - 1 : 0;
				for (
					let j = questionsStart;
					reverse ? j >= 0 : j < numberOfQuestions;
					reverse ? j-- : j++
				) {
					const question = currentSection.questions[j];
					if (takeNextQuestion) {
						return this.#buildQuestionUrl(
							currentSection.segment,
							question.url ? question.url : question.fieldName
						);
					}

					if (question.fieldName === questionSegment) {
						takeNextQuestion = true;
					}
				}
			}
		}

		return unmatchedUrl;
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

	/**
	 * @typedef {Object} SummaryListView
	 * @property {Array.<SectionView>} sections - an array of sections
	 * @property {number} completedSectionCount - number of sections that are completed
	 */

	/**
	 * @typedef {Object} SectionView
	 * @property {string} heading
	 * @property {string} status
	 * @property {Object} list
	 * @property {Array.<RowView>} list.rows
	 */

	/**
	 * @typedef {Object} RowView
	 * @property {Object} key
	 * @property {string} key.text
	 * @property {Object} value
	 * @property {string} value.text
	 * @property {Object} actions
	 * @property {Array.<ActionView>} actions.items
	 */

	/**
	 * @typedef {Object} ActionView
	 * @property {string} href
	 * @property {string} text
	 * @property {string} [visuallyHiddenText]
	 */

	/**
	 * build a view model for a section in the journey overview
	 * @param {string} name
	 * @param {string} status
	 * @returns {SectionView} a representation of a section
	 */
	#buildSectionViewModel = (name, status) => {
		return {
			heading: name,
			status: status,
			list: {
				rows: []
			}
		};
	};

	/**
	 * build a view model for a row in the journey overview
	 * @param {string} key
	 * @param {string} value
	 * @param {ActionView} action
	 * @returns {RowView} a representation of a row
	 */
	#buildSectionRowViewModel = (key, value, action) => {
		return {
			key: {
				text: key
			},
			value: {
				text: value
			},
			actions: {
				items: [action]
			}
		};
	};

	/**
	 * @returns {SummaryListView}
	 */
	buildSummaryPageData = () => {
		/**
		 * @type {SummaryListView}
		 */
		const summaryListData = {
			sections: [],
			completedSectionCount: 0
		};

		for (const section of this.sections) {
			const status = section.getStatus(this.response);
			const sectionView = this.#buildSectionViewModel(section.name, status);

			// update completed count
			if (status === SECTION_STATUS.COMPLETE) {
				summaryListData.completedSectionCount++;
			}

			// add questions
			for (const question of section.questions) {
				// don't show question on tasklist if set to false
				if (question.taskList === false) {
					continue;
				}

				// use custom formatting function
				if (question.format) {
					const rows = question.format(
						this.response.answers,
						this.response.referenceId,
						section.segment,
						question.fieldName
					);

					for (let rowData of rows) {
						const action = {
							href: rowData.ctaLink,
							text: rowData.ctaText
						};

						const row = this.#buildSectionRowViewModel(rowData.title, rowData.value, action);
						sectionView.list.rows.push(row);
					}

					continue;
				}

				// default question format
				const key = question.title ?? question.question;
				const value =
					question.altText ?? this.response?.answers[question.fieldName] ?? 'Not started';
				const action = {
					href: this.getCurrentQuestionUrl(section.segment, question.fieldName),
					text: 'Answer',
					visuallyHiddenText: question.question
				};

				const row = this.#buildSectionRowViewModel(key, value, action);
				sectionView.list.rows.push(row);
			}

			summaryListData.sections.push(sectionView);
		}

		return summaryListData;
	};

	/**
	 * @param {ExpressRequest} req
	 * @returns {Promise.<ListingPageData>} listing page data
	 */ // eslint-disable-next-line no-unused-vars
	getListingPageData = async (req) => {
		return {
			summaryListData: this.buildSummaryPageData(),
			pageCaption: null,
			customData: null
		};
	};
}

module.exports = { Journey };
