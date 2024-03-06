const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatSections, isSection } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { determineUser } = require('../../lib/determine-user');
const { sections: appellantSections } = require('./appellant-sections');
const { sections: lpaUserSections } = require('./lpa-user-sections');
const { mapDecisionTag } = require('@pins/business-rules/src/utils/decision-outcome');
const { sections: rule6Sections } = require('./rule-6-sections');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

/** @type {import('@pins/common/src/view-model-maps/sections/def').UserSectionsDict} */
const userSectionsDict = {
	[APPEAL_USER_ROLES.APPELLANT]: appellantSections,
	[LPA_USER_ROLE]: lpaUserSections,
	[APPEAL_USER_ROLES.RULE_6_PARTY]: rule6Sections
};

/**
 * Shared controller for /appeals/:caseRef, manage-appeals/:caseRef rule-6-appeals/:caseRef
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;
	const userRouteUrl = req.originalUrl;

	// determine user based on route to selected appeal
	//i.e '/appeals/' = appellant | agent
	// todo: use oauth token
	const userType = determineUser(userRouteUrl);

	if (userType === null) {
		throw new Error('Unknown role');
	}

	const userEmail =
		userType === LPA_USER_ROLE ? getLPAUserFromSession(req).email : req.session.email;

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

	const sections = userSectionsDict[userType];
	if (!isSection(sections)) throw new Error(`No sections configured for user type ${userType}`);

	const viewContext = {
		titleSuffix: formatTitleSuffix(userType),
		appeal: {
			appealNumber,
			headlineData,
			sections: formatSections({ caseData, sections, userEmail }),
			baseUrl: userRouteUrl,
			decision: mapDecisionTag(caseData.caseDecisionOutcome)
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};

/**
 * @param {string} userType
 * @returns {string}
 */
const formatTitleSuffix = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Manage your appeals';
	return 'Appeal a planning decision';
};
