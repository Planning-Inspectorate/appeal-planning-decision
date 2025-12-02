const AddMoreQuestion = require('../add-more/question');
const Address = require('../../lib/address');
const { getAddressesForQuestion } = require('../utils/question-utils');
const { randomUUID } = require('crypto');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Awaited<ReturnType<import('../list-add-more/question')['getDataToSave']>>} GetDataToSaveReturnType
 */

class AddressAddMoreQuestion extends AddMoreQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.viewFolder
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 *
	 * @param {JourneyResponse} [response]
	 */
	constructor({ title, question, fieldName, viewFolder, validators }, response) {
		super(
			{
				title: title,
				viewFolder: viewFolder,
				fieldName: fieldName,
				question: question,
				validators: validators
			},
			response
		);
	}

	/**
	 * adds a uuid and an address object for save data using req body fields
	 * @param {import('express').Request} req
	 * @returns {Promise<{ answers: Record<string, unknown> } & { addMoreId: string; value: Address }>}
	 */
	async getDataToSave(req) {
		const address = new Address({
			addressLine1: req.body[this.fieldName + '_addressLine1'],
			addressLine2: req.body[this.fieldName + '_addressLine2'],
			townCity: req.body[this.fieldName + '_townCity'],
			county: req.body[this.fieldName + '_county'],
			postcode: req.body[this.fieldName + '_postcode']
		});

		return { answers: {}, addMoreId: randomUUID(), value: address };
	}

	/**
	 * @param {Address} answer
	 * @returns {string}
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

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} fieldName
	 */
	getAddMoreAnswers(journeyResponse, fieldName) {
		return getAddressesForQuestion(journeyResponse, fieldName);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {string} parentFieldName
	 * @param {JourneyResponse} journeyResponse
	 * @param {GetDataToSaveReturnType} responseToSave
	 */
	async saveList(req, parentFieldName, journeyResponse, responseToSave) {
		const addresses = responseToSave.answers[parentFieldName];
		if (!Array.isArray(addresses)) throw new Error('Answer was an unexpected shape');
		await Promise.all(
			addresses.map((address) => {
				const addressData = address.value;
				addressData.fieldName = this.fieldName;
				return req.appealsApiClient.postSubmissionAddress(
					journeyResponse.journeyId,
					journeyResponse.referenceId,
					addressData
				);
			})
		);
	}

	/**
	 * removes answer with answerId from response if present
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} answerId
	 * @returns {Promise<JourneyResponse | boolean> } updated JourneyResponse
	 */
	async removeList(req, journeyResponse, answerId) {
		const updatedLPA = await req.appealsApiClient.deleteSubmissionAddress(
			journeyResponse.journeyId,
			journeyResponse.referenceId,
			answerId
		);
		journeyResponse.answers = { ...updatedLPA };
		return (updatedLPA.SubmissionAddress?.length || 0) > 0 ? journeyResponse : true;
	}
}

module.exports = AddressAddMoreQuestion;
