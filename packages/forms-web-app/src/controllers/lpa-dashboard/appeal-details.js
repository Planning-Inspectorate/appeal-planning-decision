const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, APPEAL_DETAILS }
	}
} = require('../../lib/views');

const dateFns = require('date-fns');

const HAS_APPEAL_TYPE = 'Householder (HAS) Appeal';

const calculateQuestionnaireDueDate = (appeal) => {
	const { appealValidDate } = appeal;
	let questionnaireDueDate = {};
	switch (appeal.appealType) {
		case HAS_APPEAL_TYPE:
			questionnaireDueDate = dateFns.addBusinessDays(dateFns.parseISO(appealValidDate), 5);
			break;
		default:
			throw new Error(`Unsupported appeal type ${appeal.appealType}`);
	}
	return questionnaireDueDate;
};

const getAppealDetails = async (req, res) => {
	const { id } = req.params;
	const { lpaUser } = req.session;
	const caseReference = encodeURIComponent(id);
	const appeal = await getAppealByLPACodeAndId(lpaUser.lpaCode, caseReference);
	const applicationFormMetaData = await getAppealDocumentMetaData(
		caseReference,
		'Planning%20application%20form'
	);
	const applicationForm = {
		filename: applicationFormMetaData.filename,
		uri: applicationFormMetaData.documentURI
	};

	return res.render(APPEAL_DETAILS, {
		dashboardLink: `/${DASHBOARD}`,
		appeal,
		applicationForm,
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
