const {
	sortByDateFieldDesc,
	sortByCaseDecisionDate,
	sortByCaseReference
} = require('@pins/common/src/lib/appeal-sorting');

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

module.exports = {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference,
	sortByCaseDecisionDate
};
