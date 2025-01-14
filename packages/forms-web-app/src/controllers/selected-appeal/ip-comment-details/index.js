const { formatHeadlineData } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');
const { formatComments } = require('../../../utils/format-comment-or-statement');
const { getDepartmentFromCode } = require('../../../services/department.service');

/**
 * Shared controller for /appeals/:caseRef/interested-party-comments, manage-appeals/:caseRef/interested-party-comments
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '');

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

		const user = await req.appealsApiClient.getUserByEmailV2(userEmail);

		const caseData = await req.appealsApiClient.getUsersAppealCase({
			caseReference: appealNumber,
			role: userType,
			userId: user.id
		});

		const comments = await req.appealsApiClient.getInterestedPartyComments(appealNumber);
		const formattedComments = formatComments(comments);

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),

			appeal: {
				appealNumber,
				headlineData,
				formattedComments
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS, viewContext);
	};
};
