/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant} appeal
 * @returns {boolean}
 */
const isNotWithdrawn = (appeal) => {
	return !(appeal.appealWithdrawnDate && appeal.appealStatus === 'withdrawn');
};

module.exports = { isNotWithdrawn };
