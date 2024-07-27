/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * @typedef {function(AppealCaseDetailed, AppealCaseDetailed): number} AppealSorter
 */

// /** @type {AppealSorter} */
// const sortByInterestedPartyRepsDueDate = sortByDateFieldDesc('interestedPartyRepsDueDate');

/** @type {AppealSorter} */
const sortByCaseReference = (a, b) => {
	return a.caseReference.localeCompare(b.caseReference, undefined, { numeric: true });
};

/** @type {AppealSorter} */
const sortByCaseDecisionDate = sortByDateFieldDesc('caseDecisionOutcomeDate');

/**
 * @param {string} field
 * @returns {function(any, any): number}
 */
function sortByDateFieldDesc(field) {
	return (a, b) => {
		const aSet = typeof a[field] === 'string';
		const bSet = typeof b[field] === 'string';
		if (aSet && !bSet) {
			return -1;
		}
		if (!aSet && bSet) {
			return 1;
		}
		if (!aSet && !bSet) {
			return 0;
		}
		return new Date(b[field]).getTime() - new Date(a[field]).getTime();
	};
}

module.exports = {
	sortByCaseReference,
	sortByCaseDecisionDate,
	sortByDateFieldDesc
};
