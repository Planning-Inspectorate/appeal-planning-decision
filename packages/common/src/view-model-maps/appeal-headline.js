const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatAddress } = require('../lib/format-address');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import("../client/appeals-api-client").AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const formatHeadlineData = (caseData, userType = APPEAL_USER_ROLES.INTERESTED_PARTY) => {
	const {
		caseReference,
		LPAName,
		appealTypeName,
		procedure,
		appellantFirstName,
		appellantLastName,
		LPAApplicationReference
	} = caseData;

	const address = formatAddress(caseData);

	const headlines = [
		{
			key: { text: 'Appeal type' },
			value: { text: appealTypeName }
		},
		{
			key: { text: 'Appeal procedure' },
			value: { text: procedure }
		},
		{
			key: { text: 'Appeal site' },
			value: { text: address }
		},
		{
			key: { text: 'Applicant' },
			value: { text: `${appellantFirstName} ${appellantLastName}` }
		},
		{
			key: { text: 'Local planning authority' },
			value: { text: LPAName }
		},
		{
			key: { text: 'Application number' },
			value: { text: LPAApplicationReference }
		}
	];

	if (userType === APPEAL_USER_ROLES.INTERESTED_PARTY) {
		headlines.unshift({
			key: { text: 'Appeal reference' },
			value: { text: caseReference }
		});
	}

	return headlines;
};

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const shouldFormatHeadlines = (
	{ caseReceived, appealValidDate, lpaQuestionnaireSubmittedDate, lpaQuestionnairePublishedDate },
	userType
) => {
	if (userType === APPEAL_USER_ROLES.APPELLANT) {
		return caseReceived && lpaQuestionnairePublishedDate;
	} else if (userType === LPA_USER_ROLE) {
		return appealValidDate && lpaQuestionnaireSubmittedDate;
	}
	return false;
};

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const displayHeadlinesByUser = (caseData, userType) => {
	if (shouldFormatHeadlines(caseData, userType)) {
		return formatHeadlineData(caseData, userType);
	}
	return null;
};

module.exports = { formatHeadlineData, displayHeadlinesByUser };
