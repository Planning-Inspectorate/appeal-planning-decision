const { formatHeadlineData } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const {
	formatTitleSuffix,
	formatFinalCommentsHeadingPrefix,
	isAppellantComments,
	getFinalComments
} = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');

/**
 * Shared controller for LPA - /manage-appeals/:caseRef/appellant-final-comments and manage-appeals/:caseRef/final-comments
 * Also shared for appellant - /appeals/:caseRef/lpa-final-comments and /appeals/:caseRef/final-comments
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

		const headlineData = formatHeadlineData(caseData, userType);
		const isAppellantCommentsResult = isAppellantComments(userRouteUrl, userType);
		const finalComments = getFinalComments(caseData, isAppellantCommentsResult);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			headingPrefix: formatFinalCommentsHeadingPrefix(userRouteUrl),

			appeal: {
				appealNumber,
				headlineData,
				finalComments
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_FINAL_COMMENTS, viewContext);
	};
};
