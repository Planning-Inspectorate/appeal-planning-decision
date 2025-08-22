/**
 * @typedef {Object} MonthMap
 * @property {'jan'|'january'|'feb'|'february'|'mar'|'march'|'apr'|'april'|'may'|'jun'|'june'|'jul'|'july'|'aug'|'august'|'sep'|'september'|'oct'|'october'|'nov'|'november'|'dec'|'december'} key
 * @property {'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'} value
 */

/**
 * A mapping of month names and abbreviations (in lowercase) to their corresponding month numbers as strings.
 * @type {Record<string, string>}
 * @see {MonthMap}
 */
const monthMap = {
	jan: '1',
	january: '1',
	feb: '2',
	february: '2',
	mar: '3',
	march: '3',
	apr: '4',
	april: '4',
	may: '5',
	jun: '6',
	june: '6',
	jul: '7',
	july: '7',
	aug: '8',
	august: '8',
	sep: '9',
	september: '9',
	oct: '10',
	october: '10',
	nov: '11',
	november: '11',
	dec: '12',
	december: '12'
};

module.exports = monthMap;
