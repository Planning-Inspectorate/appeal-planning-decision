const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { formatAddress } = require('@pins/common/src/lib/format-address');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const caseData = await apiClient.getAppealCaseDataByCaseReference(appealNumber);

	console.log(caseData);

	const headlineData = formatHeadlineData(caseData);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};

/**
 * @param {AppealCaseWithAppellant} caseData
 */
const formatHeadlineData = (caseData) => {
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
