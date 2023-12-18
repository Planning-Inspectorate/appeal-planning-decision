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
	const d = new Date();
	d.setFullYear(year, month, day);
	d.setHours(9, 0, 0, 0);
	d.setMinutes(0);
	return d;
}

module.exports = {
	now,
	/**
	 * Generate some dates in the previous month
	 *
	 * @returns {Date[]}
	 */
	datesNMonthsAgo(n) {
		const month = now.getMonth() - n;
		return days.map((day) => dateFromYMD(year, month, day));
	},
	/**
	 * Generate some dates in the next month
	 *
	 * @returns {Date[]}
	 */
	datesNMonthsAhead(n) {
		const month = now.getMonth() + n; // next month
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
