const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { getExistingAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, APPEAL_DETAILS }
	}
} = require('../../lib/views');
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const dateFns = require('date-fns');

const calculateQuestionnaireDueDate = (appeal) => {
	const { appealValidDate } = appeal;
	let questionnaireDueDate = {};
	switch (appeal.type) {
		case APPEAL_ID.HOUSEHOLDER:
			questionnaireDueDate = dateFns.addBusinessDays(appealValidDate, 5);
			break;
		default:
			throw new Error('Unsupported appeal type');
	}
	return questionnaireDueDate;
};

const getAppealDetails = async (req, res) => {
	const { lpaCode, id } = req.params;
	const user = getLPAUserFromSession(req);
	const appeal = await getExistingAppealByLPACodeAndId(lpaCode, id);
	console.log(appeal);
	return res.render(APPEAL_DETAILS, {
		lpaName: user.lpaName,
		dashboardLink: `/${DASHBOARD}`,
		questionnaireDueDate: (() => {
			return new Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full',
				timeZone: 'Europe/London'
			}).format(calculateQuestionnaireDueDate(appeal));
		})()
	});
};

module.exports = {
	getAppealDetails
};
