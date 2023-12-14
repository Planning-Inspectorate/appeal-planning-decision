const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard
} = require('../../lib/dashboard-functions');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, APPEAL_DETAILS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');

const { getAppealsCaseDataV2 } = require('../../lib/appeals-api-wrapper');

const getYourAppeals = async (req, res) => {
	let appealsCaseData = [];

	const user = getLPAUserFromSession(req);

	appealsCaseData = await getAppealsCaseDataV2(user.lpaCode);

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
		showQuestionnaire: await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, user.lpaCode)
	});
};

module.exports = {
	getYourAppeals
};
