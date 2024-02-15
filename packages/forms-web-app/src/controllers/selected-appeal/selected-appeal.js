const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { determineUser } = require('../../lib/determine-user');
const { sections: appellantSections } = require('./appellant-sections');

/**
 * @type {{ [userType: import('@pins/common/src/constants').AppealToUserRoles|LPA_USER_ROLE]: import('./section').Section }}
 */
const userSections = {
	[APPEAL_USER_ROLES.APPELLANT]: appellantSections,
	[LPA_USER_ROLE]: appellantSections
};

/**
 * Shared controller for /appeals/:caseRef and manage-appeals/:caseRef
 * @type {import('express').Handler}
 */
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
			headlineData,
			// placeholder sections info
			sections: userSections[userType].map((section) => ({
				...section,
				links: section.links.filter(({ condition }) =>
					condition({ hasQuestionnaire: true, hasOtherThing: true })
				)
			}))
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
