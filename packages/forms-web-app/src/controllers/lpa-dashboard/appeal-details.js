const logger = require('../../lib/logger');
const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, APPEAL_DETAILS }
	}
} = require('../../lib/views');
const { baseHASUrl } = require('../../dynamic-forms/has-questionnaire/journey');
const dateFns = require('date-fns');
const { calculateDueInDays } = require('../../lib/calculate-due-in-days');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

/**
 * @typedef {import('../../lib/appeals-api-wrapper').documentMetaData} documentMetaData
 */

/**
 * Retrieves specific data from a document's metadata.
 * @param {documentMetaData | Array<documentMetaData> } docMetaData - Document MetaData or array of Document MetaData
 * @returns {Object | Array<Object> } An object or array of objects containing extracted data from the document metadata.
 * @property {string} filename - The name of the document file.
 * @property {string} documentURI - The URI of the document.
 */
function getDocumentViewData(docMetaData) {
	if (Array.isArray(docMetaData)) {
		return docMetaData.map((document) => ({
			filename: document.filename,
			documentURI: document.documentURI
		}));
	}

	return {
		filename: docMetaData.filename,
		documentURI: docMetaData.documentURI
	};
}

async function getDocument(caseReference, type, multiDoc) {
	let result = null;
	try {
		const metaData = await getAppealDocumentMetaData(
			caseReference,
			encodeURI(type),
			multiDoc ? multiDoc : ''
		);
		result = getDocumentViewData(metaData);
	} catch (err) {
		logger.error(err);
	}

	return result;
}

const getAppealDetails = async (req, res) => {
	const { id } = req.params;
	const user = getLPAUserFromSession(req);
	const caseReference = encodeURIComponent(id);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, caseReference);

	const documents = {
		applicationForm: await getDocument(caseReference, 'Planning application form'),
		decisionLetter: await getDocument(caseReference, 'Decision notice'),
		appealStatement: await getDocument(caseReference, 'Appeal Statement'),
		supportingDocuments: await getDocument(caseReference, 'Supporting Documents', true)
	};

	return res.render(APPEAL_DETAILS, {
		backOverride: {
			text: 'Back to appeals',
			href: `/${DASHBOARD}`
		},
		appeal,
		documents,
		dueInDays: calculateDueInDays(appeal.questionnaireDueDate),
		appealQuestionnaireLink: baseHASUrl,
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
