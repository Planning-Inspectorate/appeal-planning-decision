const Question = require('../../question');
const Address = require('@pins/common/src/lib/address');
const { getAddressesForQuestion } = require('../utils/question-utils');
const escape = require('escape-html');
const { nl2br } = require('@pins/common/src/utils');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress

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
	 * @param {string} [params.html]
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 */
	constructor({ title, question, fieldName, viewFolder, validators, url, hint, html }) {
		super({
			title: title,
			viewFolder: viewFolder,
			fieldName: fieldName,
			question: question,
			validators: validators,
			hint: hint,
			html: html
		});

		this.url = url;
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @returns {SubmissionAddress|null}
	 */
	#getExistingAddress(journeyResponse) {
		const addresses = getAddressesForQuestion(journeyResponse, this.fieldName);
		// will only ever have 1
		if (addresses.length) {
			return addresses[0];
		}

		return null;
	}

	/**
	 * @param {Section} section
	 * @param {Journey} journey
	 * @param {Record<string, unknown>} customViewData
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		const address = this.#getExistingAddress(journey.response);

		// will only ever have 1
		if (address) {
			viewModel.question.value = {
				addressLine1: address.addressLine1 || '',
				addressLine2: address.addressLine2 || '',
				townCity: address.townCity || '',
				county: address.county || '',
				postcode: address.postcode || ''
			};
		}

		return viewModel;
	}

	/**
	 * adds a uuid and an address object for save data using req body fields
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<{address:Address, siteAddressSet: boolean, fieldName: string, addressId: string|undefined }>}
	 */
	async getDataToSave(req, journeyResponse) {
		const existingAddressId = this.#getExistingAddress(journeyResponse)?.id;

		const address = new Address({
			addressLine1: req.body[this.fieldName + '_addressLine1'],
			addressLine2: req.body[this.fieldName + '_addressLine2'],
			townCity: req.body[this.fieldName + '_townCity'],
			county: req.body[this.fieldName + '_county'],
			postcode: req.body[this.fieldName + '_postcode']
		});

		return {
			address: address,
			siteAddressSet: true,
			fieldName: this.fieldName,
			addressId: existingAddressId
		};
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
				id: addressId
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

		return addressComponents.filter(Boolean).join('\n');
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array.<Object>}
	 */
	formatAnswerForSummary(sectionSegment, journey) {
		const address = this.#getExistingAddress(journey.response);

		const answer = address ? this.format(address) : '';

		return [
			{
				key: `${this.title}`,
				value: nl2br(escape(answer)) || this.NOT_STARTED,
				action: this.getAction(sectionSegment, journey, answer)
			}
		];
	}
}

module.exports = SiteAddressQuestion;
