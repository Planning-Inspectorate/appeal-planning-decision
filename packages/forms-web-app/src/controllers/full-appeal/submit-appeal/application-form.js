const {
	VIEW: {
		FULL_APPEAL: { APPLICATION_FORM, APPLICATION_CERTIFICATES_INCLUDED }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'originalApplication';
const sectionTag = 'APPLICATION FORM';

const getApplicationForm = (req, res) => {
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
	res.render(APPLICATION_FORM, {
		appealId,
		uploadedFile
	});
};

const postApplicationForm = async (req, res) => {
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
		return res.render(APPLICATION_FORM, {
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
			appeal[sectionName][taskName].uploadedFile = mapDocumentToSavedDocument(document, files['file-upload'].name, req)
		}

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${APPLICATION_CERTIFICATES_INCLUDED}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(APPLICATION_FORM, {
			appealId,
			uploadedFile,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getApplicationForm,
	postApplicationForm
};
