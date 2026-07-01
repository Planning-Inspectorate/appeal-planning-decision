const { subYears } = require('date-fns');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('./dashboard-functions').DashboardDisplayData} DashboardDisplayData
 */

/**
 * @param {DashboardDisplayData|AppealCaseDetailed} appeal
 * @param {string} dateToFilterBy
 * @param {number} timeInMiliseconds
 * @returns {boolean}
 */
exports.filterAppealsWithinGivenDate = (appeal, dateToFilterBy, timeInMiliseconds) => {
	const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
	const appealDate = appeal[dateToFilterBy];

	if (!appealDate) {
		return false;
	}

	const now = new Date();

	const decisionDate = new Date(appealDate);

	const timeLimitDate = subYears(now, timeInMiliseconds / millisecondsPerYear);
	timeLimitDate.setHours(23, 59, 59);

	return decisionDate > timeLimitDate;
};
