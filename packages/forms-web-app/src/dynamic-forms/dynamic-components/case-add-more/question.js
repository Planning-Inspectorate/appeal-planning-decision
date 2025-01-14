const AddMoreQuestion = require('../add-more/question');
const { getLinkedCasesForQuestion } = require('../utils/question-utils');
const { randomUUID } = require('crypto');
const logger = require('../../../lib/logger');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 * @typedef {Awaited<ReturnType<import('../list-add-more/question')['getDataToSave']>>} GetDataToSaveReturnType
 */

class CaseAddMoreQuestion extends AddMoreQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} params.viewFolder
	 * @param {string} [params.hint]
	 * @param {string} [params.html]
	 * @param {Array.<import('../../validator/base-validator')>} [params.validators]
	 */
	constructor({ title, question, fieldName, viewFolder, hint, html, validators }) {
		super({
			title,
			viewFolder,
			fieldName,
			question,
			hint,
			html,
			validators
		});
	}

	/**
	 * adds a uuid to the data to save
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} _
	 * @returns {Promise<{ answers: Record<string, unknown> } & { addMoreId: string; value: string }>}
	 */
	async getDataToSave(req, _) {
		return { answers: {}, addMoreId: randomUUID(), value: req.body[this.fieldName]?.trim() };
	}

	/**
	 * @param {{ caseReference: string }} answer
	 * @returns {string}
	 */
	format(answer) {
		return answer?.caseReference;
	}

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} fieldName
	 */
	getAddMoreAnswers(journeyResponse, fieldName) {
		return getLinkedCasesForQuestion(journeyResponse, fieldName);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {string} parentFieldName
	 * @param {JourneyResponse} journeyResponse
	 * @param {GetDataToSaveReturnType} responseToSave
	 */
	async saveList(req, parentFieldName, journeyResponse, responseToSave) {
		const linkedCases = responseToSave.answers[parentFieldName];
		if (!Array.isArray(linkedCases)) throw new Error('Answer was an unexpected shape');

		try {
			await Promise.all(
				linkedCases.map((linkedCase) => {
					linkedCase.fieldName = this.fieldName;
					return req.appealsApiClient.postSubmissionLinkedCase(
						journeyResponse.journeyId,
						journeyResponse.referenceId,
						{
							fieldName: this.fieldName,
							caseReference: linkedCase.value
						}
					);
				})
			);
		} catch (err) {
			logger.error({ err }, 'failed to save linked case');
		}
	}

	/**
	 * removes answer with answerId from response if present
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} answerId
	 * @returns {Promise<JourneyResponse | boolean> } updated JourneyResponse
	 */
	async removeList(req, journeyResponse, answerId) {
		const updated = await req.appealsApiClient.deleteSubmissionLinkedCase(
			journeyResponse.journeyId,
			journeyResponse.referenceId,
			answerId
		);

		journeyResponse.answers = { ...updated };

		return (updated.SubmissionLinkedCase?.length || 0) > 0 ? journeyResponse : true;
	}
}

module.exports = CaseAddMoreQuestion;
