const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatSections, isSection, displayHeadlinesByUser } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { determineUser } = require('../../lib/determine-user');
const { sections: appellantSections } = require('./appellant-sections');
const { sections: lpaUserSections } = require('./lpa-user-sections');
const { mapDecisionTag } = require('@pins/business-rules/src/utils/decision-outcome');
const { sections: rule6Sections } = require('./rule-6-sections');
const { getUserFromSession } = require('../../services/user.service');
const { format: formatDate } = require('date-fns');

/** @type {import('@pins/common/src/view-model-maps/sections/def').UserSectionsDict} */
const userSectionsDict = {
	[APPEAL_USER_ROLES.APPELLANT]: appellantSections,
	[LPA_USER_ROLE]: lpaUserSections,
	[APPEAL_USER_ROLES.RULE_6_PARTY]: rule6Sections
};

/**
 * Shared controller for /appeals/:caseRef, manage-appeals/:caseRef rule-6-appeals/:caseRef
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const userRouteUrl = req.originalUrl;

		// determine user based on route to selected appeal
		// i.e '/appeals/' = appellant | agent
		// todo: use oauth token
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const userEmail = getUserFromSession(req).email;

		if (!userEmail) {
			throw new Error('no session email');
		}

		const user = await apiClient.getUserByEmailV2(userEmail);

		const caseData = await apiClient.getUsersAppealCase({
			caseReference: appealNumber,
			role: userType,
			userId: user.id
		});

		const headlineData = displayHeadlinesByUser(caseData, userType);

		const sections = userSectionsDict[userType];
		if (!isSection(sections)) throw new Error(`No sections configured for user type ${userType}`);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			shouldDisplayQuestionnaireDueNotification: shouldDisplayQuestionnaireDueNotification(
				caseData,
				userType
			),
			appeal: {
				appealNumber,
				headlineData,
				sections: formatSections({ caseData, sections, userEmail }),
				baseUrl: userRouteUrl,
				decision: mapDecisionTag(caseData.caseDecisionOutcome),
				questionnaireDueDate: formatDateForNotification(caseData.questionnaireDueDate)
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
	};
};

/**
 * @param {import('@pins/common/src/constants').AppealToUserRoles | "lpa-user" | null} userType
 * @returns {string}
 */
const formatTitleSuffix = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Manage your appeals';
	return 'Appeal a planning decision';
};

/**
 * @param {import('@pins/common/src/client/appeals-api-client').AppealCaseWithRule6Parties} caseData
 * @param {import('@pins/common/src/constants').AppealToUserRoles | "lpa-user" | null} userType
 * @returns {boolean}
 */
const shouldDisplayQuestionnaireDueNotification = (caseData, userType) =>
	userType === 'lpa-user' && !caseData.lpaQuestionnaireSubmitted;

/**
 *
 * @param {string | undefined} dateStr
 * @returns {string | undefined}
 */
const formatDateForNotification = (dateStr) => {
	if (!dateStr) return;
	const date = new Date(dateStr);
	return `${formatDate(date, 'h:mmaaa')} on ${formatDate(date, 'd LLLL yyyy')}`; // eg 11:59pm on 21 March 2024
};
