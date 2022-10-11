const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { LETTER_CONFIRMING_APPLICATION, TASK_LIST }
	}
} = require('../../../lib/full-appeal/views');

const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const mapDocumentToSavedDocument = require('../../../mappers/document-mapper');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.letterConfirmingApplication.name;
const sectionTag = 'LPA ACKNOWLEDGEMENT';

const getLetterConfirmingApplication = (req, res) => {
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
	res.render(LETTER_CONFIRMING_APPLICATION, {
		appealId,
		uploadedFile
	});
};

const postLetterConfirmingApplication = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		files,
		session: {
			appeal,
			appeal: {
				id: appealId,
				[sectionName]: {
					[taskName]: { uploadedFile }
				}
			}
		}
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(LETTER_CONFIRMING_APPLICATION, {
			appealId,
			uploadedFile,
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
				files['file-upload'].name,
				appeal.lpaCode
			);
		}

		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);

			return res.redirect(`/${TASK_LIST}`);
		} else {
			appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
			req.session.appeal = await createOrUpdateAppeal(appeal);

			return await postSaveAndReturn(req, res);
		}
	} catch (err) {
		logger.error(err);
		return res.render(LETTER_CONFIRMING_APPLICATION, {
			appealId,
			uploadedFile,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getLetterConfirmingApplication,
	postLetterConfirmingApplication
};
