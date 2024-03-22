const { formatAddress } = require('@pins/common/src/lib/format-address');
const {
	formatAgentDetails,
	formatVisibility,
	formatHealthAndSafety,
	formatProcedure
} = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */

exports.detailsRows = (caseData) => {
	return [
		{
			keyText: 'Agent name',
			valueText: formatAgentDetails(caseData),
			condition: (caseData) => caseData.yourFirstName
		},
		{
			keyText: 'Named on the application',
			valueText: `${caseData.appellantFirstName} ${caseData.appellantLastName}`,
			condition: (caseData) => caseData.appellantFirstName
		},
		{
			keyText: 'Application reference',
			valueText: caseData.LPAApplicationReference,
			condition: (caseData) => caseData.LPAApplicationReference
		},

		{
			keyText: 'Site address',
			valueText: formatAddress(caseData, '<br>'),
			condition: (caseData) => caseData.siteAddressLine1
		},
		{
			keyText: 'Site fully owned',
			valueText: 'Yes',
			condition: (caseData) => caseData.ownsAllLand
		},
		{
			keyText: 'Site partly owned',
			valueText: 'Yes',
			condition: (caseData) => caseData.ownsSomeLand
		},
		{
			keyText: 'Other owners known',
			valueText: 'Yes',
			condition: (caseData) => caseData.knowsOtherOwners
		},
		{
			keyText: 'Other owners identified',
			valueText: 'Yes',
			condition: (caseData) => caseData.identifiedOwners
		},
		{
			keyText: 'Advertised appeal',
			valueText: 'Yes',
			condition: (caseData) => caseData.advertisedAppeal
		},
		{
			keyText: 'Other owners informed',
			valueText: 'Yes',
			condition: (caseData) => caseData.informedOwners
		},
		{
			keyText: 'Agricultural holding',
			valueText: 'Yes',
			condition: (caseData) => caseData.agriculturalHolding
		},
		{
			keyText: 'Agricultural holding',
			valueText: 'No',
			condition: (caseData) => !caseData.agriculturalHolding
		},
		{
			keyText: 'Tenant on agricultural holding',
			valueText: 'Yes',
			condition: (caseData) => caseData.tenantAgriculturalHolding
		},
		{
			keyText: 'Other agricultural holding tenants',
			valueText: 'Yes',
			condition: (caseData) => caseData.otherTenantsAgriculturalHolding
		},
		{
			keyText: 'Informed other agricultural holding tenants',
			valueText: 'Yes',
			condition: (caseData) => caseData.informedTenantsAgriculturalHolding
		},
		{
			keyText: 'Visibility',
			valueText: formatVisibility(caseData),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			condition: (caseData) => caseData.appellantProcedurePreference
		}
	];
};
