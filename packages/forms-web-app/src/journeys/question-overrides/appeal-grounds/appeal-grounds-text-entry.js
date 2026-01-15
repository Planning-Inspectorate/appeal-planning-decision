/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/question-props').OptionWithoutDivider} OptionWithoutDivider
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/text-entry/question')} TextEntryQuestion
 * @typedef {import('@pins/dynamic-forms/src/question').QuestionViewModel} QuestionViewModel
 * @typedef {QuestionViewModel & { question: QuestionViewModel['question'] & { label?: string, textEntryCheckbox?: TextEntryCheckbox } }} TextEntryViewModel
 */

/**
 * @typedef {Object} TextEntryCheckbox
 * @property {string} header
 * @property {string} text
 * @property {string} name
 * @property {string} [errorMessage]
 */

/**
 * gets the view model for this question
 * @this {TextEntryQuestion}
 * @param {Object} options - the current section
 * @param {Section} options.section - the current section
 * @param {Journey} options.journey - the journey we are in
 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
 * @param {Record<string, unknown>} [options.payload]
 * @param {string} [options.sessionBackLink]
 * @returns {QuestionViewModel}
 */
function prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
	const groundName = this.customData?.groundName;

	const appealGroundFieldName = this.fieldName.split('-')[0];

	const submissionAppealGrounds = journey.response.answers['SubmissionAppealGround'] || [];

	if (!Array.isArray(submissionAppealGrounds))
		throw new Error('Existing grounds data was an unexpected shape');

	const relevantSubmittedGround = submissionAppealGrounds.find(
		(ground) => ground.groundName === groundName
	);

	const answer = relevantSubmittedGround[appealGroundFieldName] || '';
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

	const questionLabel = this.label;
	const questionValue = payload ? payload[this.fieldName] : answer;
	const questionTextEntryCheckbox = this.textEntryCheckbox;

	const viewModel = {
		question: {
			value: questionValue,
			question: this.question,
			fieldName: this.fieldName,
			pageTitle: this.pageTitle,
			description: this.description,
			html: this.html,
			hint: this.hint,
			interfaceType: this.interfaceType,
			label: questionLabel,
			textEntryCheckbox: questionTextEntryCheckbox
		},
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
 * Save the answer to the question
 * @this {TextEntryQuestion}
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {function(string, Object): Promise<any>} saveFunction
 * @param {Journey} journey
 * @param {Section} section
 * @param {JourneyResponse} journeyResponse
 * @returns {Promise<void>}
 */
async function saveAction(req, res, saveFunction, journey, section, journeyResponse) {
	// check for validation errors
	const errorViewModel = this.checkForValidationErrors(req, section, journey);
	if (errorViewModel) {
		return this.renderAction(res, errorViewModel);
	}

	const { referenceId } = journeyResponse;

	const responseToSave = await this.getDataToSave(req, journeyResponse);

	const groundName = this.customData?.groundName;

	if (!groundName) throw new Error('Ground name data missing from question');

	const submissionAppealGrounds = journeyResponse.answers.SubmissionAppealGround || [];

	if (!Array.isArray(submissionAppealGrounds))
		throw new Error('Existing grounds data was an unexpected shape');

	const groundToUpdate = submissionAppealGrounds.find((ground) => ground.groundName === groundName);

	const updatedGround = {
		...groundToUpdate,
		...responseToSave.answers
	};

	await req.appealsApiClient.postSubmissionAppealGround(referenceId, updatedGround);

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

/**
 * @this {TextEntryQuestion}
 * @param {import('express').Request} req
 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
 * @returns {Promise<{ answers: Record<string, unknown> }>}
 */
async function getDataToSave(req, journeyResponse) {
	/**
	 * @type {{ answers: Record<string, unknown> }}
	 */
	let responseToSave = { answers: {} };

	// Variation from standard text-entry question
	// question field name has ground name appended with '-' for navigation
	// this needs to be removed for saving
	const appealGroundFieldName = this.fieldName.split('-')[0];

	const fieldValue = req.body[this.fieldName];

	responseToSave.answers[appealGroundFieldName] = fieldValue;

	for (const propName in req.body) {
		if (propName.startsWith(this.fieldName + '_')) {
			responseToSave.answers[propName] = req.body[propName]?.trim();
			journeyResponse.answers[propName] = req.body[propName]?.trim();
		}
	}

	// update the journeyResponse, required for getting next question url
	const groundName = this.customData?.groundName;
	const existingGrounds = journeyResponse.answers['SubmissionAppealGround'];
	const updatedGrounds = existingGrounds.map((ground) => {
		const newGround = { ...ground };
		if (ground.groundName === groundName) {
			newGround[appealGroundFieldName] = fieldValue;
		}
		return newGround;
	});

	journeyResponse.answers['SubmissionAppealGround'] = updatedGrounds;

	return responseToSave;
}

/**
 * @typedef ConditionalAnswerObject
 * @type {object}
 * @property {string} value the checkbox answer
 * @property {string} conditional the conditional text input
 */

/**
	 * returns the formatted answers values to be used to build task list elements
	 * @this {TextEntryQuestion}
	 * @param {String} sectionSegment
	 * @param {Journey} journey
	 * @param {string | OptionWithoutDivider | ConditionalAnswerObject | null} answer
	//  * @returns {Array<{
	//  *   key: string;
	//  *   value: string | Object;
	//  *   action: {
	//  *     href: string;
	//  *     text: string;
	//  *     visuallyHiddenText: string;
	//  *   };
	//  * }>}
	 */
/* eslint-disable no-unused-vars */
function formatAnswerForSummary(sectionSegment, journey, answer, capitals = true) {
	const groundName = this.customData?.groundName;

	if (!groundName) throw new Error('Ground name data missing from question');

	const submissionAppealGrounds = journey.response.answers.SubmissionAppealGround || [];

	if (!Array.isArray(submissionAppealGrounds))
		throw new Error('Existing grounds data was an unexpected shape');

	const relevantGround = submissionAppealGrounds.find((ground) => ground.groundName === groundName);

	// Variation from standard text-entry question
	// question field name has ground name appended with '-' for navigation
	// this needs to be removed for saving
	const appealGroundFieldName = this.fieldName.split('-')[0];

	const answerForSummary = relevantGround[appealGroundFieldName];

	const formattedAnswerForSummary = answerForSummary ?? this.NOT_STARTED;

	return [
		{
			key: this.question,
			value: formattedAnswerForSummary,
			action: this.getAction(sectionSegment, journey, answerForSummary)
		}
	];
}

/**
 * @this {TextEntryQuestion}
 * @param {JourneyResponse} journeyResponse
 * @returns {boolean}
 */
function isAnswered(journeyResponse) {
	const groundName = this.customData?.groundName;

	if (!groundName) throw new Error('Ground name data missing from question');

	const submissionAppealGrounds = journeyResponse.answers.SubmissionAppealGround || [];

	if (!Array.isArray(submissionAppealGrounds))
		throw new Error('Existing grounds data was an unexpected shape');

	const relevantGround = submissionAppealGrounds.find((ground) => ground.groundName === groundName);

	const appealGroundFieldName = this.fieldName.split('-')[0];

	const answerForSummary = relevantGround[appealGroundFieldName];

	return !!answerForSummary;
}

module.exports = {
	prepQuestionForRendering,
	saveAction,
	formatAnswerForSummary,
	isAnswered,
	getDataToSave
};
