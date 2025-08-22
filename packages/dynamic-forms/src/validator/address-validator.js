const { body } = require('express-validator');
const validatePostcode = require('../lib/valid-postcode');

const BaseValidator = require('./base-validator.js');

/**
 * enforces address fields are within allowed parameters
 * @class
 */
class AddressValidator extends BaseValidator {
	/**
	 * creates an instance of an AddressValidator
	 * @param {Object} params
	 * @param {number|undefined} params.addressLine1MaxLength
	 * @param {number|undefined} params.addressLine1MinLength
	 * @param {number|undefined} params.addressLine2MaxLength
	 * @param {number|undefined} params.addressLine2MinLength
	 * @param {number|undefined} params.townCityMaxLength
	 * @param {number|undefined} params.townCityMinLength
	 * @param {number|undefined} params.countyMaxLength
	 * @param {number|undefined} params.countyMinLength
	 * @param {number|undefined} params.postcodeMaxLength
	 * @param {number|undefined} params.postcodeMinLength
	 * @constructor
	 */
	constructor({
		addressLine1MaxLength,
		addressLine1MinLength,
		addressLine2MaxLength,
		addressLine2MinLength,
		townCityMaxLength,
		townCityMinLength,
		countyMaxLength,
		countyMinLength,
		postcodeMaxLength,
		postcodeMinLength
	}) {
		super();

		this.addressLine1MaxLength = addressLine1MaxLength;
		this.addressLine1MinLength = addressLine1MinLength;
		this.addressLine2MaxLength = addressLine2MaxLength;
		this.addressLine2MinLength = addressLine2MinLength;
		this.townCityMaxLength = townCityMaxLength;
		this.townCityMinLength = townCityMinLength;
		this.countyMaxLength = countyMaxLength;
		this.countyMinLength = countyMinLength;
		this.postcodeMaxLength = postcodeMaxLength;
		this.postcodeMinLength = postcodeMinLength;
	}

	/**
	 * validates response body using questionObj fieldname
	 * @param {import('../question')} questionObj
	 */
	validate(questionObj) {
		const fieldName = questionObj.fieldName;

		return [
			this.#addressLine1Rule(fieldName),
			this.#addressLine2Rule(fieldName),
			this.#townCityRule(fieldName),
			this.#countyRule(fieldName),
			this.#postCodeRule(fieldName)
		];
	}

	/**
	 * a validation chain for addressLine1
	 * @param {string} fieldName
	 */
	#addressLine1Rule(fieldName) {
		return body(fieldName + '_addressLine1')
			.notEmpty()
			.bail()
			.withMessage('Enter address line 1')
			.isLength({ min: this.addressLine1MinLength, max: this.addressLine1MaxLength })
			.bail()
			.withMessage(`The address line must be ${this.addressLine1MaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for addressLine2
	 * @param {string} fieldName
	 */
	#addressLine2Rule(fieldName) {
		return body(fieldName + '_addressLine2')
			.isLength({ min: this.addressLine2MinLength, max: this.addressLine2MaxLength })
			.bail()
			.withMessage(`The address line must be ${this.addressLine2MaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for townCity
	 * @param {string} fieldName
	 */
	#townCityRule(fieldName) {
		return body(fieldName + '_townCity')
			.notEmpty()
			.bail()
			.withMessage('Enter town or city')
			.isLength({ min: this.townCityMinLength, max: this.townCityMaxLength })
			.bail()
			.withMessage(`Town or city must be ${this.townCityMaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for county
	 * @param {string} fieldName
	 */
	#countyRule(fieldName) {
		return body(fieldName + '_county')
			.isLength({ min: this.countyMinLength, max: this.countyMaxLength })
			.bail()
			.withMessage(`The county must be ${this.countyMaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for postcode
	 * @param {string} fieldName
	 */
	#postCodeRule(fieldName) {
		return body(fieldName + '_postcode')
			.notEmpty()
			.bail()
			.withMessage('Enter postcode')
			.isLength({ min: this.postcodeMinLength, max: this.postcodeMaxLength })
			.bail()
			.withMessage('Enter a full UK postcode')
			.if(body(fieldName + '_postcode').notEmpty())
			.custom((postcode) => validatePostcode(postcode));
	}
}

module.exports = AddressValidator;
