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
			key: { text: 'Application number' },
			value: { text: LPAApplicationReference }
		}
	];

	if (userType === APPEAL_USER_ROLES.INTERESTED_PARTY) {
		headlines.unshift({
			key: { text: 'Appeal reference' },
			value: { text: caseReference }
		});
		headlines.splice(5, 0, {
			key: { text: 'Local planning authority' },
			value: { text: LPAName }
		});
	}

	return headlines;
};

/**
 * @param {AppealCaseWithAppellant} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const displayHeadlinesByUser = (caseData, userType) => {
	const {
		caseReceived,
		appealValidDate,
		lpaQuestionnaireSubmittedDate,
		lpaQuestionnairePublishedDate
	} = caseData;

	if (userType === APPEAL_USER_ROLES.APPELLANT && caseReceived && lpaQuestionnairePublishedDate) {
		return formatHeadlineData(caseData, userType);
	} else if (userType === LPA_USER_ROLE && appealValidDate && lpaQuestionnaireSubmittedDate) {
		return formatHeadlineData(caseData, userType);
	} else {
		return null;
	}
};

module.exports = { formatHeadlineData, displayHeadlinesByUser };
