const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, APPEAL_DETAILS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');

const { getAppealsCaseData } = require('../../lib/appeals-api-wrapper');
const { calculateDueInDays } = require('../../lib/calculate-due-in-days');

const getYourAppeals = async (req, res) => {
	let appealsCaseData = [];

	const user = getLPAUserFromSession(req);

	appealsCaseData = await getAppealsCaseData(user.lpaCode);

	appealsCaseData.forEach((appeal) => {
		appeal.dueInDays = calculateDueInDays(appeal.questionnaireDueDate);
	});

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`,
		appealsCaseData: appealsCaseData,
		appealDetailsLink: `/${APPEAL_DETAILS}`,
		appealQuestionnaireLink: baseHASUrl,
		showQuestionnaire: await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, user.lpaCode)
	});
};

module.exports = {
	getYourAppeals
};
