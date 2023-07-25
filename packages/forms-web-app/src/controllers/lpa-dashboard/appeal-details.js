const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
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
	const appeal = await getAppealByLPACodeAndId(lpaCode, id);
	
	return res.render(APPEAL_DETAILS, {
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
