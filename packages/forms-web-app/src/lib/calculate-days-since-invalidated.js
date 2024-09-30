const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

/**
 *
 * @param {Date} dateInvalidated
 * @returns
 */
const calculateDaysSinceInvalidated = (dateInvalidated) => {
	return differenceInCalendarDays(new Date(), new Date(dateInvalidated));
};

module.exports = { calculateDaysSinceInvalidated };
