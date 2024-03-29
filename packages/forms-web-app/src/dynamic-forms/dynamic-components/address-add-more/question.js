const AddMoreQuestion = require('../add-more/question');
const Address = require('@pins/common/src/lib/address');

const uuid = require('uuid');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 */

class AddressAddMoreQuestion extends AddMoreQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.viewFolder
	 * @param {Array.<BaseValidator>} [params.validators]
	 */
	constructor({ title, question, fieldName, viewFolder, validators }) {
		super({
			title: title,
			viewFolder: viewFolder,
			fieldName: fieldName,
			question: question,
			validators: validators
		});
	}

	/**
	 * adds a uuid and an address object for save data using req body fields
	 * @param {ExpressRequest} req
	 * @returns
	 */
	async getDataToSave(req) {
		const address = new Address({
			addressLine1: req.body[this.fieldName + '_addressLine1'],
			addressLine2: req.body[this.fieldName + '_addressLine2'],
			townCity: req.body[this.fieldName + '_townCity'],
			postcode: req.body[this.fieldName + '_postcode']
		});

		return { addMoreId: uuid.v4(), value: address };
	}

	/**
	 *
	 * @param {Object.<Any>} answer
	 * @returns The formatted address to be presented in the UI
	 */
	format(answer) {
		const addressComponents = [
			answer.addressLine1,
			answer.addressLine2,
			answer.townCity,
			answer.postcode
		];

		return addressComponents.filter(Boolean).join(', ');
	}
}

module.exports = AddressAddMoreQuestion;
