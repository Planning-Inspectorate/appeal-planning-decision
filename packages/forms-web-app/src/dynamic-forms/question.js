const { capitalize } = require('../lib/string-functions');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { numericFields } = require('./dynamic-components/utils/numeric-fields');
const escape = require('escape-html');
const { nl2br } = require('@pins/common/src/utils');
const RequiredValidator = require('./validator/required-validator');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');

/**
 * @typedef {import('./validator/base-validator')} BaseValidator
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./section').Section} Section
 */

/**
 * @typedef {Object} PreppedQuestion
 * @property {Object} value
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
 * @property {string} listLink
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
	/** @type {boolean} if the question should appear in the journey overview task list or not */
	taskList;
	/** @type {Array.<BaseValidator>} array of validators that a question uses to validate answers */
	validators = [];
	/** @type {string|undefined} hint text displayed to user */
	hint;
	/** @type {boolean} show return to listing page link after question */
	showBackToListLink = true;
	/** @type {string|undefined} alternative url slug */
	url;
	/** @type {string|undefined} optional html content */
	html;
	/** @type {string|undefined} optional question type */
	interfaceType;
	/** @type {(response: JourneyResponse) => boolean} */
	shouldDisplay = () => true;

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
	 * @param {string} [params.hint]
	 * @param {string} [params.interfaceType]
	 * @param {(response: JourneyResponse) => boolean} [params.shouldDisplay]
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
			shouldDisplay
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

		if (shouldDisplay) {
			this.shouldDisplay = shouldDisplay;
		}

		if (Array.isArray(validators)) {
			this.validators = validators;
		}

		Object.entries(methodOverrides || {}).forEach(([methodName, methodOverride]) => {
			// @ts-ignore
			this[methodName] = methodOverride.bind(this);
		});

		//todo: taskList default to true, or pass in as param if question shouldn't be displayed in task (summary) list
		//or possibly add taskList condition to the Section class as part of withCondition method(or similar) if possible?
	}

	/**
	 * gets the view model for this question
	 * @param {Section} section - the current section
	 * @param {Journey} journey - the journey we are in
	 * @param {Record<string, unknown>} [customViewData] additional data to send to view
	 * @param {unknown} [payload]
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		const answer = journey.response.answers[this.fieldName] || '';
		const backLink = journey.getNextQuestionUrl(section.segment, this.fieldName, true);

		const viewModel = {
			question: {
				value: answer,
				question: this.question,
				fieldName: this.fieldName,
				pageTitle: this.pageTitle,
				description: this.description,
				html: this.html,
				hint: this.hint,
				interfaceType: this.interfaceType
			},
			answer,

			layoutTemplate: journey.journeyTemplate,
			pageCaption: section?.name,

			navigation: ['', backLink],
			backLink,
			showBackToListLink: this.showBackToListLink,
			listLink: journey.taskListUrl,
			journeyTitle: journey.journeyTitle,
			payload,

			...customViewData
		};

		return viewModel;
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
	 * @param {Journey} journey
	 * @param {Section} section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<void>}
	 */
	async saveAction(req, res, journey, section, journeyResponse) {
		// check for validation errors
		const errorViewModel = this.checkForValidationErrors(req, section, journey);
		if (errorViewModel) {
			return this.renderAction(res, errorViewModel);
		}

		// save
		const responseToSave = await this.getDataToSave(req, journeyResponse);
		await this.saveResponseToDB(req.appealsApiClient, journey.response, responseToSave);

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
		const { errors = {}, errorSummary = [] } = body;

		if (Object.keys(errors).length > 0) {
			return this.prepQuestionForRendering(
				sectionObj,
				journey,
				{
					errors,
					errorSummary
				},
				body
			);
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
	 * @param {import('@pins/common/src/client/appeals-api-client').AppealsApiClient} apiClient
	 * @param {JourneyResponse} journeyResponse
	 * @param {{ answers: Record<string, unknown> }} responseToSave
	 */
	async saveResponseToDB(apiClient, journeyResponse, responseToSave) {
		const journeyType = journeyResponse.journeyId;

		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyType)) {
			await apiClient.patchLPAQuestionnaire(journeyResponse.referenceId, responseToSave.answers);
		} else if (
			[JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyType)
		) {
			await apiClient.updateAppellantSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		} else if ([JOURNEY_TYPES.S78_LPA_STATEMENT].includes(journeyType)) {
			await apiClient.patchLPAStatement(journeyResponse.referenceId, responseToSave.answers);
		} else if ([JOURNEY_TYPES.S78_APPELLANT_FINAL_COMMENTS].includes(journeyType)) {
			await apiClient.patchAppellantFinalCommentSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		} else if ([JOURNEY_TYPES.S78_LPA_FINAL_COMMENTS].includes(journeyType)) {
			await apiClient.patchLPAFinalCommentSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		} else if ([JOURNEY_TYPES.S78_APPELLANT_PROOF_EVIDENCE].includes(journeyType)) {
			await apiClient.patchAppellantProofOfEvidenceSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		} else if ([JOURNEY_TYPES.S78_LPA_PROOF_EVIDENCE].includes(journeyType)) {
			await apiClient.patchLpaProofOfEvidenceSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		} else if ([JOURNEY_TYPES.S78_RULE_6_PROOF_EVIDENCE].includes(journeyType)) {
			await apiClient.patchRule6ProofOfEvidenceSubmission(
				journeyResponse.referenceId,
				responseToSave.answers
			);
		}
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
		return res.redirect(journey.getNextQuestionUrl(sectionSegment, questionSegment, false));
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Object} answer
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
		const formattedAnswer = capitals
			? capitalize(answer ?? this.NOT_STARTED)
			: answer ?? this.NOT_STARTED;
		const action = this.getAction(sectionSegment, journey, answer);
		const key = this.title ?? this.question;
		let rowParams = [];
		rowParams.push({
			key: key,
			value: nl2br(escape(formattedAnswer)),
			action: action
		});
		return rowParams;
	}

	/**
	 * Returns the action link for the question
	 * @param {Object} answer
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
			(item) => item instanceof RequiredValidator || item instanceof RequiredFileUploadValidator
		);
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean}
	 */
	isAnswered(journeyResponse) {
		return !!journeyResponse.answers[this.fieldName];
	}
}

module.exports = Question;
