const Question = require('../../question');
const escape = require('escape-html');
const { nl2br } = require('../../lib/string-functions');
const MultiFieldInputValidator = require('../../validator/multi-field-input-validator.js');

/**
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../validator/base-validator')} BaseValidator
 */

/**
 * @typedef {Object} InputField
 * @property {string} fieldName
 * @property {string} label
 * @property {string} [hint]
 * @property {string} [classes]
 * @property {string} [formatJoinString] optional property, used by formatAnswerForSummary (eg task list display), effective default to line break
 * @property {Record<string, string>} [attributes] optional property, used to add html attributes to the field
 */

/**
 * @class
 */
class MultiFieldInputQuestion extends Question {
	/** @type {Record<string, string>} */
	inputAttributes;

	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.description]
	 * @param {string} [params.url]
	 * @param {string} [params.html]
	 * @param {string} [params.hint]
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Array.<BaseValidator>} [params.validators]
	 * @param {Record<string, string>} [params.inputAttributes] html attributes to add to the input
	 * @param {InputField[]} [params.inputFields] input fields
	 * @param {'gridReference' | 'standard' | null} [params.formatType] optional type field used for formatting for task list
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(params, methodOverrides) {
		if (!params.inputAttributes) {
			params.inputAttributes = {};
		}

		super({
			...params,
			viewFolder: 'multi-field-input'
		});
		this.label = params.label;
		this.inputAttributes = params.inputAttributes;
		this.formatType = params.formatType;
		this.methodOverrides = methodOverrides;

		if (params.inputFields) {
			this.inputFields = params.inputFields;
		} else {
			throw new Error('inputFields are mandatory');
		}
	}

	/**
	 * gets the view model for this question
	 * @param {Object} options - the current section
	 * @param {Section} options.section - the current section
	 * @param {Journey} options.journey - the journey we are in
	 * @param {string} [options.sessionBackLink]
	 * @param {Record<string, unknown>} [options.customViewData] additional data to send to view
	 * @param {Record<string, unknown>} [options.payload]
	 * @returns {QuestionViewModel & {
	 *   question: QuestionViewModel['question'] & {
	 *     inputFields: Array<InputField & { value: string | unknown }>;
	 * 		 label?: string;
	 *     attributes?: Record<string, string>;
	 *   }
	 * }}
	 */
	prepQuestionForRendering({ section, journey, customViewData, payload, sessionBackLink }) {
		const viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			sessionBackLink
		});

		const inputFields = this.inputFields.map((inputField) => {
			return payload
				? { ...inputField, value: payload[inputField.fieldName] }
				: { ...inputField, value: journey.response.answers[inputField.fieldName] };
		});

		if (this.methodOverrides && this.methodOverrides.createAppealSiteGridReferenceLink) {
			const createAppealSiteGridReferenceLink =
				this.methodOverrides.createAppealSiteGridReferenceLink;
			viewModel.appealSiteGridReferenceLink = createAppealSiteGridReferenceLink(
				this.fieldName,
				journey,
				section
			);
		}

		return {
			...viewModel,
			question: {
				...viewModel.question,
				inputFields,
				label: this.label,
				attributes: this.inputAttributes
			}
		};
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/**
		 * @type {{ answers: Record<string, unknown> }}
		 */
		let responseToSave = { answers: {} };

		for (const inputField of this.inputFields) {
			responseToSave.answers[inputField.fieldName] = req.body[inputField.fieldName]?.trim();
			journeyResponse.answers[inputField.fieldName] = responseToSave.answers[inputField.fieldName];
		}

		return responseToSave;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @type {Question['formatAnswerForSummary']}
	 */
	formatAnswerForSummary(sectionSegment, journey) {
		const summaryDetails = this.inputFields.reduce((acc, field) => {
			const answer = journey.response.answers[field.fieldName];
			return answer ? acc + answer + (field.formatJoinString || '\n') : acc;
		}, '');

		const formattedAnswer =
			this.formatType === 'gridReference'
				? this.formatGridReference(journey, this.inputFields)
				: summaryDetails || this.NOT_STARTED;

		return [
			{
				key: `${this.title}`,
				value: nl2br(escape(formattedAnswer)),
				action: this.getAction(sectionSegment, journey, summaryDetails)
			}
		];
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {InputField[]} inputFields
	 * @returns {String}
	 */
	formatGridReference(journey, inputFields) {
		const eastingField =
			inputFields.find((inputField) => inputField.fieldName.includes('siteGridReferenceEasting'))
				?.fieldName || '';
		const northingField =
			inputFields.find((inputField) => inputField.fieldName.includes('siteGridReferenceNorthing'))
				?.fieldName || '';

		if (!journey.response.answers[eastingField] && !journey.response.answers[northingField])
			return this.NOT_STARTED;

		return `Eastings: ${journey.response.answers[eastingField]}\nNorthings: ${journey.response.answers[northingField]}`;
	}

	/**
	 *
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean }
	 */
	isAnswered(journeyResponse) {
		const requiredAnswers =
			this.validators
				.find((v) => v instanceof MultiFieldInputValidator)
				?.requiredFields?.map((f) => journeyResponse.answers[f.fieldName]) ?? [];

		return requiredAnswers?.every(
			(answer) => answer !== undefined && answer !== null && answer.trim() !== ''
		);
	}
}

module.exports = MultiFieldInputQuestion;
