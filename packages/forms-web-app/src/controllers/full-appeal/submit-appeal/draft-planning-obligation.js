const {
	documentTypes: {
		draftPlanningObligations: { name: draftPlanningObligations }
	}
} = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { DRAFT_PLANNING_OBLIGATION, NEW_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const { mapDocumentToSavedDocument } = require('../../../mappers/document-mapper');

const sectionName = 'appealDocumentsSection';
const taskName = 'draftPlanningObligations';
const sectionTag = 'DRAFT PLANNING OBLIGATION';

const getDraftPlanningObligation = (req, res) => {
	const {
		session: {
			appeal: {
				id: appealId,
				[sectionName]: {
					[taskName]: { uploadedFiles }
				}
			}
		}
	} = req;
	res.render(DRAFT_PLANNING_OBLIGATION, {
		appealId,
		uploadedFiles
	});
};

const postDraftPlanningObligation = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		files,
		session: {
			appeal,
			appeal: { id: appealId }
		}
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(DRAFT_PLANNING_OBLIGATION, {
			appealId,
			uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
			errorSummary,
			errors
		});
	}

	try {
		if (files) {
			appeal[sectionName][taskName].uploadedFiles = [];
			const fileUpload = files['file-upload'];
			const uploadedFiles = Array.isArray(fileUpload) ? fileUpload : [fileUpload];
			await Promise.all(
				uploadedFiles.map(async (file) => {
					const document = await createDocument(
						appeal,
						file,
						null,
						draftPlanningObligations,
						sectionTag
					);
					appeal[sectionName][taskName].uploadedFiles.push(
						mapDocumentToSavedDocument(document, file.name, appeal.lpaCode)
					);
				})
			);
		}
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].draftPlanningObligations = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${NEW_DOCUMENTS}`);
		}
		appeal.sectionStates[sectionName].draftPlanningObligations = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(DRAFT_PLANNING_OBLIGATION, {
			appealId,
			uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getDraftPlanningObligation,
	postDraftPlanningObligation
};
