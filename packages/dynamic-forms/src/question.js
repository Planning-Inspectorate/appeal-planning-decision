const { capitalize, nl2br } = require('./lib/string-functions');
const { numericFields } = require('./dynamic-components/utils/numeric-fields');
const escape = require('escape-html');
const RequiredValidator = require('./validator/required-validator');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const MultiFieldInputValidator = require('./validator/multi-field-input-validator');
const AddressValidator = require('./validator/address-validator');

/**
 * @typedef {import('./validator/base-validator')} BaseValidator
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 * @typedef {string} QuestionVariables
 */

/**
 * @typedef {Object} PreppedQuestion
 * @property {unknown} value
 * @property {string} question
 * @property {string} fieldName
 * @property {string} pageTitle
 * @property {string} [description]
 * @property {string} [html]
 */

/**
 * @typedef {Object} QuestionViewModel
 * @property {PreppedQuestion} question
 * @property {string} layoutTemplate
 * @property {string} pageCaption
 * @property {Array.<string>} navigation
 * @property {string} backLink
 * @property {boolean} showBackToListLink
 * @property {boolean} showSkipLink
 * @property {string} listLink
 * @property {string} [appealSiteGridReferenceLink]
 */

/**
 * A specific question within a journey which is made up of one (usually) or many (sometimes) components and their required content.
 * @class
 */
class Question {
	/** @type {string} - html page title, defaults to question if not provided */
	pageTitle;
	/** @type {string} - title used in the summary list */
	title;
	/** @type {string} - question shown to user on question page */
	question;
	/** @type {string|undefined} - additional information to user about the question */
	description;
	/** @type {string} the folder name of the view */
	viewFolder;
	/** @type {string} the unique name of the input on the page, also used as a url segment (should this be separated) */
	fieldName;
	/** @type {Array.<BaseValidator>} array of validators that a question uses to validate answers */
	validators = [];
	/** @type {string|undefined} hint text displayed to user */
	hint;
	/** @type {boolean} show return to listing page link after question */
	showBackToListLink = true;
	/** @type {boolean} show link to next question in case that officer report isn't complete */
	showSkipLink = false;
	/** @type {string|undefined} alternative url slug */
	url;
	/** @type {string|undefined} optional html content */
	html;
	/** @type {string|undefined} optional question type */
	interfaceType;
	/** @type {(response: JourneyResponse) => boolean} */
	shouldDisplay = () => true;
	/** @type {() => boolean} */
	shouldDisplayOnTaskList = () => true;
	/** @type {Array.<string>|undefined} optional variables content*/
	variables;
	/** @type {string|undefined} optional back link text */
	backLinkText;
	/** @type {object|undefined} optional custom data object */
	customData;

	details = {
		title: '',
		text: ''
	};

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.viewFolder
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {Array.<BaseValidator>} [params.validators]
	 * @param {string} [params.html]
	 * @param {boolean} [params.showSkipLink]
	 * @param {string} [params.hint]
	 * @param {string} [params.interfaceType]
	 * @param {(response: JourneyResponse) => boolean} [params.shouldDisplay]
	 * @param {() => boolean} [params.shouldDisplayOnTaskList]
	 * @param {Array.<QuestionVariables>} [params.variables]
	 * @param {string} [params.backLinkText]
	 * @param {object} [params.customData]
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{
			title,
			question,
			viewFolder,
			fieldName,
			url,
			pageTitle,
			description,
			validators,
			html,
			hint,
			interfaceType,
			shouldDisplay,
			shouldDisplayOnTaskList,
			variables,
			showSkipLink,
			backLinkText,
			customData
		},
		methodOverrides
	) {
		if (!title || title === '') throw new Error('title parameter is mandatory');
		if (!question || question === '') throw new Error('question parameter is mandatory');
		if (!viewFolder || viewFolder === '') throw new Error('viewFolder parameter is mandatory');
		if (!fieldName || fieldName === '') throw new Error('fieldName parameter is mandatory');
		this.title = title;
		this.question = question;
		this.viewFolder = viewFolder;
		this.fieldName = fieldName;
		this.url = url;
		this.html = html;
		this.pageTitle = pageTitle ?? question;
		this.description = description;
		this.hint = hint;
		this.interfaceType = interfaceType;
		this.variables = variables;
		this.showSkipLink = showSkipLink || false;
		this.backLinkText = backLinkText;
		this.customData = customData;

		if (shouldDisplay) {
			this.shouldDisplay = shouldDisplay;
		}

		if (shouldDisplayOnTaskList) {
			this.shouldDisplayOnTaskList = shouldDisplayOnTaskList;
		}

		if (Array.isArray(validators)) {
			this.validators = validators;
		}

		Object.entries(methodOverrides || {}).forEach(([methodName, methodOverride]) => {
			// @ts-ignore
			this[methodName] = methodOverride.bind(this);
		});
	}

	/**
	 * gets the view model for this question
	 * @param {Object} options - the current section
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {unknown} [options.payload]
	 * @param {string} [options.sessionBackLink]
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		const answer = journey.response.answers[this.fieldName] || '';
		const backLink = journey.getBackLink(section.segment, this.fieldName, sessionBackLink);

		// gets url for next qs
		let nextQuestionUrl = journey.getNextQuestionUrl(
			section.segment,
			this.fieldName,
			false // get next question
		);
		// If last qs, default to task list
		if (nextQuestionUrl === null) {
			nextQuestionUrl = journey.taskListUrl;
		}

		const viewModel = {
			question: this.getQuestionModel(section, answer),
			answer,

			layoutTemplate: journey.journeyTemplate,
			pageCaption: section?.name,

			navigation: ['', backLink],
			backLink,
			showBackToListLink: this.showBackToListLink,
			showSkipLink: this.showSkipLink,
			listLink: journey.taskListUrl,
			skipLinkUrl: nextQuestionUrl,
			journeyTitle: journey.journeyTitle,
			payload,
			bannerHtmlOverride: journey.makeBannerHtmlOverride(journey.response),
			backLinkText: this.backLinkText,
			...customViewData
		};

		return viewModel;
	}

	/**
	 * gets the view model for this question
	 * @param {Section | undefined} section - the current section
	 * @param {any} [answer]
	 * @returns {PreppedQuestion} question
	 */
	getQuestionModel(section, answer) {
		let question = {
			value: answer,
			question: this.question,
			fieldName: this.fieldName,
			pageTitle: this.pageTitle,
			description: this.description,
			html: this.html,
			hint: this.hint,
			interfaceType: this.interfaceType
		};
		return this.replaceVariables(section, question);
	}

	/**
	 * replace the key of each variable to required text
	 * @param {Section | undefined} section - the current section
	 * @param {any} item - object item
	 * @returns {any} item
	 */
	replaceVariables(section, item) {
		if (!this.variables || !section?.sectionVariables) return item;

		/**
		 * Replace variables in string
		 * @param {string} str - object item
		 * @returns {any} item
		 */
		const replaceInString = (str) =>
			this.variables?.reduce((s, variable) => {
				const value = section.sectionVariables[variable];
				return value ? s.replace(new RegExp(variable, 'g'), value) : s;
			}, str);

		/**
		 * Replace variables of objects and children
		 * @param {any} input - object item
		 * @returns {any} item
		 */
		const walk = (input) => {
			if (Array.isArray(input)) {
				return input.map(walk);
			} else if (input && typeof input === 'object') {
				return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, walk(value)]));
			} else if (typeof input === 'string') {
				return replaceInString(input);
			}
			return input;
		};

		return walk(item);
	}

	/**
	 * renders the question
	 * @param {import('express').Response} res - the express response
	 * @param {QuestionViewModel} viewModel additional data to send to view
	 * @returns {void}
	 */
	renderAction(res, viewModel) {
		return res.render(`dynamic-components/${this.viewFolder}/index`, viewModel);
	}

	/**
	 * Save the answer to the question
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {function(string, Object): Promise<any>} saveFunction
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	async saveAction(req, res, saveFunction, journey, section, journeyResponse) {
		// check for validation errors
		const errorViewModel = this.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			return this.renderAction(res, errorViewModel);
		}

		// save
		const responseToSave = await this.getDataToSave(req, journeyResponse);
		await saveFunction(journeyResponse.referenceId, responseToSave.answers);

		// check for saving errors
		const saveViewModel = this.checkForSavingErrors(req, section, journey);
		if (saveViewModel) {
			return this.renderAction(res, saveViewModel);
		}

		// move to the next question
		return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
	}

	/**
	 * check for validation errors
	 * @param {import('express').Request} req
	 * @param {Journey} journey
	 * @param {Section} sectionObj
	 * @returns {QuestionViewModel|undefined} returns the view model for displaying the error or undefined if there are no errors
	 */
	checkForValidationErrors(req, sectionObj, journey) {
		const { body } = req;
		let { errors = {}, errorSummary = [] } = body;
		const customViewData = this.replaceVariables(sectionObj, {
			errors,
			errorSummary
		});

		if (Object.keys(errors).length > 0) {
			return this.prepQuestionForRendering({
				section: sectionObj,
				journey,
				customViewData,
				payload: body
			});
		}
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/**
		 * @type {{ answers: Record<string, unknown> }}
		 */
		let responseToSave = { answers: {} };

		responseToSave.answers[this.fieldName] = req.body[this.fieldName];

		for (const propName in req.body) {
			if (propName.startsWith(this.fieldName + '_')) {
				responseToSave.answers[propName] = req.body[propName];
				journeyResponse.answers[propName] = req.body[propName];
			} else if (numericFields.has(propName)) {
				const numericValue = Number(req.body[propName]);
				if (!isNaN(numericValue)) {
					responseToSave.answers[propName] = numericValue;
					journeyResponse.answers[propName] = numericValue;
				}
			}
		}

		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}

	/**
	 * check for errors after saving, by default this does nothing
	 * @param {import('express').Request} req
	 * @param {Journey} journey
	 * @param {Section} sectionObj
	 * @returns {QuestionViewModel | undefined} returns the view model for displaying the error or undefined if there are no errors
	 */ //eslint-disable-next-line no-unused-vars
	checkForSavingErrors(req, sectionObj, journey) {
		return;
	}

	/**
	 * Handles redirect after saving
	 * @param {import('express').Response} res
	 * @param {Journey} journey
	 * @param {string} sectionSegment
	 * @param {string} questionSegment
	 * @returns {void}
	 */
	handleNextQuestion(res, journey, sectionSegment, questionSegment) {
		let next = journey.getNextQuestionUrl(sectionSegment, questionSegment, false);
		if (next === null) {
			next = journey.taskListUrl;
		}
		return res.redirect(next);
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {string | null} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array<{
	 *   key: string;
	 *   value: string | Object;
	 *   action: {
	 *     href: string;
	 *     text: string;
	 *     visuallyHiddenText: string;
	 *   };
	 * }>}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer, capitals = true) {
		const section = journey.getSection(sectionSegment);
		const formattedAnswer = capitals
			? capitalize(answer ?? this.NOT_STARTED)
			: (answer ?? this.NOT_STARTED);
		const displayAnswer = this.replaceVariables(section, formattedAnswer);
		const action = this.getAction(sectionSegment, journey, answer);
		const model = this.replaceVariables(section, { title: this.title, question: this.question });
		const key = model.title ?? model.question;
		let rowParams = [];
		rowParams.push({
			key: key,
			value: nl2br(escape(displayAnswer)),
			action: action
		});
		return rowParams;
	}

	/**
	 * Returns the action link for the question
	 * @param {string | null} answer
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {{ href: string; text: string; visuallyHiddenText: string; }}
	 */
	getAction(sectionSegment, journey, answer) {
		const isAnswerProvided = answer !== null && answer !== undefined && answer !== '';

		const action = {
			href: journey.getCurrentQuestionUrl(sectionSegment, this.fieldName),
			text: isAnswerProvided ? 'Change' : 'Answer',
			visuallyHiddenText: this.question
		};
		return action;
	}

	/**
	 * @param {unknown} answer
	 * @returns {unknown}
	 */
	format(answer) {
		return answer;
	}

	NOT_STARTED = 'Not started';

	/**
	 * @returns {boolean}
	 */
	isRequired() {
		return this.validators?.some(
			(item) =>
				item instanceof RequiredValidator ||
				item instanceof RequiredFileUploadValidator ||
				item instanceof MultiFieldInputValidator ||
				item instanceof AddressValidator
		);
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean}
	 */
	isAnswered(journeyResponse) {
		return !!journeyResponse.answers[this.fieldName];
	}

	/**
	 *
	 * @param {Journey} journey
	 * @param {Section} section
	 * @returns {boolean}
	 */
	isFirstQuestion(journey, section) {
		const currentQuestion = journey.getCurrentQuestionUrl(section.segment, this.fieldName);
		const firstQuestionUrl = journey.sections[0].questions[0].url;
		return currentQuestion.includes(firstQuestionUrl);
	}

	/**
	 * @returns {string} url if set otherwise defaults to fieldname
	 */
	getUrlSlug() {
		return this.url ?? this.fieldName;
	}
}

module.exports = Question;
