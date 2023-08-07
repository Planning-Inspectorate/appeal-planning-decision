const {
	documentTypes: {
		draftStatementOfCommonGround: { name: taskName }
	}
} = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { DRAFT_STATEMENT_COMMON_GROUND, TASK_LIST }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const { mapDocumentToSavedDocument } = require('../../../mappers/document-mapper');

const sectionName = 'appealDecisionSection';
const sectionTag = 'DRAFT STATEMENT OF COMMON GROUND';

const getDraftStatementCommonGround = (req, res) => {
	const {
		session: {
			appeal: {
				id: appealId,
				[sectionName]: {
					procedureType,
					[taskName]: { uploadedFile }
				}
			}
		}
	} = req;
	res.render(DRAFT_STATEMENT_COMMON_GROUND, {
		appealId,
		uploadedFile,
		procedureType
	});
};

const postDraftStatementCommonGround = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		files,
		session: {
			appeal,
			appeal: {
				id: appealId,
				[sectionName]: {
					procedureType,
					[taskName]: { uploadedFile }
				}
			}
		}
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(DRAFT_STATEMENT_COMMON_GROUND, {
			appealId,
			uploadedFile,
			procedureType,
			errorSummary,
			errors
		});
	}

	try {
		if (files) {
			const document = await createDocument(
				appeal,
				files['file-upload'],
				null,
				taskName,
				sectionTag
			);

			appeal[sectionName][taskName].uploadedFile = mapDocumentToSavedDocument(
				document,
				document.name,
				files['file-upload'].name
			);
		}

		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${TASK_LIST}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(DRAFT_STATEMENT_COMMON_GROUND, {
			appealId,
			uploadedFile: appeal[sectionName][taskName].uploadedFile,
			procedureType,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getDraftStatementCommonGround,
	postDraftStatementCommonGround
};
