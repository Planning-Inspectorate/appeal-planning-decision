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
			shouldDisplay: true
		},
		{
			keyText: "Applicant's name",
			valueText: formatApplicantDetails(caseData),
			shouldDisplay: !caseData.isAppellant
		},
		{
			keyText: 'Contact details',
			valueText: formatContactDetails(caseData),
			shouldDisplay: true
		},
		{
			keyText: 'Phone number',
			valueText: caseData.appellantPhoneNumber,
			shouldDisplay: !!caseData.appellantPhoneNumber
		},
		{
			keyText: 'Site address',
			valueText: formatAddress(caseData, '\n'),
			shouldDisplay: !!caseData.siteAddressLine1
		},
		{
			keyText: 'What is the area of the appeal site?',
			valueText: `${caseData.siteAreaSquareMetres}m<sup>2</sup>`,
			shouldDisplay: !!caseData.siteAreaSquareMetres
		},
		{
			keyText: 'Is the site in a green belt',
			valueText: 'Yes',
			shouldDisplay: !!caseData.appellantGreenBelt
		},
		{
			keyText: 'Site fully owned',
			valueText: 'Yes',
			shouldDisplay: !!caseData.ownsAllLand
		},
		{
			keyText: 'Site partly owned',
			valueText: 'Yes',
			shouldDisplay: !!caseData.ownsSomeLand
		},
		{
			keyText: 'Other owners known',
			valueText: 'Yes',
			shouldDisplay: !!caseData.knowsOtherOwners
		},
		{
			keyText: 'Other owners identified',
			valueText: 'Yes',
			shouldDisplay: !!caseData.identifiedOwners
		},
		{
			keyText: 'Advertised appeal',
			valueText: 'Yes',
			shouldDisplay: !!caseData.advertisedAppeal
		},
		{
			keyText: 'Other owners informed',
			valueText: 'Yes',
			shouldDisplay: !!caseData.informedOwners
		},
		{
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			shouldDisplay: !!caseData.appellantSiteAccess
		},
		{
			keyText: 'Agricultural holding',
			valueText: 'Yes',
			shouldDisplay: !!caseData.agriculturalHolding
		},
		{
			keyText: 'Agricultural holding',
			valueText: 'No',
			shouldDisplay: !caseData.agriculturalHolding
		},
		{
			keyText: 'Tenant on agricultural holding',
			valueText: 'Yes',
			shouldDisplay: !!caseData.tenantAgriculturalHolding
		},
		{
			keyText: 'Other agricultural holding tenants',
			valueText: 'Yes',
			shouldDisplay: !!caseData.otherTenantsAgriculturalHolding
		},
		{
			keyText: 'Informed other agricultural holding tenants',
			valueText: 'Yes',
			shouldDisplay: !!caseData.informedTenantsAgriculturalHolding
		},
		{
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			shouldDisplay: true
		},
		{
			keyText: 'Application reference',
			valueText: caseData.LPAApplicationReference,
			shouldDisplay: !!caseData.LPAApplicationReference
		},
		{
			keyText: 'What date did you submit your planning application?',
			valueText: caseData.onApplicationDate,
			shouldDisplay: !!caseData.onApplicationDate
		},
		{
			keyText: 'Enter the description of development',
			valueText: caseData.developmentDescriptionDetails,
			shouldDisplay: !!caseData.developmentDescriptionDetails
		},
		{
			keyText: 'Did the local planning authority change the description of development?',
			valueText: 'Yes',
			shouldDisplay: !!caseData.updateDevelopmentDescription
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			shouldDisplay: !!caseData.appellantProcedurePreference
		},
		{
			keyText: 'Are there other appeals linked to your development?',
			valueText: formatLinkedAppeals(caseData),
			shouldDisplay: true
		},
		{
			keyText: 'Award of costs',
			valueText: 'Yes',
			shouldDisplay: isAppellantOrAgent && caseData.costsAppliedForIndicator
		}
	];
};
