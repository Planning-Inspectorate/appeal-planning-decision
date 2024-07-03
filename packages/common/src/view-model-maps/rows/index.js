const escape = require('escape-html');
const { nl2br } = require('../../utils');

/**
 * @param {import('./def').Rows} rows
 * @param {import("appeals-service-api").Api.AppealCaseDetailed} caseData
 */
exports.formatRows = (rows, caseData) => {
	const displayRows = rows.filter(({ condition }) => condition(caseData));

	return displayRows.map((row) => createRow(row.keyText, row.valueText, row.isEscaped));
};

/**
 * @param {import('./def').Rows} rows
 * @param {import("appeals-service-api").Api.AppealCaseDetailed} questionnaireData
 */
exports.formatQuestionnaireRows = (rows, questionnaireData) => {
	const displayRows = rows.filter(({ condition }) => condition(questionnaireData));

	return displayRows.map((row) => createRow(row.keyText, row.valueText, row.isEscaped));
};

/**
 * @param { string } keyText
 * @param { string } valueText
 * @param { boolean | undefined } isEscaped
 */
const createRow = (keyText, valueText, isEscaped) => {
	valueText = valueText ?? '';
	return {
		key: { text: keyText },
		value: { html: isEscaped ? nl2br(valueText) : nl2br(escape(valueText)) }
	};
};
