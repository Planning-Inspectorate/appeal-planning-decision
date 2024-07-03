const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

/**
 *
 * @param {Date} dateDue
 * @returns
 */
const calculateDueInDays = (dateDue) => {
	return differenceInCalendarDays(new Date(dateDue), new Date());
};

module.exports = { calculateDueInDays };
