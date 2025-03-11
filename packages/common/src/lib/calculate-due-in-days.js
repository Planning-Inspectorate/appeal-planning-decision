const { differenceInCalendarDays } = require('date-fns');

/**
 * @param {Date} dateDue
 * @returns {number}
 */
exports.calculateDueInDays = (dateDue) => {
	return differenceInCalendarDays(new Date(dateDue), new Date());
};
