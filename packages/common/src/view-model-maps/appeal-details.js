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
		value: { text: address }
	};

	appealDetails.push(appellantName);
	appealDetails.push(applicationReference);
	appealDetails.push(siteAddress);

	return appealDetails;
};
