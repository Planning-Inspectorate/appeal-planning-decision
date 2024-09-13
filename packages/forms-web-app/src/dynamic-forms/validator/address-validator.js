const { body } = require('express-validator');
const {
	validation: {
		characterLimits: {
			questionnaire: {
				addressLine1MaxLength: addressLine1MaxLength,
				addressLine1MinLength: addressLine1MinLength,
				addressLine2MaxLength: addressLine2MaxLength,
				addressLine2MinLength: addressLine2MinLength,
				townCityMaxLength: townCityMaxLength,
				townCityMinLength: townCityMinLength,
				countyMaxLength: countyMaxLength,
				countyMinLength: countyMinLength,
				postcodeMaxLength: postcodeMaxLength,
				postcodeMinLength: postcodeMinLength
			}
		}
	}
} = require('../../config');
// todo(journey-refactor): config
const validatePostcode = require('../../lib/valid-postcode');

const BaseValidator = require('./base-validator.js');

/**
 * enforces address fields are within allowed parameters
 * @class
 */
class AddressValidator extends BaseValidator {
	/**
	 * creates an instance of an AddressValidator
	 */
	constructor() {
		super();
	}

	/**
	 * validates response body using questionObj fieldname
	 * @param {Question} questionObj
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
			.isLength({ min: addressLine1MinLength, max: addressLine1MaxLength })
			.bail()
			.withMessage(`The address line must be ${addressLine1MaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for addressLine2
	 * @param {string} fieldName
	 */
	#addressLine2Rule(fieldName) {
		return body(fieldName + '_addressLine2')
			.isLength({ min: addressLine2MinLength, max: addressLine2MaxLength })
			.bail()
			.withMessage(`The address line must be ${addressLine2MaxLength} characters or fewer`);
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
			.isLength({ min: townCityMinLength, max: townCityMaxLength })
			.bail()
			.withMessage(`Town or city must be ${townCityMaxLength} characters or fewer`);
	}

	/**
	 * a validation chain for county
	 * @param {string} fieldName
	 */
	#countyRule(fieldName) {
		return body(fieldName + '_county')
			.isLength({ min: countyMinLength, max: countyMaxLength })
			.bail()
			.withMessage(`The county must be ${countyMaxLength} characters or fewer`);
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
			.isLength({ min: postcodeMinLength, max: postcodeMaxLength })
			.bail()
			.withMessage('Enter a full UK postcode')
			.if(body(fieldName + '_postcode').notEmpty())
			.custom((postcode) => validatePostcode(postcode));
	}
}

module.exports = AddressValidator;
