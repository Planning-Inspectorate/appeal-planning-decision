const { body } = require('express-validator');
const { startOfDay, endOfDay, isBefore, isAfter, isValid, parse } = require('date-fns');
const { enGB } = require('date-fns/locale');

const BaseValidator = require('./base-validator.js');
const { dateInputsToDate } = require('../dynamic-components/utils/date-inputs-to-date.js');

/**
 * @typedef {import('../dynamic-components/date/question.js')} DateQuestion
 */

/**
 * @typedef {Object} DateValidationSettings
 * @param {Boolean} ensureFuture
 * @param {Boolean} ensurePast
 */

/**
 * enforces a user has entered a valid date
 * @class
 */
class DateValidator extends BaseValidator {
	/** @type {DateValidationSettings} */
	dateValidationSettings;

	/**
	 * creates an instance of a DateValidator
	 * @param {string} inputLabel - string representing the field as displayed on the UI as part of an error message
	 * @param {DateValidationSettings} [dateValidationSettings] - object containing rules to apply
	 * @param {Object} [errorMessages] - object containing custom error messages to show on validation failure
	 */
	constructor(
		inputLabel,
		dateValidationSettings = {
			ensureFuture: false,
			ensurePast: false
		},
		errorMessages
	) {
		super();

		const defaultErrorMessages = this.#getDefaultErrorMessages(inputLabel);

		this.emptyErrorMessage =
			errorMessages?.emptyErrorMessage ?? defaultErrorMessages.emptyErrorMessage;
		this.noDayErrorMessage =
			errorMessages?.noDayErrorMessage ?? defaultErrorMessages.noDayErrorMessage;
		this.noMonthErrorMessage =
			errorMessages?.noMonthErrorMessage ?? defaultErrorMessages.noMonthErrorMessage;
		this.noYearErrorMessage =
			errorMessages?.noYearErrorMessage ?? defaultErrorMessages.noYearErrorMessage;
		this.noDayMonthErrorMessage =
			errorMessages?.noDayMonthErrorMessage ?? defaultErrorMessages.noDayMonthErrorMessage;
		this.noDayYearErrorMessage =
			errorMessages?.noDayYearErrorMessage ?? defaultErrorMessages.noDayYearErrorMessage;
		this.noMonthYearErrorMessage =
			errorMessages?.noMonthYearErrorMessage ?? defaultErrorMessages.noMonthYearErrorMessage;
		this.invalidDateErrorMessage =
			errorMessages?.invalidDateErrorMessage ?? defaultErrorMessages.invalidDateErrorMessage;
		this.invalidMonthErrorMessage =
			errorMessages?.invalidMonthErrorMessage ?? defaultErrorMessages.invalidMonthErrorMessage;
		this.invalidYearErrorMessage =
			errorMessages?.invalidYearErrorMessage ?? defaultErrorMessages.invalidYearErrorMessage;
		this.futureDateErrorMessage =
			errorMessages?.futureDateErrorMessage ?? defaultErrorMessages.futureDateErrorMessage;
		this.pastDateErrorMessage =
			errorMessages?.pastDateErrorMessage ?? defaultErrorMessages.pastDateErrorMessage;

		this.dateValidationSettings = dateValidationSettings;
	}

	/**
	 * validates the response body, checking the values sent for the date are valid
	 * @param {DateQuestion} questionObj
	 */
	validate(questionObj) {
		const fieldName = questionObj.fieldName;
		const dayInput = `${fieldName}_day`;
		const monthInput = `${fieldName}_month`;
		const yearInput = `${fieldName}_year`;

		const rules = [
			// check all or some date inputs are not empty
			body(dayInput)
				.notEmpty()
				.withMessage((_, { req }) => {
					if (!req.body[monthInput] && !req.body[yearInput]) {
						return this.emptyErrorMessage;
					}

					if (!req.body[monthInput] && req.body[yearInput]) {
						return this.noDayMonthErrorMessage;
					}

					if (req.body[monthInput] && !req.body[yearInput]) {
						return this.noDayYearErrorMessage;
					}

					return this.noDayErrorMessage;
				}),
			body(monthInput)
				.notEmpty()
				.withMessage((_, { req }) => {
					if (req.body[dayInput] && !req.body[yearInput]) {
						return this.noMonthYearErrorMessage;
					}
					if (req.body[dayInput]) {
						return this.noMonthErrorMessage;
					}
					// todo: empty error message bug
				}),
			body(yearInput)
				.notEmpty()
				.withMessage((_, { req }) => {
					if (req.body[dayInput] && req.body[monthInput]) return this.noYearErrorMessage;
					// todo: empty error message bug
				}),

			// check date values entered are within valid ranges
			body(dayInput)
				.isInt({ min: 1, max: 31 })
				.withMessage(this.invalidDateErrorMessage)
				.bail()
				.toInt()
				.custom((value, { req }) => {
					const year = req.body[yearInput];
					const month = req.body[monthInput];

					if (
						this.#isValidWrapper(year) &&
						this.#isValidWrapper(year, month) &&
						!this.#isValidWrapper(year, month, value)
					) {
						throw new Error(this.invalidDateErrorMessage);
					}

					return true;
				}),
			body(monthInput).isInt({ min: 1, max: 12 }).withMessage(this.invalidMonthErrorMessage),
			body(yearInput).isInt({ min: 1000, max: 9999 }).withMessage(this.invalidYearErrorMessage)
		];

		if (this.dateValidationSettings.ensurePast === true) {
			rules.push(
				body(dayInput).custom((value, { req }) => {
					const inputDate = dateInputsToDate(value, req.body[monthInput], req.body[yearInput]);
					const today = endOfDay(new Date());

					if (isAfter(inputDate, today)) {
						throw new Error(this.futureDateErrorMessage);
					}

					return true;
				})
			);
		}

		if (this.dateValidationSettings.ensureFuture === true) {
			rules.push(
				body(dayInput).custom((value, { req }) => {
					const inputDate = dateInputsToDate(value, req.body[monthInput], req.body[yearInput]);
					const today = startOfDay(new Date());

					if (isBefore(inputDate, today)) {
						throw new Error(this.pastDateErrorMessage);
					}

					return true;
				})
			);
		}

		return rules;
	}

	/**
	 * generates default error messages based on GDS guidelines
	 * @param {string} inputLabel
	 */
	#getDefaultErrorMessages(inputLabel) {
		const capitalisedInputLabel = inputLabel.charAt(0).toUpperCase() + inputLabel.slice(1);

		return {
			emptyErrorMessage: `Enter ${inputLabel}`,
			noDayErrorMessage: `${capitalisedInputLabel} must include a day`,
			noMonthErrorMessage: `${capitalisedInputLabel} must include a month`,
			noYearErrorMessage: `${capitalisedInputLabel} must include a year`,
			noDayMonthErrorMessage: `${capitalisedInputLabel} must include a day and month`,
			noDayYearErrorMessage: `${capitalisedInputLabel} must include a day and year`,
			noMonthYearErrorMessage: `${capitalisedInputLabel} must include a month and year`,
			invalidDateErrorMessage: `${capitalisedInputLabel} must be a real date`,
			invalidMonthErrorMessage: `${capitalisedInputLabel} month must be a real month`,
			invalidYearErrorMessage: `${capitalisedInputLabel} year must include 4 numbers`,
			futureDateErrorMessage: `${capitalisedInputLabel} must be today or in the past`,
			pastDateErrorMessage: `${capitalisedInputLabel} must be today or in the future`
		};
	}

	#isValidWrapper(year = 2000, month = 1, day = 1) {
		const parsedDate = parse(`${day}/${month}/${year}`, 'P', new Date(), { locale: enGB });
		return isValid(parsedDate);
	}
}

module.exports = DateValidator;
