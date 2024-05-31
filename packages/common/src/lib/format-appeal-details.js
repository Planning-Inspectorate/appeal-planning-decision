const escape = require('escape-html');

// NOTE - consider requirement to escape string values from caseData

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatContactDetails = (caseData) => {
	const contactName = `${escape(caseData.contactFirstName)} ${escape(caseData.contactLastName)}`;

	return (
		contactName + (caseData.contactCompanyName ? `\n${escape(caseData.contactCompanyName)}` : '')
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatApplicantDetails = (caseData) => {
	const contactName = `${escape(caseData.appellantFirstName)} ${escape(
		caseData.appellantLastName
	)}`;

	return (
		contactName +
		(caseData.appellantCompanyName ? `\n${escape(caseData.appellantCompanyName)}` : '')
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAccessDetails = (caseData) => {
	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

	return (
		visibility +
		(caseData.appellantSiteAccessDetails ? `\n${escape(caseData.appellantSiteAccessDetails)}` : '')
	);
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatHealthAndSafety = (caseData) => {
	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

	return (
		safetyIssues +
		(caseData.appellantSiteSafetyDetails ? `\n${escape(caseData.appellantSiteSafetyDetails)}` : '')
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

	const valueText = possibleProcedures.filter(Boolean).map(escape).join('\n');

	return valueText;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatLinkedAppeals = (caseData) => {
	if (!caseData.appellantLinkedCase) return 'No';

	const appellantLinkedCases = caseData.SubmissionLinkedCase || [];

	const linkedCasesDisplayDetails = appellantLinkedCases
		.map(formatLinkedAppealHyperlink)
		.join('\n');

	const valueText = `Yes'\n'${linkedCasesDisplayDetails}`;

	return valueText;
};

/**
 * @param {import('appeals-service-api').Api.SubmissionLinkedCase} linkedAppeal
 */
const formatLinkedAppealHyperlink = (linkedAppeal) => {
	return `<a href=# class="govuk-link">${linkedAppeal.caseReference}</a>`;
};
