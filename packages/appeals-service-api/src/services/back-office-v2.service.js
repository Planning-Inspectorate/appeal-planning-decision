const { getAppeal } = require('./appeal.service');
const { HasAppealMapper } = require('../mappers/appeal-submission/has-mapper');
const hasAppealMapper = new HasAppealMapper();
const { broadcast } = require('../data-producers/lpa-response-producer');
const { isFeatureActive } = require('../../src/configuration/featureFlag');

class BackOfficev2Service {
	constructor() {}

	async submitAppeal(appeal_id) {
		const appealToProcess = await getAppeal(appeal_id);
		const isBOIntegrationActive = await isFeatureActive(
			'appeals-bo-submission',
			appealToProcess.LPACode
		);
		if (isBOIntegrationActive && appealToProcess.appealType === '1001') {
			const mappedData = hasAppealMapper.mapToPINSDataModel(appealToProcess);
			return await broadcast(mappedData);
		}
		return;
	}
}

module.exports = BackOfficev2Service;
