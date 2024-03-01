const { formatAddressWithBreaks } = require('../lib/format-address');

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatAppealDetails = (caseData) => {
	const {
		// yourFirstName,
		// yourLastName,
		// yourCompanyName,
		appellantFirstName,
		appellantLastName,
		// ownsAllLand,
		// ownsSomeLand,
		// knowsOtherOwners,
		// identifiedOwners,
		// advertisedAppeal,
		// informedOwners,
		// agriculturalHolding,
		// otherTenantsAgriculturalHolding,
		// siteVisible,
		// siteVisibleDetails,
		// siteSafetyAppellant,
		// siteSafetyAppellantDetails,
		// appellantProcedurePreference,
		// appellantPreferHearingDetails,
		// appellantPreferInquiryDetails,
		LPAApplicationReference
	} = caseData;

	const address = formatAddressWithBreaks(caseData);

	const appealDetails = [];

	const agent = formatAgentDetails(caseData);

	const displayAgent = {
		key: { text: 'Agent name' },
		value: { html: agent }
	};

	const appellantName = {
		key: { text: 'Named on the application' },
		value: { text: `${appellantFirstName} ${appellantLastName}` }
	};

	const applicationReference = {
		key: { text: 'Application reference' },
		value: { text: LPAApplicationReference }
	};

	const siteAddress = {
		key: { text: 'Site address' },
		value: { html: address }
	};

	const ownership = formatOwnership(caseData);

	// ownership details....

	// agriculturalHolding

	const procedurePreference = formatProcedure(caseData);

	appealDetails.push(displayAgent);
	appealDetails.push(appellantName);
	appealDetails.push(applicationReference);
	appealDetails.push(siteAddress);
	if (ownership) {
		appealDetails.push(ownership);
	}
	appealDetails.push(procedurePreference);

	return appealDetails;
};

const formatAgentDetails = (caseData) => {
	const name = `${caseData.yourFirstName} ${caseData.yourLastName}`;

	return `${name}<br>${caseData.yourCompanyName}`;
};

const formatOwnership = (caseData) => {
	if (caseData.ownsAllLand) {
		return {
			key: { text: 'Site fully owned' },
			value: { text: 'Yes' }
		};
	} else if (caseData.ownsSomeLand) {
		return {
			key: { text: 'Site partly owned' },
			value: { text: 'Yes' }
		};
	}

	return null;
};

const formatProcedure = (caseData) => {
	const procedure = caseData.appellantProcedurePreference;

	return procedure;
};
