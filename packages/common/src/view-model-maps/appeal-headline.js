const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { formatAddress } = require('../lib/format-address');

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 * @param {import('@pins/common/src/constants').AppealToUserRoles|string|null} userType
 */
exports.formatHeadlineData = (caseData, userType = APPEAL_USER_ROLES.INTERESTED_PARTY) => {
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
