/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @param {AppealCaseWithAppellant[]} appeals
 * @returns {AppealCaseWithAppellant[]}
 */
const getOpenAppeals = (appeals) => {
	const currentDate = new Date();
	// only include appeals with interestedPartyRepsDueDate set.
	return appeals.filter(
		(appeal) =>
			appeal.interestedPartyRepsDueDate && new Date(appeal.interestedPartyRepsDueDate) > currentDate
	);
};

/**
 * @param {AppealCaseWithAppellant[]} appeals
 * @returns {AppealCaseWithAppellant[]}
 */
const getClosedAppeals = (appeals) => {
	const currentDate = new Date();
	// include appeals with interestedPartyRepsDueDate not set.
	return appeals.filter(
		(appeal) =>
			!appeal.interestedPartyRepsDueDate ||
			new Date(appeal.interestedPartyRepsDueDate) < currentDate
	);
};

/**
 * @typedef {function(AppealCaseWithAppellant, AppealCaseWithAppellant): number} AppealSorter
 */

/** @type {AppealSorter} */
const sortByInterestedPartyRepsDueDate = sortByDateFieldDesc('interestedPartyRepsDueDate');

/** @type {AppealSorter} */
const sortByCaseReference = (a, b) => {
	return a.caseReference.localeCompare(b.caseReference, undefined, { numeric: true });
};

/** @type {AppealSorter} */
const sortByCaseDecisionDate = sortByDateFieldDesc('caseDecisionDate');

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
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference,
	sortByCaseDecisionDate,
	sortByDateFieldDesc
};
