const { calculateDueInDays } = require('./calculate-due-in-days');

/**
 *
 * @param {String | undefined} dueDate
 * @returns {boolean}
 */
exports.deadlineHasPassed = (dueDate) => {
	if (!dueDate) {
		return false;
	}
	return calculateDueInDays(new Date(dueDate)) < 0;
};
