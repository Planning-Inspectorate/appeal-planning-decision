const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, APPEAL_DETAILS },
		LPA_QUESTIONNAIRE: { QUESTIONNAIRE }
	}
} = require('../../lib/views');
const dateFns = require('date-fns');
const { calculateDueInDays } = require('../../lib/calculate-due-in-days');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

const getAppealDetails = async (req, res) => {
	const { id } = req.params;
	const user = getLPAUserFromSession(req);
	const caseReference = encodeURIComponent(id);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, caseReference);
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
		backOverride: {
			text: 'Back to appeals',
			href: `/${DASHBOARD}`
		},
		appeal,
		documents,
		dueInDays: calculateDueInDays(appeal.questionnaireDueDate),
		appealQuestionnaireLink: `/${QUESTIONNAIRE}`,
		showQuestionnaire: await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, user.lpaCode),
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
