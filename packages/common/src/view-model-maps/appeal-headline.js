const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');
const { formatAddress } = require('../lib/format-address');
const { PROCEDURE_TYPES } = require('../database/data-static');
const { caseTypeNameWithDefault } = require('../lib/format-case-type');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import("../client/appeals-api-client").AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("../client/appeals-api-client").ServiceUserAPI} ServiceUser
 */

/**
 * @param {ServiceUser[]} [users]
 * @returns {string}
 */
const formatApplicant = (users) => {
	const appellant = users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.APPELLANT);

	if (!appellant) return '';

	return `${appellant.firstName} ${appellant.lastName}`;
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} lpaName
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const formatHeadlineData = (caseData, lpaName, userType = APPEAL_USER_ROLES.INTERESTED_PARTY) => {
	const { caseReference, appealTypeCode, caseProcedure, users, applicationReference } = caseData;

	const address = formatAddress(caseData);
	const applicant = formatApplicant(users);

	const headlines = [
		{
			key: { text: 'Appeal type' },
			value: { text: caseTypeNameWithDefault(appealTypeCode) }
		},
		{
			key: { text: 'Appeal procedure' },
			value: {
				text:
					caseProcedure && caseProcedure in PROCEDURE_TYPES
						? PROCEDURE_TYPES[caseProcedure].name
						: ''
			}
		},
		{
			key: { text: 'Appeal site' },
			value: { text: address }
		},
		{
			key: { text: 'Applicant' },
			value: { text: applicant }
		},
		{
			key: { text: 'Local planning authority' },
			value: { text: lpaName }
		},
		{
			key: { text: 'Application number' },
			value: { text: applicationReference }
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
 * @param {AppealCaseDetailed} caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const shouldFormatHeadlines = (
	{ caseValidDate, lpaQuestionnaireSubmittedDate, lpaQuestionnairePublishedDate },
	userType
) => {
	if (userType === APPEAL_USER_ROLES.APPELLANT) {
		return lpaQuestionnairePublishedDate;
	} else if (userType === LPA_USER_ROLE) {
		return caseValidDate && lpaQuestionnaireSubmittedDate;
	}
	return false;
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} lpaName
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const displayHeadlinesByUser = (caseData, lpaName, userType) => {
	if (shouldFormatHeadlines(caseData, userType)) {
		return formatHeadlineData(caseData, lpaName, userType);
	}
	return null;
};

module.exports = { formatHeadlineData, displayHeadlinesByUser };
