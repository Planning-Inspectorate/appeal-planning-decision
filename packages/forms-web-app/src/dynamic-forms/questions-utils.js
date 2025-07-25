const { add, sub, format: formatDate } = require('date-fns');

/**
 * @param {'past' | 'future'} tense
 * @param {number} days
 * @return {string} returns date string in d M yyyy format
 */
exports.getExampleDate = (tense, days = 60) =>
	formatDate(
		{
			past: sub,
			future: add
		}[tense](new Date(), { days }),
		'd M yyyy'
	);
