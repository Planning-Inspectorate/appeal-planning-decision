const { getUserFromSession } = require('../../services/user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard
} = require('../../lib/dashboard-functions');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');

const { isNotWithdrawn } = require('@pins/common');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, APPEAL_DETAILS, DECIDED_APPEALS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');
const { APPEAL_CASE_STATUS } = require('pins-data-model');

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

	const { toDoAppeals, waitingForReviewAppeals } = [...appealsCaseData, ...invalidAppeals]
		.filter(isNotWithdrawn)
		.map(mapToLPADashboardDisplayData)
		.reduce(
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

	toDoAppeals.sort((a, b) => a.nextDocumentDue.dueInDays - b.nextDocumentDue.dueInDays);

	waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);

	const noToDoAppeals = !arrayHasItems(toDoAppeals);

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`,
		toDoAppeals: toDoAppeals,
		waitingForReviewAppeals: waitingForReviewAppeals,
		appealDetailsLink: `/${APPEAL_DETAILS}`,
		appealQuestionnaireLink: baseHASUrl,
		showQuestionnaire: await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, user.lpaCode),
		decidedAppealsLink: `/${DECIDED_APPEALS}`,
		decidedAppealsCount: decidedAppealsCount.count,
		noToDoAppeals
	});
};

module.exports = {
	getYourAppeals
};
