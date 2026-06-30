const {
	mapToAppellantDashboardDisplayData,
	isToDoAppellantDashboard,
	updateChildAppealDisplayData,
	withdrawnAppeals,
	decidedAppeals,
	oldInvalidAppeals
} = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const { isNotTransferred } = require('@pins/business-rules/src/lib/filter-transferred-appeal');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	VIEW: {
		YOUR_APPEALS: { DECIDED_APPEALS, WITHDRAWN_APPEALS }
	}
} = require('../../lib/views');

const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../featureFlag');
const {
	ifInvalidOnlyRecentValidation
} = require('@pins/business-rules/src/lib/filter-invalid-validation-one-month');

exports.get = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.APPELLANT);

		if (appeals?.length === 0) {
			res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
			return;
		}

		const flags = {
			[FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED]: await isFeatureActive(
				FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED
			)
		};

		const decidedAppealsCount = decidedAppeals(appeals).length;
		const withdrawnAppealsCount = withdrawnAppeals(appeals).length;
		const oldInvalidAppealCount = oldInvalidAppeals(appeals).length;

		const validAppeals = appeals
			.filter((data) => data.appeal?.hideFromDashboard !== true)
			.filter(isNotWithdrawn)
			.filter(isNotTransferred)
			.filter((appeal) => ifInvalidOnlyRecentValidation(appeal));

		const mappedAppeals = validAppeals
			.map((a) => mapToAppellantDashboardDisplayData(a, flags))
			.filter(Boolean);

		const undecidedAppeals = mappedAppeals.filter(
			(appeal) => !appeal.appealDecision || appeal.displayInvalid
		);

		// aligns child's nextJourneyDue information with lead linked case
		const undecidedWithUpdatedChildAppealDisplayData =
			updateChildAppealDisplayData(undecidedAppeals);

		const { toDoAppeals, waitingForReviewAppeals } =
			undecidedWithUpdatedChildAppealDisplayData.reduce(
				(acc, appeal) => {
					if (isToDoAppellantDashboard(appeal)) {
						acc.toDoAppeals.push(appeal);
					} else if (appeal.appealNumber) {
						// don't add draft appeals to waiting for review
						acc.waitingForReviewAppeals.push(appeal);
					}
					return acc;
				},
				{ toDoAppeals: [], waitingForReviewAppeals: [] }
			);

		toDoAppeals.sort((a, b) => a.nextJourneyDue.dueInDays - b.nextJourneyDue.dueInDays);
		waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);
		const noToDoAppeals = !arrayHasItems(toDoAppeals);

		viewContext = {
			toDoAppeals,
			waitingForReviewAppeals,
			noToDoAppeals,
			decidedAppealsCount,
			withdrawnAppealsCount: withdrawnAppealsCount + oldInvalidAppealCount,
			decidedAppealsLink: `/${DECIDED_APPEALS}`,
			withdrawnAppealsLink: `/${WITHDRAWN_APPEALS}`
		};

		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	}
};
