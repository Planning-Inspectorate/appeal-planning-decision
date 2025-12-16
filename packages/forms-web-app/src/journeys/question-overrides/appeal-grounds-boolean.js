/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/boolean/question')} BooleanQuestion
 */

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

	const groundName = this.fieldName.split('-').pop();

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
	const appealGroundFieldName = this.fieldName.split('-')[0];

	if (fieldValue === 'yes') {
		responseToSave.answers[appealGroundFieldName] = true;
	} else {
		responseToSave.answers[appealGroundFieldName] = false;
	}

	for (const propName in req.body) {
		if (propName.startsWith(this.fieldName + '_')) {
			responseToSave.answers[propName] = req.body[propName]?.trim();
			journeyResponse.answers[propName] = req.body[propName]?.trim();
		}
	}

	journeyResponse.answers[this.fieldName] = fieldValue;

	return responseToSave;
}

module.exports = { saveAction, getDataToSave };
