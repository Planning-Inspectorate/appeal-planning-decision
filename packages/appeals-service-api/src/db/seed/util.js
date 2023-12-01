const now = new Date();
const year = now.getFullYear();
const days = Array.from({ length: 28 }, (_, i) => i + 1);

/**
 * @param {number} year
 * @param {number} month 0-11
 * @param {number} day 1-28
 * @returns {Date}
 */
function dateFromYMD(year, month, day) {
	const yearStr = year.toString();
	month++; // one-index
	// wrap around
	if (month < 1) {
		month += 12;
	} else if (month > 12) {
		month -= 12;
	}
	const monthStr = month.toString().padStart(2, '0');
	const dayStr = day.toString().padStart(2, '0');
	return new Date(`${yearStr}-${monthStr}-${dayStr}T09:00:00Z`);
}

module.exports = {
	now,
	/**
	 * Generate some dates in the previous month
	 *
	 * @returns {Date[]}
	 */
	datesLastMonth() {
		const month = now.getMonth() - 1;
		return days.map((day) => dateFromYMD(year, month, day));
	},
	/**
	 * Generate some dates in the next month
	 *
	 * @returns {Date[]}
	 */
	datesNextMonth() {
		const month = now.getMonth() + 1; // next month
		return days.map((day) => dateFromYMD(year, month, day));
	},
	/**
	 *
	 * @param {T[]} list
	 * @returns {T}
	 * @template T
	 */
	pickRandom(list) {
		return list[Math.floor(Math.random() * list.length)];
	},
	/**
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	pseudoRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
	}
};
