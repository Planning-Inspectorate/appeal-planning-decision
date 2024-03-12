/**
 * @param {import('./def').Rows} rows
 * @param {import("appeals-service-api").Api.AppealCaseWithAppellant} caseData
 */
exports.formatRows = (rows, caseData) => {
	const displayRows = rows.filter(({ condition }) => condition(caseData));

	return displayRows.map((row) => createRow(row.keyText, row.valueText));
};

/**
 * @param {import('./def').Rows} rows
 * @param {import("appeals-service-api").Api.AppealCaseWithAppellant} questionnaireData
 */
exports.formatQuestionnaireRows = (rows, questionnaireData) => {
	const displayRows = rows.filter(
		({ condition }) =>
			condition(questionnaireData) !== undefined && condition(questionnaireData) !== null
	);

	return displayRows.map((row) => createRow(row.keyText, row.valueText));
};

/**
 * @param { string } keyText
 * @param { string } valueText
 */
const createRow = (keyText, valueText) => {
	return {
		key: { text: keyText },
		value: { html: valueText }
	};
};
