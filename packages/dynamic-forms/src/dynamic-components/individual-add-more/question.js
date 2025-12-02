const AddMoreQuestion = require('../add-more/question');
const Individual = require('../../lib/individual');
const { getIndividualsForQuestion } = require('../utils/question-utils');
const { randomUUID } = require('crypto');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Awaited<ReturnType<import('../list-add-more/question')['getDataToSave']>>} GetDataToSaveReturnType
 */

class IndividualAddMoreQuestion extends AddMoreQuestion {
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
	 * @returns {Promise<{ answers: Record<string, unknown> } & { addMoreId: string; value: Individual }>}
	 */
	async getDataToSave(req) {
		const individual = new Individual({
			firstName: req.body['firstName'],
			lastName: req.body['lastName']
		});

		return { answers: {}, addMoreId: randomUUID(), value: individual };
	}

	/**
	 * @param {Individual} answer
	 * @returns {string}
	 */
	format(answer) {
		const nameComponents = [answer.firstName, answer.lastName];

		return nameComponents.filter(Boolean).join(' ');
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} fieldName
	 */
	getAddMoreAnswers(journeyResponse, fieldName) {
		return getIndividualsForQuestion(journeyResponse, fieldName);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {string} parentFieldName
	 * @param {JourneyResponse} journeyResponse
	 * @param {GetDataToSaveReturnType} responseToSave
	 */
	async saveList(req, parentFieldName, journeyResponse, responseToSave) {
		const names = responseToSave.answers[parentFieldName];
		if (!Array.isArray(names)) throw new Error('Answer was an unexpected shape');
		await Promise.all(
			names.map((name) => {
				const nameData = name.value;
				nameData.fieldName = this.fieldName;
				return req.appealsApiClient.postSubmissionIndividual(journeyResponse.referenceId, nameData);
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
		const updated = await req.appealsApiClient.deleteSubmissionIndividual(
			journeyResponse.referenceId,
			answerId
		);
		journeyResponse.answers = { ...updated };
		return (updated.SubmissionIndividual?.length || 0) > 0 ? journeyResponse : true;
	}
}

module.exports = IndividualAddMoreQuestion;
