/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/question-props').OptionWithoutDivider} OptionWithoutDivider
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} RadioQuestion
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} BooleanQuestion
 */

const { boolToYesNo } = require('@pins/common');

/**
 * Save the answer to the question
 * @this {BooleanQuestion | RadioQuestion}
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
	 * @this {BooleanQuestion | RadioQuestion}
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
 * @this {BooleanQuestion | RadioQuestion}
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

module.exports = { saveAction, formatAnswerForSummary, isAnswered, getDataToSave };
