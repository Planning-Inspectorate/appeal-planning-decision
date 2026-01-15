const {
	getConditionalFieldName,
	optionIsDivider,
	conditionalIsJustHTML
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-utils');
const escape = require('escape-html');
const { nl2br } = require('@pins/dynamic-forms/src/lib/string-functions');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/question-props').OptionWithoutDivider} OptionWithoutDivider
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} RadioQuestion
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} BooleanQuestion
 */

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

	journeyResponse.answers['SubmissionIndividual'] = submissionIndividuals.map((individual) => {
		return individual.id === individualId ? { ...updatedIndividual } : { ...individual };
	});

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

/**
 * returns the data to send to the DB
 * side effect: modifies journeyResponse with the new answers
 * @this {RadioQuestion}
 * @param {import('express').Request} req
 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
 * @returns {Promise<{ answers: Record<string, unknown> }>}
 */
async function getDataToSave(req, journeyResponse) {
	/**
	 * @type {{ answers: Record<string, unknown> }}
	 */
	let responseToSave = { answers: {} };

	/** @type {string[]} */
	const fields = Array.isArray(req.body[this.fieldName])
		? req.body[this.fieldName]
		: [req.body[this.fieldName]];
	const fieldValues = fields.map((x) => x.trim());

	/** @type {OptionWithoutDivider[]} */
	// @ts-ignore
	const selectedOptions = this.options.filter((option) => {
		return !optionIsDivider(option) && fieldValues.includes(option.value);
	});

	if (!selectedOptions.length)
		throw new Error(
			`User submitted option(s) did not correlate with valid answers to ${this.fieldName} question`
		);

	// Variation from standard boolean question
	// question field name has individual id appended with '-' for navigation
	// this needs to be removed for saving
	const interestFieldName = this.fieldName.split('-')[0];

	responseToSave.answers[interestFieldName] = fieldValues.join(this.optionJoinString);
	journeyResponse.answers[interestFieldName] = fieldValues.join(this.optionJoinString);

	this.options.forEach((option) => {
		if (optionIsDivider(option)) return;
		if (!option.conditional || conditionalIsJustHTML(option.conditional)) return;
		const key = getConditionalFieldName(this.fieldName, option.conditional.fieldName);
		const optionIsSelectedOption = selectedOptions.some(
			(selectedOption) =>
				option.text === selectedOption.text && option.value === selectedOption.value
		);

		const value = optionIsSelectedOption ? req.body[key]?.trim() : null;

		const answerKey = getConditionalFieldName(interestFieldName, option.conditional.fieldName);

		responseToSave.answers[answerKey] = value;
		journeyResponse.answers[answerKey] = value;
	});

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

	if (!individualAnswer) {
		return [
			{
				key: this.question,
				value: this.NOT_STARTED,
				action: this.getAction(sectionSegment, journey, individualAnswer)
			}
		];
	}

	const formattedAnswer = this.options
		.filter((option) => !optionIsDivider(option) && option.value === individualAnswer)
		.map(
			// @ts-ignore
			(/** @type {import('src/dynamic-forms/question-props').OptionWithoutDivider} */ option) => {
				if (option.conditional) {
					if (conditionalIsJustHTML(option.conditional)) return '';
					const conditionalAnswer =
						relevantIndividual[
							getConditionalFieldName(interestFieldName, option.conditional.fieldName)
						];
					return [option.text, conditionalAnswer].join('\n');
				}
				return option.text;
			}
		)
		.join('\n');

	return [
		{
			key: this.question,
			value: nl2br(escape(formattedAnswer)),
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

	return !!individualAnswer;
}

module.exports = { saveAction, formatAnswerForSummary, isAnswered, getDataToSave };
