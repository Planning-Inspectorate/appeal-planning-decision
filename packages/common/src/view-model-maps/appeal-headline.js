const { formatAddress } = require('../lib/format-address');

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
 */
exports.formatHeadlineData = (caseData) => {
	const { appealTypeName, procedure, LPAApplicationReference } = caseData;

	const address = formatAddress(caseData);

	return [
		{
			key: {
				text: 'Appeal type'
			},
			value: {
				text: appealTypeName
			}
		},
		{
			key: {
				text: 'Appeal procedure'
			},
			value: {
				text: procedure
			}
		},
		{
			key: {
				text: 'Appeal site'
			},
			value: {
				text: address
			}
		},
		{
			key: {
				text: 'Applicant'
			},
			value: {
				text: 'placeholding'
			}
		},
		{
			key: {
				text: 'Application number'
			},
			value: {
				text: LPAApplicationReference
			}
		}
	];
};
