/**
 * @param {import('./dashboard-functions').DashboardDisplayData} appeal
 * @param {string} dateToFilterBy
 * @param {number} timeInMiliseconds
 * @returns {boolean}
 */
exports.filterAppealsWithinGivenDate = (appeal, dateToFilterBy, timeInMiliseconds) => {
	const appealDate = appeal[dateToFilterBy];

	if (!appealDate) {
		return false;
	}

	const now = new Date().getTime();
	const decisionDate = new Date(appealDate).getTime();

	return decisionDate > now - timeInMiliseconds;
};
