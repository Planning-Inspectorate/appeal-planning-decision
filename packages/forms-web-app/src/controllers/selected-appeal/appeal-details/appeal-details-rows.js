const { formatAddress } = require('@pins/common/src/lib/format-address');
const {
	formatUserDetails,
	formatHealthAndSafety,
	formatProcedure,
	formatRelatedAppeals,
	formatYesOrNo,
	boolToYesNo,
	formatAccessDetails,
	formatDate
} = require('@pins/common');
const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

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

	const linkedAppeals = formatRelatedAppeals(caseData, CASE_RELATION_TYPES.linked);
	const showLinked = !!linkedAppeals;

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
			valueText: 'Yes',
			condition: (caseData) => caseData.isGreenBelt
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
			condition: (caseData) => caseData.advertisedAppeal
		},
		{
			keyText: 'Advertised appeal',
			valueText: 'Yes',
			condition: (caseData) => caseData.advertisedAppeal
		},
		{
			keyText: 'Other owners informed',
			valueText: 'Yes',
			condition: (caseData) => caseData.ownersInformed
		},
		{
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			condition: () => true
		},
		{
			keyText: 'Agricultural holding',
			valueText: formatYesOrNo(caseData, 'agriculturalHolding'),
			condition: () => true
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
			condition: () => true
		},
		{
			keyText: 'Application reference',
			valueText: caseData.applicationReference,
			condition: (caseData) => caseData.applicationReference
		},
		{
			keyText: 'What date did you submit your planning application?',
			valueText: formatDate(caseData.applicationDate),
			condition: (caseData) => caseData.applicationDate !== null
		},
		{
			keyText: 'Enter the description of development',
			valueText: caseData.developmentDescription ? caseData.developmentDescription : '',
			condition: (caseData) => caseData.developmentDescription
		},
		{
			keyText: 'Did the local planning authority change the description of development?',
			valueText: formatYesOrNo(caseData, 'changedDevelopmentDescription'),
			condition: (caseData) => caseData.changedDevelopmentDescription
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			condition: (caseData) => caseData.appellantProcedurePreference
		},
		{
			keyText: 'Are there other appeals linked to your development?',
			valueText: showLinked
				? `Yes \n ${formatRelatedAppeals(caseData, CASE_RELATION_TYPES.linked)}`
				: 'No',
			condition: () => showLinked,
			isEscaped: true
		},
		{
			keyText: 'Do you need to apply for an award of appeal costs?',
			valueText: formatYesOrNo(caseData, 'appellantCostsAppliedFor'),
			condition: () => isAppellantOrAgent
		}
	];
};
