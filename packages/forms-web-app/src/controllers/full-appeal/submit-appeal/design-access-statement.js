const {
	constants: {
		APPLICATION_DECISION: { NODECISIONRECEIVED }
	}
} = require('@pins/business-rules');
const {
	VIEW: {
		FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DECISION_LETTER, LETTER_CONFIRMING_APPLICATION }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const mapDocumentToSavedDocument = require('../../../mappers/document-mapper');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'designAccessStatement';

const getDesignAccessStatement = (req, res) => {
	const {
		session: {
			appeal: {
				id: appealId,
				[sectionName]: {
					[taskName]: { uploadedFile }
				}
			}
		}
	} = req;

	res.render(DESIGN_ACCESS_STATEMENT, {
		appealId,
		uploadedFile
	});
};

const postDesignAccessStatement = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		files,
		session: {
			appeal,
			appeal: {
				id: appealId,
				eligibility: { applicationDecision },
				[sectionName]: {
					[taskName]: { uploadedFile }
				}
			}
		}
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(DESIGN_ACCESS_STATEMENT, {
			appealId,
			uploadedFile,
			errorSummary,
			errors
		});
	}

	try {
		if (files) {
			const document = await createDocument(appeal, files['file-upload'], null, taskName);
			appeal[sectionName][taskName].uploadedFile = mapDocumentToSavedDocument(
				document,
				files['file-upload'].name,
				appeal.lpaCode
			);
		}

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return applicationDecision === NODECISIONRECEIVED
				? res.redirect(`/${LETTER_CONFIRMING_APPLICATION}`)
				: res.redirect(`/${DECISION_LETTER}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(DESIGN_ACCESS_STATEMENT, {
			appealId,
			uploadedFile,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getDesignAccessStatement,
	postDesignAccessStatement
};
