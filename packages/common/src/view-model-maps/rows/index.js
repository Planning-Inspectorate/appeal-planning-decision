const escape = require('escape-html');
const { nl2br } = require('../../utils');

/** @typedef {{ key: { text: string }, value: { html: string } }[]} FormattedRow */

/**
 * @param {import('./def').Rows} rows
 * @return {FormattedRow}
 */
exports.formatRows = (rows) => {
	/** @type {FormattedRow} */
	const initialValue = [];
	return rows.reduce((acc, row) => {
		if (!row.shouldDisplay) return acc;
		return [
			...acc,
			{
				key: { text: row.keyText },
				value: { html: nl2br(escape(row.valueText)) }
			}
		];
	}, initialValue);
};
