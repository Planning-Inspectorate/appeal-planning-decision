/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAgentDetails = (caseData) => {
	const agentName = `${caseData.yourFirstName} ${caseData.yourLastName}`;

	return agentName + (caseData.yourCompanyName ? `\n${caseData.yourCompanyName}` : '');
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatVisibility = (caseData) => {
	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

	return (
		visibility +
		(caseData.appellantSiteAccessDetails ? `\n${caseData.appellantSiteAccessDetails}` : '')
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatHealthAndSafety = (caseData) => {
	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

	return (
		safetyIssues +
		(caseData.appellantSiteSafetyDetails ? `\n${caseData.appellantSiteSafetyDetails}` : '')
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatProcedure = (caseData) => {
	const possibleProcedures = [
		caseData.appellantProcedurePreference ?? '',
		caseData.appellantPreferHearingDetails ?? '',
		caseData.appellantPreferInquiryDetails ?? ''
	];

	const valueText = possibleProcedures.filter(Boolean).join('\n');

	return valueText;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatLinkedAppeals = (caseData) => {
	if (!caseData.appellantLinkedCase) return 'No';

	const appellantLinkedCases = caseData.SubmissionLinkedCase || [];

	const linkedCasesDisplayDetails = appellantLinkedCases
		.map((linkedCase) => linkedCase.caseReference)
		.join('\n');

	const valueText = `Yes'\n'${linkedCasesDisplayDetails}`;

	return valueText;
};
