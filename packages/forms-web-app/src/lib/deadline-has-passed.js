const { calculateDueInDays } = require('./calculate-due-in-days');

/**
 *
 * @param {String | undefined} dueDate
 * @returns {boolean}
 */
const deadlineHasPassed = (dueDate) => {
	if (!dueDate) {
		return false;
	}
	return calculateDueInDays(new Date(dueDate)) < 0;
};

module.exports = {
	deadlineHasPassed
};
