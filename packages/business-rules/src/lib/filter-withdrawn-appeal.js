/**
 * todo: use const from data model repo once published
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @returns {boolean}
 */
const isNotWithdrawn = (appeal) => {
	return !(appeal.caseWithdrawnDate && appeal.caseStatus === 'withdrawn');
};

module.exports = { isNotWithdrawn };
