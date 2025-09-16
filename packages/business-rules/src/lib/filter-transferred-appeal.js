const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @returns {boolean}
 */
const isNotTransferred = (appeal) => {
	return !(appeal.caseTransferredDate && appeal.caseStatus === APPEAL_CASE_STATUS.TRANSFERRED);
};

module.exports = { isNotTransferred };
