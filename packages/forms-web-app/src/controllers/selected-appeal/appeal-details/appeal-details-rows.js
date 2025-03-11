const { formatAddress } = require('@pins/common/src/lib/format-address');
const {
	formatUserDetails,
	formatHealthAndSafety,
	formatProcedure,
	formatRelatedAppeals,
	formatYesOrNo,
	boolToYesNo,
	formatAccessDetails,
	formatDevelopmentType
} = require('@pins/common');
const { CASE_RELATION_TYPES, CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed } caseData
 * @param {string} userType
 * @returns {Rows}
 */

exports.detailsRows = (caseData, userType) => {
	const isAppellantOrAgent =
		userType === APPEAL_USER_ROLES.APPELLANT || userType === APPEAL_USER_ROLES.AGENT;

	const agent = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.AGENT);
	const appellant = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.APPELLANT);
	const contactIsAppellant = !agent; // if no agent than appellant made their own appeal
	const contact = contactIsAppellant ? appellant : agent;

	const nearbyAppeals = formatRelatedAppeals(caseData, CASE_RELATION_TYPES.nearby);
	const showNearbyAppeals = !!nearbyAppeals;

	const costApplicationKeyText = isAppellantOrAgent
		? 'Do you need to apply for an award of appeal costs?'
		: 'Did the appellant apply for an award of appeal costs?';

	return [
		{
			keyText:
				isAppellantOrAgent && contactIsAppellant // only show first option to appellant themselves
					? 'Was the application made in your name?'
					: "Was the application made in the appellant's name",
			valueText: boolToYesNo(contactIsAppellant),
			condition: () => true
		},
		{
			keyText: "Applicant's name",
			valueText: formatUserDetails(appellant),
			condition: () => !contactIsAppellant
		},
		{
			keyText: 'Contact details',
			valueText: formatUserDetails(contact),
			condition: () => true
		},
		{
			keyText: 'Phone number',
			valueText: contact?.telephoneNumber ? contact.telephoneNumber : '',
			condition: () => contact?.telephoneNumber
		},
		{
			keyText: 'Site address',
			valueText: formatAddress(caseData, '\n'),
			condition: (caseData) => caseData.siteAddressLine1
		},
		{
			keyText: 'What is the area of the appeal site?',
			valueText: `${caseData.siteAreaSquareMetres} m\u00B2`,
			condition: (caseData) => !!caseData.siteAreaSquareMetres
		},
		{
			keyText: 'Is the site in a green belt',
			valueText: formatYesOrNo(caseData, 'isGreenBelt'),
			condition: (caseData) => caseData.isGreenBelt != null
		},
		{
			keyText: 'Site fully owned',
			valueText: formatYesOrNo(caseData, 'ownsAllLand'),
			condition: (caseData) => caseData.ownsAllLand != null
		},
		{
			keyText: 'Site partly owned',
			valueText: formatYesOrNo(caseData, 'ownsSomeLand'),
			condition: (caseData) => caseData.ownsSomeLand != null
		},
		{
			keyText: 'All owners known',
			valueText: caseData.knowsAllOwners ?? '',
			condition: (caseData) => caseData.knowsAllOwners != null
		},
		{
			keyText: 'Other owners known',
			valueText: caseData.knowsOtherOwners ?? '',
			condition: (caseData) => caseData.knowsOtherOwners != null
		},
		{
			keyText: 'Other owners identified',
			valueText: formatYesOrNo(caseData, 'advertisedAppeal'),
			condition: (caseData) => caseData.advertisedAppeal != null
		},
		{
			keyText: 'Advertised appeal',
			valueText: formatYesOrNo(caseData, 'advertisedAppeal'),
			condition: (caseData) => caseData.advertisedAppeal != null
		},
		{
			keyText: 'Other owners informed',
			valueText: formatYesOrNo(caseData, 'ownersInformed'),
			condition: (caseData) => caseData.ownersInformed != null
		},
		{
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			condition: () => true
		},
		{
			keyText: 'Agricultural holding',
			valueText: formatYesOrNo(caseData, 'agriculturalHolding'),
			condition: (caseData) => caseData.agriculturalHolding != null
		},
		{
			keyText: 'Tenant on agricultural holding',
			valueText: formatYesOrNo(caseData, 'tenantAgriculturalHolding'),
			condition: (caseData) => caseData.tenantAgriculturalHolding != null
		},
		{
			keyText: 'Other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'otherTenantsAgriculturalHolding'),
			condition: (caseData) => caseData.otherTenantsAgriculturalHolding != null
		},
		{
			keyText: 'Informed other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'informedTenantsAgriculturalHolding'),
			condition: (caseData) => caseData.informedTenantsAgriculturalHolding != null
		},
		{
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			condition: () => true
		},
		{
			keyText: 'Application reference',
			valueText: caseData.applicationReference,
			condition: (caseData) => caseData.applicationReference
		},
		{
			keyText: 'What date did you submit your planning application?',
			valueText: formatDateForDisplay(caseData.applicationDate),
			condition: (caseData) => caseData.applicationDate != null
		},
		{
			keyText: 'What is the development type?',
			valueText: formatDevelopmentType(caseData.developmentType),
			condition: (caseData) => caseData.appealTypeCode !== CASE_TYPES.HAS.processCode
		},
		{
			keyText: 'Enter the description of development',
			valueText: caseData.originalDevelopmentDescription ?? '',
			condition: (caseData) => caseData.originalDevelopmentDescription
		},
		{
			keyText: 'Did the local planning authority change the description of development?',
			valueText: formatYesOrNo(caseData, 'changedDevelopmentDescription'),
			condition: (caseData) => caseData.changedDevelopmentDescription != null
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			condition: (caseData) => caseData.appellantProcedurePreference
		},
		{
			keyText: 'Expected procedure duration',
			valueText: caseData.appellantProcedurePreferenceDuration
				? caseData.appellantProcedurePreferenceDuration.toString()
				: '',
			condition: (caseData) => caseData.appellantProcedurePreferenceDuration != null
		},
		{
			keyText: 'Expected witness count',
			valueText: caseData.appellantProcedurePreferenceWitnessCount
				? caseData.appellantProcedurePreferenceWitnessCount.toString()
				: '',
			condition: (caseData) => caseData.appellantProcedurePreferenceWitnessCount != null
		},
		{
			keyText: 'Are there other appeals linked to your development?',
			valueText: showNearbyAppeals ? `Yes \n ${nearbyAppeals}` : 'No',
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: costApplicationKeyText,
			valueText: caseData.appellantCostsAppliedFor ? 'Yes' : 'No',
			condition: () => true
		}
	];
};
