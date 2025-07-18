const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @returns {boolean}
 */
const isNotWithdrawn = (appeal) => {
	return !(appeal.caseWithdrawnDate && appeal.caseStatus === APPEAL_CASE_STATUS.WITHDRAWN);
};

module.exports = { isNotWithdrawn };
