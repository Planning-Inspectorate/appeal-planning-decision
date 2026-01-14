/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/checkbox/question')} CheckboxQuestion
 */

/**
 * Save the answer to the question
 * @this {CheckboxQuestion}
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

	// returns a string of grounds selected on the page, with a comma between each
	const responseToSave = await this.getDataToSave(req, journeyResponse);

	const selectedAppealGroundsArray = responseToSave.answers[this.fieldName]?.split(',') || [];

	//retrieve a list of previously submitted grounds, if any
	const previouslySubmittedGrounds = journeyResponse.answers.SubmissionAppealGround || [];
	if (!Array.isArray(previouslySubmittedGrounds))
		throw new Error('Existing grounds data was an unexpected shape');

	// split previously submitted grounds into those to keep and those to delete
	const { previousGroundsToKeep, previousGroundsToDelete } = previouslySubmittedGrounds.reduce(
		(acc, cur) => {
			if (selectedAppealGroundsArray.includes(cur.groundName)) {
				acc.previousGroundsToKeep.push(cur);
			} else {
				acc.previousGroundsToDelete.push(cur);
			}
			return acc;
		},
		{ previousGroundsToKeep: [], previousGroundsToDelete: [] }
	);

	// delete any previously added grounds which are no longer selected
	if (previousGroundsToDelete.length > 0) {
		await Promise.all(
			previousGroundsToDelete.map((ground) => {
				return req.appealsApiClient.deleteSubmissionAppealGround(referenceId, ground.id);
			})
		);
	}

	// check whether any new grounds have been added
	const newGrounds =
		previousGroundsToKeep.length > 0
			? selectedAppealGroundsArray.filter(
					(selectedGround) =>
						!previousGroundsToKeep.some(
							(previousGround) => previousGround.groundName === selectedGround
						)
				)
			: selectedAppealGroundsArray;

	// update journeyResponse with grounds to keep
	journeyResponse.answers['SubmissionAppealGround'] = [...previousGroundsToKeep];

	// create a SubmissionAppealGround entry for any new grounds
	if (newGrounds.length > 0) {
		await Promise.all(
			newGrounds.map((groundName) => {
				const data = { groundName };
				// add new grounds to journeyResponse
				journeyResponse.answers['SubmissionAppealGround'].push(data);
				return req.appealsApiClient.postSubmissionAppealGround(referenceId, data);
			})
		);
	}

	await saveFunction(journeyResponse.referenceId, responseToSave.answers);

	// check for saving validation errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

module.exports = { saveAction };
