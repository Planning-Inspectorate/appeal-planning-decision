/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/text-entry/question')} TextEntryQuestion
 */

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
	const appealGroundFieldName = this.fieldName.split('-')[0];

	responseToSave.answers[appealGroundFieldName] = req.body[this.fieldName];

	for (const propName in req.body) {
		if (propName.startsWith(this.fieldName + '_')) {
			responseToSave.answers[propName] = req.body[propName]?.trim();
			journeyResponse.answers[propName] = req.body[propName]?.trim();
		}
	}

	journeyResponse.answers[this.fieldName] = responseToSave.answers[appealGroundFieldName];

	return responseToSave;
}

module.exports = { saveAction, getDataToSave };
