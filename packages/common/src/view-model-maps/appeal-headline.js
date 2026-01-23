const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');
const { formatApplicant } = require('../lib/format-applicant');
const { formatAddress } = require('../lib/format-address');
const { formatLinkedCases } = require('../lib/format-linked-cases');
const { PROCEDURE_TYPES, CASE_TYPES } = require('../database/data-static');
const { caseTypeNameWithDefault } = require('../lib/format-case-type');
const { formatGridReference } = require('../lib/format-grid-reference');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import("../client/appeals-api-client").AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * @param {object} options
 * @param {AppealCaseDetailed} options.caseData
 * @param {string} [options.lpaName='']
 * @param {AppealToUserRoles|LpaUserRole|null} [options.role=APPEAL_USER_ROLES.INTERESTED_PARTY]
 */
const formatHeadlineData = ({
	caseData,
	lpaName = '',
	role = APPEAL_USER_ROLES.INTERESTED_PARTY
}) => {
	const {
		caseReference,
		appealTypeCode,
		caseProcedure,
		users,
		applicationReference,
		linkedCases,
		enforcementReference
	} = caseData;

	const address = caseData.siteAddressLine1
		? formatAddress(caseData)
		: formatGridReference(caseData.siteGridReferenceEasting, caseData.siteGridReferenceNorthing);

	const applicant = formatApplicant(users, role);

	const isEnforcement =
		appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode ||
		appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode;

	const referenceKey = isEnforcement ? 'Enforcement notice reference' : 'Application number';

	const referenceValue = isEnforcement ? enforcementReference : applicationReference;

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
			value: { html: address.replace(/\n/g, '<br>') }
		},
		{
			key: applicant.key,
			value: applicant.value
		},
		lpaName
			? {
					key: { text: 'Local planning authority' },
					value: { text: lpaName }
				}
			: {},
		{
			key: { text: referenceKey },
			value: { text: referenceValue }
		}
	];

	if (role === APPEAL_USER_ROLES.INTERESTED_PARTY) {
		headlines.unshift({
			key: { text: 'Appeal reference' },
			value: { text: caseReference }
		});
	} else if (linkedCases && linkedCases.length) {
		headlines.push({
			key: { text: 'Linked appeals' },
			value: formatLinkedCases(linkedCases, caseReference, role)
		});
	}

	return headlines;
};

/**
 * should this ever be false?
 * @param {AppealCaseDetailed} _caseData
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const shouldFormatHeadlines = (_caseData, userType) =>
	userType === APPEAL_USER_ROLES.APPELLANT ||
	userType === LPA_USER_ROLE ||
	APPEAL_USER_ROLES.RULE_6_PARTY;

/**
 * @param {AppealCaseDetailed} caseData
 * @param {string} lpaName
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 */
const displayHeadlinesByUser = (caseData, lpaName, userType) => {
	if (shouldFormatHeadlines(caseData, userType)) {
		return formatHeadlineData({ caseData, lpaName, role: userType });
	}
	return null;
};

module.exports = { formatHeadlineData, displayHeadlinesByUser };
