const { formatAddress } = require('@pins/common/src/lib/format-address');
const { formatGridReference } = require('@pins/common/src/lib/format-grid-reference');
const {
	formatUserDetails,
	formatHealthAndSafety,
	formatProcedure,
	formatSubmissionRelatedAppeals,
	formatYesOrNo,
	boolToYesNo,
	formatAccessDetails,
	formatDevelopmentType
} = require('@pins/common');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');

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

	const hasOrCasPlanningAppeal =
		caseData.appealTypeCode === CASE_TYPES.HAS.processCode ||
		caseData.appealTypeCode === CASE_TYPES.CAS_PLANNING.processCode;

	const isAdvertAppeal =
		caseData.appealTypeCode === CASE_TYPES.CAS_ADVERTS.processCode ||
		caseData.appealTypeCode === CASE_TYPES.ADVERTS.processCode;

	const relatedAppeals = formatSubmissionRelatedAppeals(
		caseData,
		fieldNames.appellantLinkedCaseReference
	);
	const showRelatedAppeals = !!relatedAppeals;

	const costApplicationKeyText = isAppellantOrAgent
		? 'Do you need to apply for an award of appeal costs?'
		: 'Did the appellant apply for an award of appeal costs?';

	const siteAddressValue = caseData.siteAddressLine1
		? formatAddress(caseData, '\n')
		: formatGridReference(caseData.siteGridReferenceEasting, caseData.siteGridReferenceNorthing);

	// model supports multiple advert details but we only ask for one currently
	const advertDetails =
		caseData.AdvertDetails && caseData.AdvertDetails.length > 0 ? caseData.AdvertDetails[0] : null;

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
			valueText: siteAddressValue,
			condition: (caseData) => caseData.siteAddressLine1 || caseData.siteGridReferenceEasting
		},
		{
			keyText: 'Is the appeal site on highway land?',
			valueText: advertDetails ? formatYesOrNo(advertDetails, 'isSiteOnHighwayLand') : '',
			condition: () => !!advertDetails
		},
		{
			keyText: 'Is the advertisement in position?',
			valueText: advertDetails ? formatYesOrNo(advertDetails, 'isAdvertInPosition') : '',
			condition: () => !!advertDetails
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
			keyText: "Do you have the land owner's permission?",
			valueText: formatYesOrNo(caseData, 'hasLandownersPermission'),
			condition: (caseData) => caseData.hasLandownersPermission != null
		},
		{
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			condition: () => true
		},
		{
			keyText: 'Agricultural holding',
			valueText: formatYesOrNo(caseData, 'agriculturalHolding'),
			condition: (caseData) => !hasOrCasPlanningAppeal && caseData.agriculturalHolding != null
		},
		{
			keyText: 'Tenant on agricultural holding',
			valueText: formatYesOrNo(caseData, 'tenantAgriculturalHolding'),
			condition: (caseData) => !hasOrCasPlanningAppeal && caseData.tenantAgriculturalHolding != null
		},
		{
			keyText: 'Other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'otherTenantsAgriculturalHolding'),
			condition: (caseData) =>
				!hasOrCasPlanningAppeal && caseData.otherTenantsAgriculturalHolding != null
		},
		{
			keyText: 'Informed other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'informedTenantsAgriculturalHolding'),
			condition: (caseData) =>
				!hasOrCasPlanningAppeal && caseData.informedTenantsAgriculturalHolding != null
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
			keyText: 'Was your application for a major or minor development?',
			valueText: caseData.majorMinorDevelopment ?? '',
			condition: (caseData) => caseData.majorMinorDevelopment
		},
		{
			keyText: 'Was your application about any of the following?',
			valueText: formatDevelopmentType(caseData.developmentType),
			condition: () => !hasOrCasPlanningAppeal && caseData.developmentType != null
		},
		{
			keyText: isAdvertAppeal
				? 'Enter the description of the advertisement that you submitted in your application'
				: 'Enter the description of development',
			valueText: caseData.originalDevelopmentDescription ?? '',
			condition: (caseData) => caseData.originalDevelopmentDescription
		},
		{
			keyText: isAdvertAppeal
				? 'Did the local planning authority change the description of the advertisement?'
				: 'Did the local planning authority change the description of development?',
			valueText: formatYesOrNo(caseData, 'changedDevelopmentDescription'),
			condition: (caseData) => caseData.changedDevelopmentDescription != null
		},
		{
			keyText: 'Preferred procedure',
			valueText: formatProcedure(caseData),
			condition: (caseData) => !hasOrCasPlanningAppeal && caseData.appellantProcedurePreference
		},
		{
			keyText: 'Expected procedure duration',
			valueText: caseData.appellantProcedurePreferenceDuration
				? caseData.appellantProcedurePreferenceDuration.toString()
				: '',
			condition: (caseData) =>
				!hasOrCasPlanningAppeal && caseData.appellantProcedurePreferenceDuration != null
		},
		{
			keyText: 'Expected witness count',
			valueText: caseData.appellantProcedurePreferenceWitnessCount
				? caseData.appellantProcedurePreferenceWitnessCount.toString()
				: '',
			condition: (caseData) =>
				!hasOrCasPlanningAppeal && caseData.appellantProcedurePreferenceWitnessCount != null
		},
		{
			keyText: 'Are there other appeals linked to your development?',
			valueText: showRelatedAppeals ? `Yes \n ${relatedAppeals}` : 'No',
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
