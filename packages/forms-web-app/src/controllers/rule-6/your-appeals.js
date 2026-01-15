const {
	mapToRule6DashboardDisplayData,
	isToDoRule6Dashboard
} = require('../../lib/dashboard-functions');
const logger = require('../../lib/logger');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const { isNotTransferred } = require('@pins/business-rules/src/lib/filter-transferred-appeal');

const {
	VIEW: {
		RULE_6: { DASHBOARD, DECIDED_APPEALS, WITHDRAWN_APPEALS }
	}
} = require('../../lib/views');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const config = require('../../config');

const { filterAppealsWithinGivenDate } = require('../../lib/filter-decided-appeals');
const { filterTime } = require('../../config');

const getYourAppealsR6 = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.RULE_6_PARTY);

		// if (appeals?.length === 0) {
		// 	res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
		// 	return;
		// }

		logger.debug({ appeals }, 'appeals');

		const withdrawnAppealsCount = appeals
			.filter((appeal) => appeal.caseWithdrawnDate)
			.map(mapToRule6DashboardDisplayData)
			.filter(Boolean)
			.filter((appeal) =>
				filterAppealsWithinGivenDate(
					appeal,
					'caseWithdrawnDate',
					filterTime.FIVE_YEARS_IN_MILISECONDS
				)
			).length;

		const filteredAppeals = appeals.filter(isNotWithdrawn).filter(isNotTransferred);

		const mappedAppeals = filteredAppeals
			.map((/** @type {any} */ a) => mapToRule6DashboardDisplayData(a))
			.filter(Boolean);

		const decidedAppealsCount = mappedAppeals.filter(
			(/** @type {any} */ appeal) =>
				appeal.appealDecision &&
				filterAppealsWithinGivenDate(
					appeal,
					'caseDecisionOutcomeDate',
					filterTime.FIVE_YEARS_IN_MILISECONDS
				)
		).length;

		const undecidedAppeals = mappedAppeals.filter((appeal) => !appeal.appealDecision);

		logger.debug({ undecidedAppeals }, 'undecided appeals');

		const { toDoAppeals, waitingForReviewAppeals } = undecidedAppeals.reduce(
			(acc, appeal) => {
				if (isToDoRule6Dashboard(appeal)) {
					acc.toDoAppeals.push(appeal);
				} else if (appeal.appealNumber) {
					// don't add draft appeals to waiting for review
					acc.waitingForReviewAppeals.push(appeal);
				}
				return acc;
			},
			{ toDoAppeals: [], waitingForReviewAppeals: [] }
		);

		logger.debug({ toDoAppeals }, 'toDoAppeals');
		logger.debug({ waitingForReviewAppeals }, 'waitingForReviewAppeals');

		toDoAppeals.sort((a, b) => a.nextJourneyDue.dueInDays - b.nextJourneyDue.dueInDays);
		waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);
		const noToDoAppeals = !arrayHasItems(toDoAppeals);
		const bannerHtmlOverride =
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'));

		viewContext = {
			toDoAppeals,
			waitingForReviewAppeals,
			noToDoAppeals,
			bannerHtmlOverride,
			decidedAppealsCount,
			decidedAppealsLink: `/${DECIDED_APPEALS}`,
			withdrawnAppealsLink: `/${WITHDRAWN_APPEALS}`,
			withdrawnAppealsCount
		};

		res.render(DASHBOARD, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(DASHBOARD, viewContext);
	}
};

module.exports = {
	getYourAppealsR6
};
