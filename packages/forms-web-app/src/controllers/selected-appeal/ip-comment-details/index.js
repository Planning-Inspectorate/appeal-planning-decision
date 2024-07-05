const { formatHeadlineData } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');

/**
 * Shared controller for /manage-appeals/:caseRef/appellant-final-comments, manage-appeals/:caseRef/final-comments
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

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),

			appeal: {
				appealNumber,
				headlineData
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS, viewContext);
	};
};
