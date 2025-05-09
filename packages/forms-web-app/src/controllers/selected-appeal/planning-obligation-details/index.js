const { formatHeadlineData, formatRows } = require('@pins/common');
const { planningObligationRows } = require('./planning-obligation-details-rows');
const { VIEW } = require('../../../lib/views');
const {
	formatTitleSuffix,
	formatPlanningObligationTitlePrefix
} = require('../../../lib/selected-appeal-page-setup');
const { determineUser } = require('../../../lib/determine-user');
const { getParentPathLink } = require('../../../lib/get-user-back-links');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const config = require('../../../config');

/**
 * Shared controller for /appeals/:caseRef/planning-obligation, manage-appeals/:caseRef/appellant-planning-obligation
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '');
		const backToAppealOverviewLink = getParentPathLink(userRouteUrl);

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

		const appealPlanningObligationRows = planningObligationRows(caseData);
		const planningObligationDetails = formatRows(appealPlanningObligationRows, caseData);

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		let bannerHtmlOverride;
		if (userType !== LPA_USER_ROLE) {
			bannerHtmlOverride =
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(
					config.getAppealTypeFeedbackUrl(caseData.appealTypeCode)
				);
		}

		const viewContext = {
			layoutTemplate,
			backToAppealOverviewLink,
			titlePrefix: formatPlanningObligationTitlePrefix(userType),
			titleSuffix: formatTitleSuffix(userType),

			appeal: {
				appealNumber,
				headlineData,
				planningObligationDetails
			},
			bannerHtmlOverride
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_PLANNING_OBLIGATION, viewContext);
	};
};
