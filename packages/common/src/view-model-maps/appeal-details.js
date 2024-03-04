const { formatAddressWithBreaks } = require('../lib/format-address');

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAppealDetails = (caseData) => {
	const { appellantFirstName, appellantLastName, LPAApplicationReference } = caseData;

	const agentRow = formatAgentDetails(caseData);

	const appellantName = `${appellantFirstName} ${appellantLastName}`;
	const appellantNameRow = createRow('Named on the application', appellantName);

	const applicationReferenceRow = createRow('Application reference', LPAApplicationReference);

	const address = formatAddressWithBreaks(caseData);
	const siteAddressRow = createRow('SiteAddress', address);

	const ownership = formatOwnership(caseData);

	const agricultural = formatAgriculturalHolding(caseData);

	const procedurePreference = formatProcedure(caseData);

	const visibility = formatVisibility(caseData);

	const safetyIssues = formatHealthAndSafety(caseData);

	const appealDetails = [
		agentRow,
		appellantNameRow,
		applicationReferenceRow,
		siteAddressRow,
		ownership,
		agricultural,
		visibility,
		safetyIssues,
		procedurePreference
	];

	return appealDetails.filter(Boolean);
};

const createRow = (keyText, valueText) => {
	return {
		key: { text: keyText },
		value: { html: valueText }
	};
};

const formatAgentDetails = (caseData) => {
	if (!caseData.yourFirstName) return null;

	const agentName = `${caseData.yourFirstName} ${caseData.yourLastName}`;

	const agentDetails = caseData.yourCompanyName
		? `${agentName}<br>${caseData.yourCompanyName}`
		: agentName;

	return createRow('Agent name', agentDetails);
};

const formatOwnership = (caseData) => {
	if (caseData.ownsAllLand) {
		return createRow('Site fully owned', 'Yes');
	} else if (caseData.ownsSomeLand) {
		return createRow('Site partly owned', 'Yes');
	}

	return null;
};

const formatAgriculturalHolding = (caseData) => {
	if (caseData.agriculturalHolding || caseData.otherTenantsAgriculturalHolding) {
		return createRow('Agricultural holding', 'Yes');
	}

	return createRow('Agricultural holding', 'No');
};

const formatVisibility = (caseData) => {
	const keyText = 'Visibility';
	const visibility = caseData.appellantSiteAccess ? 'Yes' : 'No';

	if (caseData.appellantSiteAccessDetails) {
		return createRow(keyText, `${visibility}<br>${caseData.appellantSiteAccessDetails}`);
	}

	return createRow(keyText, visibility);
};

const formatHealthAndSafety = (caseData) => {
	const keyText = 'Sitehealth and safety issues';
	const safetyIssues = caseData.appellantSiteSafety ? 'Yes' : 'No';

	if (caseData.appellantSiteAccessDetails) {
		return createRow(keyText, `${safetyIssues}<br>${caseData.appellantSiteSafetyDetails}`);
	}

	return createRow(keyText, safetyIssues);
};

const formatProcedure = (caseData) => {
	const keyText = 'Preferred procedure';
	const possibleProcedures = [
		caseData.appellantProcedurePreference,
		caseData.appellantPreferHearingDetails,
		caseData.appellantPreferInquiryDetails
	];

	const valueText = possibleProcedures.filter(Boolean).join('<br>');

	return valueText ? createRow(keyText, valueText) : null;
};
