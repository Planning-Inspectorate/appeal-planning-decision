/**
 * @typedef {Object} WithMsg
 * @property {string} msg
 */

/**
 * @typedef {Object} ErrorSummaryEntry
 * @property {string} text
 * @property {string} href
 */

/**
 * Map keyed errors to an array compatible with govuk error summary.
 *
 * @param {string | Object<string, WithMsg> | ErrorSummaryEntry | ErrorSummaryEntry[]} errors - A dictionary of errors.
 * @returns {ErrorSummaryEntry[]} – The error summary errors.
 */
function mapToErrorSummary(errors) {
	if (typeof errors === 'string') {
		return [
			{
				text: errors,
				href: '#'
			}
		];
	}
	if (Array.isArray(errors)) {
		return errors;
	}
	if (isErrorSummaryEntry(errors)) {
		return [errors];
	}
	return Object.entries(errors).map(([k, v]) => {
		return {
			text: msgToString(v) || '',
			href: `#${k}`
		};
	});
}

/**
 * @param {ErrorSummaryEntry|any} obj
 * @returns {obj is ErrorSummaryEntry}
 */
function isErrorSummaryEntry(obj) {
	return Object.hasOwn(obj, 'href') && Object.hasOwn(obj, 'text');
}

/**
 * @param {string|WithMsg} err
 * @returns {string}
 */
function msgToString(err) {
	if (typeof err == 'string') {
		return err;
	}
	return err.msg;
}

module.exports = {
	mapToErrorSummary
};
