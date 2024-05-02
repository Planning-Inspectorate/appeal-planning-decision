const Question = require('../../question');
const Address = require('@pins/common/src/lib/address');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../section').Section} Section
 */

class SiteAddressQuestion extends Question {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.viewFolder
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 */
	constructor({ title, question, fieldName, viewFolder, validators, url, hint }) {
		super({
			title: title,
			viewFolder: viewFolder,
			fieldName: fieldName,
			question: question,
			validators: validators,
			hint: hint
		});

		this.url = url;
	}

	/**
	 * adds a uuid and an address object for save data using req body fields
	 * @param {import('express').Request} req
	 * @returns
	 */
	async getDataToSave(req) {
		const address = new Address({
			addressLine1: req.body[this.fieldName + '_addressLine1'],
			addressLine2: req.body[this.fieldName + '_addressLine2'],
			townCity: req.body[this.fieldName + '_townCity'],
			county: req.body[this.fieldName + '_county'],
			postcode: req.body[this.fieldName + '_postcode']
		});

		return { address: address, siteAddressSet: true, fieldName: this.fieldName };
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
		const { address, siteAddressSet, fieldName } = await this.getDataToSave(req);
		await req.appealsApiClient.postSubmissionAddress(
			journeyResponse.journeyId,
			journeyResponse.referenceId,
			{
				...address,
				fieldName
			}
		);

		if (siteAddressSet) {
			await req.appealsApiClient.updateAppellantSubmission(journeyResponse.referenceId, {
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
		// @ts-ignore this feels grim
		const updatedJourney = new journey.constructor(journeyResponse);
		return this.handleNextQuestion(res, updatedJourney, section.segment, this.fieldName);
	}

	/**
	 * @param {Object.<Any>} answer
	 * @returns The formatted address to be presented in the UI
	 */
	format(answer) {
		const addressComponents = [
			answer.addressLine1,
			answer.addressLine2,
			answer.townCity,
			answer.county,
			answer.postcode
		];

		return addressComponents.filter(Boolean).join(', ');
	}
}

module.exports = SiteAddressQuestion;
