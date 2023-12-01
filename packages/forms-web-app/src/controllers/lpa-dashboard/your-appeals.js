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

const { getAppealsCaseData } = require('../../lib/appeals-api-wrapper');

const getYourAppeals = async (req, res) => {
	let appealsCaseData = [];

	const user = getLPAUserFromSession(req);

	appealsCaseData = await getAppealsCaseData(user.lpaCode);

	const { toDoAppeals, waitingForReviewAppeals } = appealsCaseData
		.map((appeal) => mapToLPADashboardDisplayData(appeal))
		.reduce(
			(acc, cur) => {
				if (isToDoLPADashboard(cur)) {
					return {
						...acc,
						toDoAppeals: [...acc.toDoAppeals, cur]
					};
				}
				return {
					...acc,
					waitingForReviewAppeals: [...acc.waitingForReviewAppeals, cur]
				};
			},
			{ toDoAppeals: [], waitingForReviewAppeals: [] }
		);

	toDoAppeals.sort((a, b) => a.nextDocumentDue.dueInDays - b.nextDocumentDue.dueInDays);

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
