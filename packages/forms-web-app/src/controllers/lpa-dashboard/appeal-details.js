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
const { calculateDueInDays } = require('../../lib/calculate-due-in-days');

const getAppealDetails = async (req, res) => {
	const { id } = req.params;
	const { lpaUser } = req.session;
	const caseReference = encodeURIComponent(id);
	const appeal = await getAppealByLPACodeAndId(lpaUser.lpaCode, caseReference);
	const applicationFormMetaData = await getAppealDocumentMetaData(
		caseReference,
		encodeURI('Planning application form')
	);
	const decisionLetterMetaData = await getAppealDocumentMetaData(
		caseReference,
		encodeURI('Decision notice')
	);
	const appealStatementMetaData = await getAppealDocumentMetaData(
		caseReference,
		encodeURI('Appeal Statement')
	);
	const supportingDocumentsMetaData = await getAppealDocumentMetaData(
		caseReference,
		encodeURI('Supporting Documents'),
		true
	);

	const supportingDocuments = supportingDocumentsMetaData.map((document) => ({
		filename: document.filename,
		documentURI: document.documentURI
	}));

	const documents = {
		applicationForm: {
			filename: applicationFormMetaData.filename,
			documentURI: applicationFormMetaData.documentURI
		},
		decisionLetter: {
			filename: decisionLetterMetaData.filename,
			documentURI: decisionLetterMetaData.documentURI
		},
		appealStatement: {
			filename: appealStatementMetaData.filename,
			documentURI: appealStatementMetaData.documentURI
		},
		supportingDocuments
	};

	return res.render(APPEAL_DETAILS, {
		dashboardLink: `/${DASHBOARD}`,
		appeal,
		documents,
		dueInDays: calculateDueInDays(appeal.questionnaireDueDate),
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
