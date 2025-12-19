/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
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

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

module.exports = { saveAction };
