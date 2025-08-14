const { getUserFromSession } = require('../../services/user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard,
	updateChildAppealDisplayData
} = require('../../lib/dashboard-functions');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');

const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, APPEAL_DETAILS, DECIDED_APPEALS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');
const { APPEAL_CASE_STATUS } = require('@planning-inspectorate/data-model');

const getYourAppeals = async (req, res) => {
	const user = getUserFromSession(req);

	const { lpaCode } = user;

	const appealsCaseData = await req.appealsApiClient.getAppealsCaseDataV2(lpaCode);

	const invalidAppeals = await req.appealsApiClient.getAppealsCasesByLpaAndStatus({
		lpaCode,
		caseStatus: APPEAL_CASE_STATUS.INVALID,
		decidedOnly: true
	});

	const decidedAppealsCount = await req.appealsApiClient.getDecidedAppealsCountV2(lpaCode);

	const appealsForDisplay = [...appealsCaseData, ...invalidAppeals]
		.filter(isNotWithdrawn)
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
		appealDetailsLink: `/${APPEAL_DETAILS}`,
		appealQuestionnaireLink: baseHASUrl,
		showQuestionnaire: await isFeatureActive(FLAG.HAS_APPEAL_FORM_V2, user.lpaCode),
		decidedAppealsLink: `/${DECIDED_APPEALS}`,
		decidedAppealsCount: decidedAppealsCount.count,
		noToDoAppeals
	});
};

module.exports = {
	getYourAppeals
};
