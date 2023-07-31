const differenceInCalendarDays = require('date-fns/differenceInCalendarDays');

const calculateDueInDays = (dateDue) => {
	return differenceInCalendarDays(new Date(dateDue), new Date());
};

module.exports = { calculateDueInDays };
