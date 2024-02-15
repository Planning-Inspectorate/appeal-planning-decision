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

	if (userType === null) {
		throw new Error('Unknown role');
	}

	let userEmail;

	if (req.session.lpaUser) {
		userEmail = req.session.lpaUser.email;
	} else if (req.session.email) {
		userEmail = req.session.email;
	}

	if (!userEmail) {
		throw new Error('no session email');
	}

	const user = await apiClient.getUserByEmailV2(userEmail);

	const caseData = await apiClient.getUsersAppealCase({
		caseReference: appealNumber,
		role: userType,
		userId: user.id
	});

	const headlineData = formatHeadlineData(caseData, userType);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
