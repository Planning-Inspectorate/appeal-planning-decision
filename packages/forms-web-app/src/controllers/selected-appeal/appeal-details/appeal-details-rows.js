const { formatAddress } = require('@pins/common/src/lib/format-address');
const {
	formatApplicantDetails,
	formatHealthAndSafety,
	formatProcedure,
	formatLinkedAppeals,
	formatYesOrNo,
	formatContactDetails,
	formatAccessDetails
} = require('@pins/common');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @param {string} userType
 * @returns {Rows}
 */

exports.detailsRows = (caseData, userType) => {
	const isAppellantOrAgent = userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT);

	return [
		{
			keyText: isAppellantOrAgent
				? 'Was the application made in your name?'
				: "Was the application made in the appellant's name",
			valueText: formatYesOrNo(caseData, 'isAppellant'),
			condition: () => true
		},
		{
			keyText: "Applicant's name",
			valueText: formatApplicantDetails(caseData),
			condition: (caseData) => !caseData.isAppellant
		},
		{
			keyText: 'Contact details',
			valueText: formatContactDetails(caseData),
			condition: () => true
		},
		{
			keyText: 'Phone number',
			valueText: caseData.appellantPhoneNumber,
			condition: (caseData) => caseData.appellantPhoneNumber
		},
		{
			keyText: 'Site address',
			valueText: formatAddress(caseData, '\n'),
			condition: (caseData) => caseData.siteAddressLine1
		},
		{
			keyText: 'What is the area of the appeal site?',
			valueText: `${caseData.siteAreaSquareMeters}m<sup>2</sup>`,
			condition: (caseData) => caseData.siteAreaSquareMeters
		},
		{
			keyText: 'Is the site in a green belt',
			valueText: 'Yes',
			condition: (caseData) => caseData.appellantGreenBelt
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
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			condition: (caseData) => caseData.appellantSiteAccess
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
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Application reference',
			valueText: caseData.LPAApplicationReference,
			condition: (caseData) => caseData.LPAApplicationReference
		},
		{
			keyText: 'What date did you submit your planning application?',
			valueText: caseData.onApplicationDate,
			condition: (caseData) => caseData.onApplicationDate
		},
		{
			keyText: 'Enter the description of development',
			valueText: caseData.developmentDescriptionDetails,
			condition: (caseData) => caseData.developmentDescriptionDetails
		},
		{
			keyText: 'Did the local planning authority change the description of development?',
			valueText: caseData.updateDevelopmentDescription,
			condition: (caseData) => caseData.updateDevelopmentDescription
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			condition: (caseData) => caseData.appellantProcedurePreference
		},
		{
			keyText: 'Are there other appeals linked to your development?',
			valueText: formatLinkedAppeals(caseData),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Award of costs',
			valueText: 'Yes',
			condition: (caseData) => isAppellantOrAgent && caseData.costsAppliedForIndicator
		}
	];
};
