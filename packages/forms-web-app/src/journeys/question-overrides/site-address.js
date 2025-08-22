/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 * @typedef {import('@pins/dynamic-forms/src/question').QuestionViewModel} QuestionViewModel
 * @typedef {import('@pins/dynamic-forms/src/dynamic-components/site-address/question')} SiteAddressQuestion
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress
 */

/**
 * Save the answer to the question
 * @this {SiteAddressQuestion}
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
		errorViewModel.question = {
			...errorViewModel.question,
			value: {
				addressLine1: req.body[this.fieldName + '_addressLine1'],
				addressLine2: req.body[this.fieldName + '_addressLine2'],
				townCity: req.body[this.fieldName + '_townCity'],
				county: req.body[this.fieldName + '_county'],
				postcode: req.body[this.fieldName + '_postcode']
			}
		};

		return this.renderAction(res, errorViewModel);
	}

	// save
	const { address, siteAddressSet, fieldName, addressId } = await this.getDataToSave(
		req,
		journeyResponse
	);

	await req.appealsApiClient.postSubmissionAddress(
		journeyResponse.journeyId,
		journeyResponse.referenceId,
		{
			...address,
			fieldName,
			// @ts-ignore
			// TODO: check how the API handles getting no id
			id: addressId
		}
	);

	if (siteAddressSet) {
		await saveFunction(journeyResponse.referenceId, {
			siteAddress: siteAddressSet
		});
		journeyResponse.answers.siteAddress = siteAddressSet;
	}

	// check for saving errors
	const saveViewModel = this.checkForSavingErrors(req, section, journey);
	if (saveViewModel) {
		return this.renderAction(res, saveViewModel);
	}

	// move to the next question
	return this.handleNextQuestion(res, journey, section.segment, this.fieldName);
}

module.exports = {
	saveAction
};
