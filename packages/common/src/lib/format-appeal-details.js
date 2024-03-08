/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAgentDetails = (caseData) => {
	const agentName = `${caseData.yourFirstName} ${caseData.yourLastName}`;

	return agentName + (caseData.yourCompanyName && `<br>${caseData.yourCompanyName}`);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatVisibility = (caseData) => {
	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

	return (
		visibility +
		(caseData.appellantSiteAccessDetails && `<br>${caseData.appellantSiteAccessDetails}`)
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatHealthAndSafety = (caseData) => {
	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

	return (
		safetyIssues +
		(caseData.appellantSiteSafetyDetails && `<br>${caseData.appellantSiteSafetyDetails}`)
	);
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
