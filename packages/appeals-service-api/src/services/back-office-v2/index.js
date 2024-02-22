const { getAppeal } = require('../appeal.service');
const { broadcast } = require('../../data-producers/appeal-producer');
const { isFeatureActive } = require('../../configuration/featureFlag');
const formatters = require('./formatters');

class BackOfficeV2Service {
	constructor() {}

	/**
	 * @param {string} appealId
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppeal(appealId) {
		const appeal = await getAppeal(appealId);

		if (!appeal) throw new Error(`Appeal ${appealId} not found`);

		const isBOIntegrationActive = await isFeatureActive('appeals-bo-submission', appeal.lpaCode);
		if (!isBOIntegrationActive) return;

		if (!appeal.appealType)
			throw new Error(`Appeal type could not be determined on appeal ${appealId}`);

		return await broadcast(formatters.appeal[appeal.appealType](appeal));
	}

	/**
	 * @param {*} questionnaireResponse
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitQuestionnaire(questionnaireResponse) {
		const isBOIntegrationActive = await isFeatureActive(
			'appeals-bo-submission',
			questionnaireResponse.LPACode
		);
		if (!isBOIntegrationActive) return;

		// Need to find a way to get that 1001 programmatically
		return await broadcast(formatters.questionnaire[1001](questionnaireResponse));
	}
}

module.exports = BackOfficeV2Service;
