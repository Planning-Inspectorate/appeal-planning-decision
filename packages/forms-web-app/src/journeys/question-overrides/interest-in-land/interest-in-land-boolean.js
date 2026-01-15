/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/question-props').OptionWithoutDivider} OptionWithoutDivider
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} BooleanQuestion
 * @typedef {import('@pins/dynamic-forms/src/options-question').OptionsViewModel} OptionsViewModel
 * @typedef {OptionsViewModel & { question: OptionsViewModel['question'] & { label?: string, legend?: string } }} RadioViewModel
 */

const { boolToYesNo } = require('@pins/common');
const {
	optionIsDivider
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-utils');

/**
 * gets the view model for this question
 * @this {BooleanQuestion}
 * @param {Object} options - the current section
 * @param {Section} options.section - the current section
 * @param {Journey} options.journey - the journey we are in
 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
 * @param {Record<string, unknown>} [options.payload]
 * @param {string} [options.sessionBackLink]
 * @returns {RadioViewModel}
 */
function prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
	const individualId = this.customData?.individualId;

	if (!individualId) throw new Error('individual Id data missing from question');

	const submissionIndividuals = journey.response.answers.SubmissionIndividual || [];

	if (!Array.isArray(submissionIndividuals))
		throw new Error('Submission individuals data was an unexpected shape');

	const relevantIndividual = submissionIndividuals.find(
		(individual) => individual.id === individualId
	);

	const interestFieldName = this.fieldName.split('-')[0];

	const answer = boolToYesNo(relevantIndividual[interestFieldName]).toLowerCase() || '';

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

	const questionValue = payload ? payload[this.fieldName] : answer;

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
			label: this.label,
			legend: this.legend,
			options: []
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

	for (const option of this.options) {
		const optionData = { ...option };

		// Skip if the option is a divider
		if (optionIsDivider(optionData)) {
			viewModel.question.options.push(optionData);
			continue;
		}

		if (optionData.value !== undefined) {
			optionData.checked = (',' + answer + ',').includes(',' + optionData.value + ',');
			if (!optionData.attributes) {
				optionData.attributes = { 'data-cy': 'answer-' + optionData.value };
			}
		}

		viewModel.question.options.push(optionData);
	}

	return viewModel;
}

/**
 * Save the answer to the question
 * @this {BooleanQuestion}
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

	const individualId = this.customData?.individualId;

	if (!individualId) throw new Error('individual Id data missing from question');

	const submissionIndividuals = journeyResponse.answers.SubmissionIndividual || [];

	if (!Array.isArray(submissionIndividuals))
		throw new Error('Submission individuals data was an unexpected shape');

	const individualToUpdate = submissionIndividuals.find(
		(individual) => individual.id === individualId
	);

	const updatedIndividual = {
		...individualToUpdate,
		...responseToSave.answers
	};

	await req.appealsApiClient.postSubmissionIndividual(referenceId, updatedIndividual);

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

/**
 * @this {BooleanQuestion}
 * @param {import('express').Request} req
 * @param {JourneyResponse} journeyResponse
 * @returns {Promise<{ answers: Record<string, unknown> }>}
 */
async function getDataToSave(req, journeyResponse) {
	/** @type {{ answers: Record<string, unknown> }} */
	let responseToSave = { answers: {} };
	const fieldValue = req.body[this.fieldName]?.trim();

	// Variation from standard boolean question
	// question field name has individual id appended with '-' for navigation
	// this needs to be removed for saving
	const interestFieldName = this.fieldName.split('-')[0];

	if (fieldValue === 'yes') {
		responseToSave.answers[interestFieldName] = true;
	} else {
		responseToSave.answers[interestFieldName] = false;
	}

	for (const propName in req.body) {
		if (propName.startsWith(this.fieldName + '_')) {
			responseToSave.answers[propName] = req.body[propName]?.trim();
			journeyResponse.answers[propName] = req.body[propName]?.trim();
		}
	}

	// update the journeyResponse, required for getting next question url
	const individualId = this.customData?.individualId;
	const existingIndividuals = journeyResponse.answers['SubmissionIndividual'];
	const updatedIndividuals = existingIndividuals.map((individual) => {
		const newIndividual = { ...individual };
		if (individual.id === individualId) {
			newIndividual[interestFieldName] = responseToSave.answers[interestFieldName];
		}
		return newIndividual;
	});

	journeyResponse.answers['SubmissionIndividual'] = updatedIndividuals;

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
	 * @this {BooleanQuestion}
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
	const individualId = this.customData?.individualId;

	if (!individualId) throw new Error('individual Id data missing from question');

	const submissionIndividuals = journey.response.answers.SubmissionIndividual || [];

	if (!Array.isArray(submissionIndividuals))
		throw new Error('Submission individuals data was an unexpected shape');

	const relevantIndividual = submissionIndividuals.find(
		(individual) => individual.id === individualId
	);

	// Variation from standard boolean question
	// question field name has individual id appended with '-' for navigation
	// this needs to be removed for saving
	const interestFieldName = this.fieldName.split('-')[0];

	const individualAnswer = relevantIndividual[interestFieldName];

	const formattedAnswerForSummary =
		individualAnswer != null ? boolToYesNo(individualAnswer) : this.NOT_STARTED;

	return [
		{
			key: this.question,
			value: formattedAnswerForSummary,
			action: this.getAction(sectionSegment, journey, individualAnswer)
		}
	];
}

/**
 * @this {BooleanQuestion}
 * @param {JourneyResponse} journeyResponse
 * @returns {boolean}
 */
function isAnswered(journeyResponse) {
	const individualId = this.customData?.individualId;

	if (!individualId) throw new Error('individual Id data missing from question');

	const submissionIndividuals = journeyResponse.answers.SubmissionIndividual || [];

	if (!Array.isArray(submissionIndividuals))
		throw new Error('Submission individuals data was an unexpected shape');

	const relevantIndividual = submissionIndividuals.find(
		(individual) => individual.id === individualId
	);

	// Variation from standard boolean question
	// question field name has individual id appended with '-' for navigation
	// this needs to be removed for saving
	const interestFieldName = this.fieldName.split('-')[0];

	const individualAnswer = relevantIndividual[interestFieldName];

	return individualAnswer != null;
}

module.exports = {
	prepQuestionForRendering,
	saveAction,
	formatAnswerForSummary,
	isAnswered,
	getDataToSave
};
