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

	// determine user based on route to selected appeal
	//i.e '/appeals/' = appellant | agent
	const userType = determineUser(userRouteUrl);

	let caseData;

	if (userType) {
		// TODO: determine user ID (can get from API via email, in session)
		caseData = await apiClient.getUsersAppealCase({
			caseReference: appealNumber,
			role: userType,
			userId: ''
		});
	} else {
		// TODO: handle LPA
		caseData = await apiClient.getAppealCaseDataByCaseReference(appealNumber);
	}

	const headlineData = formatHeadlineData(caseData, userType);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
