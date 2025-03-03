const { differenceInCalendarDays } = require('date-fns');

/**
 *
 * @param {Date} dateInvalidated
 * @returns
 */
const calculateDaysSinceInvalidated = (dateInvalidated) => {
	return differenceInCalendarDays(new Date(), new Date(dateInvalidated));
};

module.exports = { calculateDaysSinceInvalidated };
