const {
	sortByDateFieldDesc,
	sortByCaseDecisionDate,
	sortByCaseReference
} = require('@pins/common/src/lib/appeal-sorting');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * @param {AppealCaseDetailed[]} appeals
 * @returns {AppealCaseDetailed[]}
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
 * @param {AppealCaseDetailed[]} appeals
 * @returns {AppealCaseDetailed[]}
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
 * @typedef {function(AppealCaseDetailed, AppealCaseDetailed): number} AppealSorter
 */

/** @type {AppealSorter} */
const sortByInterestedPartyRepsDueDate = sortByDateFieldDesc('interestedPartyRepsDueDate');

module.exports = {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference,
	sortByCaseDecisionDate
};
