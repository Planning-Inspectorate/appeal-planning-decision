const { formatHeadlineData } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const {
	formatTitleSuffix,
	formatFinalCommentsHeadingPrefix,
	isAppellantComments,
	getFinalComments
} = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');

/**
 * Shared controller for LPA - /manage-appeals/:caseRef/appellant-final-comments and manage-appeals/:caseRef/final-comments
 * Also shared for appellant - /appeals/:caseRef/lpa-final-comments and /appeals/:caseRef/final-comments
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

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);
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
