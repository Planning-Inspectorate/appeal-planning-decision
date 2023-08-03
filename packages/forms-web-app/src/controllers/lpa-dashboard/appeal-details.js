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
		documentURI: applicationFormMetaData.documentURI
	};

	return res.render(APPEAL_DETAILS, {
		dashboardLink: `/${DASHBOARD}`,
		appeal,
		applicationForm,
		questionnaireDueDate: (() => {
			return new Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full',
				timeZone: 'Europe/London'
			}).format(dateFns.parseISO(appeal.questionnaireAndCaseFileDue));
		})()
	});
};

module.exports = {
	getAppealDetails
};
