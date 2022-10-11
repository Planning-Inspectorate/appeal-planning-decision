const {
	VIEW: {
		FULL_APPEAL: { APPEAL_STATEMENT, NEW_PLANS_DRAWINGS }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const mapDocumentToSavedDocument = require('../../../mappers/document-mapper');

const sectionName = 'appealDocumentsSection';
const taskName = 'appealStatement';

const getAppealStatement = (req, res) => {
	const {
		session: {
			appeal: {
				id: appealId,
				[sectionName]: {
					[taskName]: { uploadedFile, hasSensitiveInformation }
				}
			}
		}
	} = req;
	res.render(APPEAL_STATEMENT, {
		appealId,
		uploadedFile,
		hasSensitiveInformation
	});
};

const postAppealStatement = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		files,
		session: {
			appeal,
			appeal: { id: appealId }
		}
	} = req;

	appeal[sectionName][taskName].hasSensitiveInformation =
		body['does-not-include-sensitive-information'] !== 'i-confirm';

	if (Object.keys(errors).length > 0) {
		return res.render(APPEAL_STATEMENT, {
			appealId,
			uploadedFile: appeal[sectionName][taskName].uploadedFile,
			hasSensitiveInformation: appeal[sectionName][taskName].hasSensitiveInformation,
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
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${NEW_PLANS_DRAWINGS}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(APPEAL_STATEMENT, {
			appealId,
			uploadedFile: appeal[sectionName][taskName].uploadedFile,
			hasSensitiveInformation: appeal[sectionName][taskName].hasSensitiveInformation,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getAppealStatement,
	postAppealStatement
};
