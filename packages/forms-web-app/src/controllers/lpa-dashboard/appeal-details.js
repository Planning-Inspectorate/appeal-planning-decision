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
	const appealStatementMetaData = await getAppealDocumentMetaData(
		caseReference,
		'Appeal%20Statement'
	);

	const documents = {
		applicationForm: {
			filename: applicationFormMetaData.filename,
			documentURI: applicationFormMetaData.documentURI
		},
		appealStatement: {
			filename: appealStatementMetaData.filename,
			documentURI: appealStatementMetaData.documentURI
		}
	};

	return res.render(APPEAL_DETAILS, {
		dashboardLink: `/${DASHBOARD}`,
		appeal,
		documents,
		questionnaireDueDate: (() => {
			return new Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full',
				timeZone: 'Europe/London'
			}).format(dateFns.parseISO(appeal.questionnaireDueDate));
		})()
	});
};

module.exports = {
	getAppealDetails
};
