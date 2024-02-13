const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { formatHeadlineData } = require('@pins/common');
const { determineUser } = require('../../lib/determine-user');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

// Shared controller for /appeals/:caseRef and manage-appeals/:caseRef
exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;
	const userRouteUrl = req.originalUrl;
	// TODO update to a new endpoint
	// this API doesn't really satisfy the spec of AAPD-1247
	// but I think we should move forward with this to get
	// this code merged, then create a new endpoint and hook
	// it up in a later iteration.
	const caseData = await apiClient.getAppealCaseDataByCaseReference(appealNumber);

	// determine user based on route to selected appeal
	//i.e '/manage-appeals/' = agent
	const userType = determineUser(userRouteUrl);

	const headlineData = formatHeadlineData(caseData, userType);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
