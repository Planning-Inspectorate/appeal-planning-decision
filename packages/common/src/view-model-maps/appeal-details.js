// const { formatAddressWithBreaks } = require('../lib/format-address');

/**
 * @param {import("../../../forms-web-app/src/controllers/selected-appeal/appeal-details/rows").Rows} rows
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAppealDetails = (rows, caseData) => {
	// const { appellantFirstName, appellantLastName, LPAApplicationReference } = caseData;

	// const agentRow = formatAgentDetails(caseData);

	// const appellantName = `${appellantFirstName} ${appellantLastName}`;
	// const appellantNameRow = createRow('Named on the application', appellantName);

	// const applicationReferenceRow = createRow('Application reference', LPAApplicationReference);

	// const address = formatAddressWithBreaks(caseData);
	// const siteAddressRow = createRow('Site Address', address);

	// const ownership = formatOwnership(caseData);

	// const agricultural = formatAgriculturalHolding(caseData);

	// const procedurePreference = formatProcedure(caseData);

	// const visibility = formatVisibility(caseData);

	// const safetyIssues = formatHealthAndSafety(caseData);

	// const appealDetails = [
	// 	agentRow,
	// 	appellantNameRow,
	// 	applicationReferenceRow,
	// 	siteAddressRow,
	// 	...ownership,
	// 	...agricultural,
	// 	visibility,
	// 	safetyIssues,
	// 	procedurePreference
	// ];

	// return appealDetails.filter(Boolean);

	const displayRows = rows.filter(({ condition }) => condition(caseData));

	return displayRows.map((row) => createRow(row.keyText, row.valueText));
};

const createRow = (keyText, valueText) => {
	return {
		key: { text: keyText },
		value: { html: valueText }
	};
};

// const formatAgentDetails = (caseData) => {
// 	if (!caseData.yourFirstName) return null;

// 	const agentName = `${caseData.yourFirstName} ${caseData.yourLastName}`;

// 	const agentDetails = caseData.yourCompanyName
// 		? `${agentName}<br>${caseData.yourCompanyName}`
// 		: agentName;

// 	return createRow('Agent name', agentDetails);
// };

// const formatOwnership = (caseData) => {
// 	const displayOptions = ownershipOptions.filter(({ condition }) => condition(caseData));

// 	if (displayOptions.length > 0) {
// 		return displayOptions.map((option) => createRow(option.text, 'Yes'));
// 	}

// 	return [null];
// };

// const formatAgriculturalHolding = (caseData) => {
// 	const displayOptions = agriculturalOptions.filter(({ condition }) => condition(caseData));

// 	if (displayOptions.length > 0) {
// 		return displayOptions.map((option) => createRow(option.text, 'Yes'));
// 	}

// 	return [createRow('Agricultural holding', 'No')];
// };

// const formatVisibility = (caseData) => {
// 	const keyText = 'Visibility';
// 	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

// 	if (caseData.appellantSiteAccessDetails) {
// 		return createRow(keyText, `${visibility}<br>${caseData.appellantSiteAccessDetails}`);
// 	}

// 	return createRow(keyText, visibility);
// };

// const formatHealthAndSafety = (caseData) => {
// 	const keyText = 'Site health and safety issues';
// 	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

// 	if (caseData.appellantSiteAccessDetails) {
// 		return createRow(keyText, `${safetyIssues}<br>${caseData.appellantSiteSafetyDetails}`);
// 	}

// 	return createRow(keyText, safetyIssues);
// };

// const formatProcedure = (caseData) => {
// 	const keyText = 'Preferred procedure';
// 	const possibleProcedures = [
// 		caseData.appellantProcedurePreference,
// 		caseData.appellantPreferHearingDetails,
// 		caseData.appellantPreferInquiryDetails
// 	];

// 	const valueText = possibleProcedures.filter(Boolean).join('<br>');

// 	return valueText ? createRow(keyText, valueText) : null;
// };

// const agriculturalOptions = [
// 	{
// 		text: 'Agricultural holding',
// 		condition: (caseData) => caseData.agriculturalHolding
// 	},
// 	{
// 		text: 'Tenant on agricultural holding',
// 		condition: (caseData) => caseData.tenantAgriculturalHolding
// 	},
// 	{
// 		text: 'Other agricultural holding tenants',
// 		condition: (caseData) => caseData.otherTenantsAgriculturalHolding
// 	},
// 	{
// 		text: 'Informed other agricultural holding tenants',
// 		condition: (caseData) => caseData.informedTenantsAgriculturalHolding
// 	}
// ];

// const ownershipOptions = [
// 	{
// 		text: 'Site fully owned',
// 		condition: (caseData) => caseData.ownsAllLand
// 	},
// 	{
// 		text: 'Site partly owned',
// 		condition: (caseData) => caseData.ownsSomeLand
// 	},
// 	{
// 		text: 'Other owners known',
// 		condition: (caseData) => caseData.knowsOtherOwners
// 	},
// 	{
// 		text: 'Other owners identified',
// 		condition: (caseData) => caseData.identifiedOwners
// 	},
// 	{
// 		text: 'Advertised appeal',
// 		condition: (caseData) => caseData.informedTenantsAgriculturalHolding
// 	},
// 	{
// 		text: 'Other owners informed',
// 		condition: (caseData) => caseData.advertisedAppeal
// 	}
// ];

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
