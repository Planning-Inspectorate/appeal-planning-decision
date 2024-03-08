/**
 * @param {import("../../../forms-web-app/src/controllers/selected-appeal/appeal-details/rows").Rows} rows
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAppealDetails = (rows, caseData) => {
	const displayRows = rows.filter(({ condition }) => condition(caseData));

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

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAgentDetails = (caseData) => {
	const agentName = `${caseData.yourFirstName} ${caseData.yourLastName}`;

	const agentDetails = caseData.yourCompanyName
		? `${agentName}<br>${caseData.yourCompanyName}`
		: agentName;

	return agentDetails;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatVisibility = (caseData) => {
	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

	if (caseData.appellantSiteAccessDetails) {
		return `${visibility}<br>${caseData.appellantSiteAccessDetails}`;
	}

	return visibility;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatHealthAndSafety = (caseData) => {
	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

	if (caseData.appellantSiteAccessDetails) {
		return `${safetyIssues}<br>${caseData.appellantSiteSafetyDetails}`;
	}

	return safetyIssues;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatProcedure = (caseData) => {
	const possibleProcedures = [
		caseData.appellantProcedurePreference,
		caseData.appellantPreferHearingDetails,
		caseData.appellantPreferInquiryDetails
	];

	const valueText = possibleProcedures.filter(Boolean).join('<br>');

	return valueText;
};
