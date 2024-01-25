const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard
} = require('../../lib/dashboard-functions');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, APPEAL_DETAILS, DECIDED_APPEALS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');

const { apiClient } = require('../../lib/appeals-api-client');

const getYourAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);

	const appealsCaseData = await apiClient.getAppealsCaseDataV2(user.lpaCode);

	const decidedAppealsCount = await apiClient.getDecidedAppealsCountV2(user.lpaCode);

	const { toDoAppeals, waitingForReviewAppeals } = appealsCaseData
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

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`,
		toDoAppeals: toDoAppeals,
		waitingForReviewAppeals: waitingForReviewAppeals,
		appealDetailsLink: `/${APPEAL_DETAILS}`,
		appealQuestionnaireLink: baseHASUrl,
		showQuestionnaire: await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, user.lpaCode),
		decidedAppealsLink: `/${DECIDED_APPEALS}`,
		decidedAppealsCount: decidedAppealsCount.count
	});
};

module.exports = {
	getYourAppeals
};
