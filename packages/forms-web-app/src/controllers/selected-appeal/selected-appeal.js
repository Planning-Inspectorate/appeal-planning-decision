const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { formatHeadlineData } = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

// Shared controller for /appeals/:caseRef and manage-appeals/:caseRef
exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	// TODO update to a new endpoint
	// this API doesn't really satisfy the spec of AAPD-1247
	// but I think we should move forward with this to get
	// this code merged, then create a new endpoint and hook
	// it up in a later iteration.
	const caseData = await apiClient.getAppealCaseDataByCaseReference(appealNumber);

	console.log('👩‍🔬 ~ caseData', caseData);

	const headlineData = formatHeadlineData(caseData);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
