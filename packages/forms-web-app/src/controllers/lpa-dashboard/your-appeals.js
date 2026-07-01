const { getUserFromSession } = require('../../services/user.service');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard,
	updateChildAppealDisplayData,
	withdrawnAppeals,
	oldInvalidAppeals
} = require('../../lib/dashboard-functions');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const { isNotTransferred } = require('@pins/business-rules/src/lib/filter-transferred-appeal');
const {
	ifInvalidOnlyRecentValidation
} = require('@pins/business-rules/src/lib/filter-invalid-validation-one-month');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, DECIDED_APPEALS, WITHDRAWN_APPEALS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');

const getYourAppeals = async (req, res) => {
	const user = getUserFromSession(req);

	const { lpaCode } = user;

	const appealsCaseData = await req.appealsApiClient.getAppealsCaseDataV2(lpaCode);

	const decidedAppealsCount = await req.appealsApiClient.getDecidedAppealsCountV2(lpaCode);
	const withdrawnAppealsCount = withdrawnAppeals(appealsCaseData).length;
	const oldInvalidAppealCount = oldInvalidAppeals(appealsCaseData).length;

	const appealsForDisplay = appealsCaseData
		.filter((appeal) => isNotWithdrawn(appeal))
		.filter((appeal) => isNotTransferred(appeal))
		.filter((appeal) => ifInvalidOnlyRecentValidation(appeal))
		.map(mapToLPADashboardDisplayData);

	const appealsWithUpdatedChildAppealDisplayData = updateChildAppealDisplayData(appealsForDisplay);

	const { toDoAppeals, waitingForReviewAppeals } = appealsWithUpdatedChildAppealDisplayData.reduce(
		(acc, cur) => {
			if (isToDoLPADashboard(cur)) {
				acc.toDoAppeals.push(cur);
			} else {
				acc.waitingForReviewAppeals.push(cur);
			}
			return acc;
		},
		{ toDoAppeals: [], waitingForReviewAppeals: [] }
	);

	toDoAppeals.sort((a, b) => a.nextJourneyDue.dueInDays - b.nextJourneyDue.dueInDays);

	waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);

	const noToDoAppeals = !arrayHasItems(toDoAppeals);

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`,
		toDoAppeals: toDoAppeals,
		waitingForReviewAppeals: waitingForReviewAppeals,
		appealQuestionnaireLink: baseHASUrl,
		decidedAppealsLink: `/${DECIDED_APPEALS}`,
		withdrawnAppealsLink: `/${WITHDRAWN_APPEALS}`,
		decidedAppealsCount: decidedAppealsCount.count,
		withdrawnAppealsCount: withdrawnAppealsCount + oldInvalidAppealCount,
		noToDoAppeals
	});
};

module.exports = {
	getYourAppeals
};
