const Question = require('../../question');
const Address = require('../../lib/address');
const { getAddressesForQuestion } = require('../utils/question-utils');
const escape = require('escape-html');
const { nl2br } = require('../../lib/string-functions');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../section').Section} Section
 * @typedef {import('../../question').QuestionViewModel} QuestionViewModel
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress TODO just write this type in here
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
	 *
	 * @param {Record<string, Function>} [methodOverrides]
	 */
	constructor(
		{ title, question, fieldName, viewFolder, validators, url, hint, html },
		methodOverrides
	) {
		super(
			{
				title: title,
				viewFolder: viewFolder,
				fieldName: fieldName,
				question: question,
				validators: validators,
				hint: hint,
				html: html
			},
			methodOverrides
		);

		this.url = url;
		this.methodOverrides = methodOverrides;
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
	 * @param {Object} options
	 * @param {Section} options.section
	 * @param {Journey} options.journey
	 * @param {Record<string, unknown>} [options.customViewData]
	 * @param {string} [options.sessionBackLink]
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering({ section, journey, customViewData, sessionBackLink }) {
		const viewModel = super.prepQuestionForRendering({
			section,
			journey,
			customViewData,
			sessionBackLink
		});

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
		if (this.methodOverrides && this.methodOverrides.createAppealSiteGridReferenceLink) {
			const createAppealSiteGridReferenceLink =
				this.methodOverrides.createAppealSiteGridReferenceLink;
			viewModel.appealSiteGridReferenceLink = createAppealSiteGridReferenceLink(
				this.fieldName,
				journey,
				section
			);
		}

		return viewModel;
	}

	/**
	 * adds a uuid and an address object for save data using req body fields
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<{
	 *   answers: Record<string, unknown>;
	 *   address:Address;
	 *   siteAddressSet: boolean;
	 *   fieldName: string;
	 *   addressId?: string;
	 * }>}
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
			answers: {},
			address: address,
			siteAddressSet: true,
			fieldName: this.fieldName,
			addressId: existingAddressId
		};
	}

	/**
	 * @param {SubmissionAddress} answer
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

		return addressComponents.filter(Boolean).join('\n');
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @type {Question['formatAnswerForSummary']}
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
