const { formatAddress } = require('@pins/common/src/lib/format-address');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { formatGridReference } = require('@pins/common/src/lib/format-grid-reference');
const {
	formatUserDetails,
	formatHealthAndSafety,
	formatProcedure,
	formatSubmissionRelatedAppeals,
	formatYesOrNo,
	boolToYesNo,
	formatAccessDetails,
	formatDevelopmentType,
	formatMajorMinorDevelopmentType,
	formatFactsForGround,
	formatGroundsOfAppeal,
	formatAllOrPart,
	hasAppealGround,
	formatInterestInLand,
	formatActSection
} = require('@pins/common');
const { CASE_TYPES, caseTypeLookup } = require('@pins/common/src/database/data-static');
const { formatDocumentDetails } = require('@pins/common');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

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
	if (
		caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode ||
		caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode
	)
		return enforcementDetailsRows(caseData, userType);

	const isAppellantOrAgent =
		userType === APPEAL_USER_ROLES.APPELLANT || userType === APPEAL_USER_ROLES.AGENT;

	const agent = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.AGENT);
	const appellant = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.APPELLANT);
	const contactIsAppellant = !agent; // if no agent then appellant made their own appeal
	const contact = contactIsAppellant ? appellant : agent;

	const caseType = caseTypeLookup(caseData.appealTypeCode, 'processCode');
	const isExpeditedAppealType = caseType?.expedited === true;
	const isS20orS78 =
		caseData.appealTypeCode === CASE_TYPES.S20.processCode ||
		caseData.appealTypeCode === CASE_TYPES.S78.processCode;
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
			condition: (caseData) => isS20orS78 && caseData.agriculturalHolding != null
		},
		{
			keyText: 'Tenant on agricultural holding',
			valueText: formatYesOrNo(caseData, 'tenantAgriculturalHolding'),
			condition: (caseData) => isS20orS78 && caseData.tenantAgriculturalHolding != null
		},
		{
			keyText: 'Other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'otherTenantsAgriculturalHolding'),
			condition: (caseData) => isS20orS78 && caseData.otherTenantsAgriculturalHolding != null
		},
		{
			keyText: 'Informed other agricultural holding tenants',
			valueText: formatYesOrNo(caseData, 'informedTenantsAgriculturalHolding'),
			condition: (caseData) => isS20orS78 && caseData.informedTenantsAgriculturalHolding != null
		},
		{
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			condition: () => true
		},
		{
			keyText: 'Application reference',
			valueText: caseData.applicationReference ?? '',
			condition: (caseData) => !!caseData.applicationReference
		},
		{
			keyText: 'What did you use the appeal site for when you made the application?',
			valueText: caseData.siteUseAtTimeOfApplication ?? '',
			condition: (caseData) => !!caseData.siteUseAtTimeOfApplication
		},
		{
			keyText: 'Was your application for the existing or proposed use of a development?',
			valueText: formatActSection(caseData, 'applicationMadeUnderActSection'),
			condition: (caseData) => !!caseData.applicationMadeUnderActSection
		},
		{
			keyText: 'Was your application for a major or minor development?',
			valueText: formatMajorMinorDevelopmentType(caseData.developmentType),
			condition: (caseData) =>
				isS20orS78 && !!formatMajorMinorDevelopmentType(caseData.developmentType)
		},
		{
			keyText: 'Was your application about any of the following?',
			valueText: formatDevelopmentType(caseData.developmentType),
			condition: () => isS20orS78 && caseData.developmentType != null
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
			condition: (caseData) => !isExpeditedAppealType && caseData.appellantProcedurePreference
		},
		{
			keyText: 'Expected procedure duration',
			valueText: caseData.appellantProcedurePreferenceDuration
				? caseData.appellantProcedurePreferenceDuration.toString()
				: '',
			condition: (caseData) =>
				!isExpeditedAppealType && caseData.appellantProcedurePreferenceDuration != null
		},
		{
			keyText: 'Expected witness count',
			valueText: caseData.appellantProcedurePreferenceWitnessCount
				? caseData.appellantProcedurePreferenceWitnessCount.toString()
				: '',
			condition: (caseData) =>
				!isExpeditedAppealType && caseData.appellantProcedurePreferenceWitnessCount != null
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

/**
 * @param {AppealCaseDetailed } caseData
 * @param {string} userType
 * @returns {Rows}
 */

const enforcementDetailsRows = (caseData, userType) => {
	const isAppellantOrAgent =
		userType === APPEAL_USER_ROLES.APPELLANT || userType === APPEAL_USER_ROLES.AGENT;

	const agent = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.AGENT);
	const appellant = caseData.users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.APPELLANT);
	const contactIsAppellant = !agent; // if no agent then appellant made their own appeal
	const contact = contactIsAppellant ? appellant : agent;

	const documents = caseData.Documents || [];

	const grounds = caseData.EnforcementAppealGroundsDetails || [];

	const relatedAppeals = formatSubmissionRelatedAppeals(
		caseData,
		fieldNames.appellantLinkedCaseReference
	);
	const showRelatedAppeals = !!relatedAppeals;

	const interestInLand = formatInterestInLand(caseData);
	const showPermission = !!interestInLand?.hasPermission;

	const hasAppealGroundA = hasAppealGround(caseData, 'a');

	const costApplicationKeyText = isAppellantOrAgent
		? 'Do you need to apply for an award of appeal costs?'
		: 'Did the appellant apply for an award of appeal costs?';

	const siteAddressValue = caseData.siteAddressLine1
		? formatAddress(caseData, '\n')
		: formatGridReference(caseData.siteGridReferenceEasting, caseData.siteGridReferenceNorthing);

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
			keyText:
				isAppellantOrAgent && contactIsAppellant // only show first option to appellant themselves
					? 'What is your interest in the land?'
					: "What is the appellant's interest in the land?",
			valueText: interestInLand.interestInLand,
			condition: () => true
		},
		{
			keyText:
				isAppellantOrAgent && contactIsAppellant // only show first option to appellant themselves
					? 'Do you have verbal or written permission to use the land?'
					: 'Does the appellant have verbal or written permission to use the land?',
			valueText: interestInLand.hasPermission,
			condition: () => showPermission
		},
		{
			keyText: 'Will an inspector need to access the land or property?',
			valueText: formatAccessDetails(caseData),
			condition: () => true
		},
		{
			keyText: 'Site health and safety issues',
			valueText: formatHealthAndSafety(caseData),
			condition: () => true
		},

		{
			keyText: 'Grounds of appeal',
			valueText: formatGroundsOfAppeal(grounds),
			condition: () => true
		},
		{
			keyText:
				'Was an application made in respect of development on the enforcement notice and correct fee paid?',
			valueText: formatYesOrNo(caseData, 'applicationMadeAndFeePaid'),
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationMadeAndFeePaid
		},
		{
			keyText: 'Was the application for all or part of the Development',
			valueText: formatAllOrPart(caseData),
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationPartOrWholeDevelopment
		},
		{
			keyText: 'Application reference',
			valueText: caseData.applicationReference ?? '',
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationReference
		},
		{
			keyText: 'What date did you submit your application?',
			valueText: formatDateForDisplay(caseData.applicationDate),
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationDate
		},

		{
			keyText: 'Enter the description of development',
			valueText: caseData.originalDevelopmentDescription ?? '',
			condition: (caseData) => hasAppealGroundA && !!caseData.originalDevelopmentDescription
		},
		{
			keyText: 'Did the local planning authority change the description of development?',
			valueText: formatYesOrNo(caseData, 'changedDevelopmentDescription'),
			condition: (caseData) => hasAppealGroundA && !!caseData.changedDevelopmentDescription
		},
		{
			keyText: 'Was your application granted or refused?',
			valueText: mapApplicationDecision(caseData.applicationDecision),
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationDecision
		},
		{
			keyText:
				caseData.applicationDecision == 'not_received'
					? 'What date was your decision due from the local planning authority?'
					: 'What is the date on the decision letter from the local planning authority?',
			valueText: formatDateForDisplay(caseData.applicationDecisionDate),
			condition: (caseData) => hasAppealGroundA && !!caseData.applicationDecisionDate
		},
		{
			keyText: 'Did anyone appeal the decision?',
			valueText: formatYesOrNo(caseData, 'didAppellantAppealLpaDecision'),
			condition: (caseData) => hasAppealGroundA && !!caseData.didAppellantAppealLpaDecision
		},
		{
			keyText: 'When was the appeal decision?',
			valueText: formatDateForDisplay(caseData.dateLpaDecisionReceived),
			condition: (caseData) => hasAppealGroundA && !!caseData.dateLpaDecisionReceived
		},
		{
			keyText: 'Facts for ground (a)',
			valueText: formatFactsForGround(caseData, 'a'),
			condition: (caseData) => hasAppealGround(caseData, 'a')
		},
		{
			keyText: 'Ground (a) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_A_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'a')
		},
		{
			keyText: 'Facts for ground (b)',
			valueText: formatFactsForGround(caseData, 'b'),
			condition: (caseData) => hasAppealGround(caseData, 'b')
		},
		{
			keyText: 'Ground (b) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_B_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'b')
		},
		{
			keyText: 'Facts for ground (c)',
			valueText: formatFactsForGround(caseData, 'c'),
			condition: (caseData) => hasAppealGround(caseData, 'c')
		},
		{
			keyText: 'Ground (c) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_C_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'c')
		},
		{
			keyText: 'Facts for ground (d)',
			valueText: formatFactsForGround(caseData, 'd'),
			condition: (caseData) => hasAppealGround(caseData, 'd')
		},
		{
			keyText: 'Ground (d) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_D_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'd')
		},
		{
			keyText: 'Facts for ground (e)',
			valueText: formatFactsForGround(caseData, 'e'),
			condition: (caseData) => hasAppealGround(caseData, 'e')
		},
		{
			keyText: 'Ground (e) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_E_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'e')
		},
		{
			keyText: 'Facts for ground (f)',
			valueText: formatFactsForGround(caseData, 'f'),
			condition: (caseData) => hasAppealGround(caseData, 'f')
		},
		{
			keyText: 'Ground (f) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_F_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'f')
		},
		{
			keyText: 'Facts for ground (g)',
			valueText: formatFactsForGround(caseData, 'g'),
			condition: (caseData) => hasAppealGround(caseData, 'g')
		},
		{
			keyText: 'Ground (g) supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_G_SUPPORTING),
			condition: (caseData) => hasAppealGround(caseData, 'g')
		},

		// for enforcement listed building - document types not in data model yet

		// {
		// 	keyText: 'Facts for ground (h)',
		// 	valueText: formatFactsForGround(caseData, 'h'),
		// 	condition: (caseData) => hasAppealGround(caseData, 'h')
		// },
		// 		{
		// 	keyText: 'Ground (h) supporting documents',
		// 	valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_H_SUPPORTING),
		// 	condition: (caseData) => hasAppealGround(caseData, 'h')
		// },
		// {
		// 	keyText: 'Facts for ground (i)',
		// 	valueText: formatFactsForGround(caseData, 'i'),
		// 	condition: (caseData) => hasAppealGround(caseData, 'i')
		// },
		// 		{
		// 	keyText: 'Ground (i) supporting documents',
		// 	valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_I_SUPPORTING),
		// 	condition: (caseData) => hasAppealGround(caseData, 'i')
		// },
		// {
		// 	keyText: 'Facts for ground (j)',
		// 	valueText: formatFactsForGround(caseData, 'j'),
		// 	condition: (caseData) => hasAppealGround(caseData, 'j')
		// },
		// 		{
		// 	keyText: 'Ground (j) supporting documents',
		// 	valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_J_SUPPORTING),
		// 	condition: (caseData) => hasAppealGround(caseData, 'j')
		// },
		// {
		// 	keyText: 'Facts for ground (k)',
		// 	valueText: formatFactsForGround(caseData, 'k'),
		// 	condition: (caseData) => hasAppealGround(caseData, 'k')
		// },
		// 		{
		// 	keyText: 'Ground (k) supporting documents',
		// 	valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.GROUND_K_SUPPORTING),
		// 	condition: (caseData) => hasAppealGround(caseData, 'k')
		// },

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

const mapApplicationDecision = (/** @type {string | null | undefined} */ decision) => {
	if (!decision) return;
	if (decision === 'not_received') return 'I have not received a decision';
	return decision.replace(/^\w/, (c) => c.toUpperCase());
};
