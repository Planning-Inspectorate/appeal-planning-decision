const { documentTypes } = require('@pins/common');
const { VIEW } = require('../../../lib/full-appeal/views');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const { mapDocumentToSavedDocument } = require('../../../mappers/document-mapper');

const logger = require('../../../lib/logger');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.ownershipCertificate.name;
const sectionTag = 'OWNERSHIP CERTIFICATE';

const getCertificates = async (req, res) => {
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
	res.render(VIEW.FULL_APPEAL.CERTIFICATES, { appealId, uploadedFile });
};

const postCertificates = async (req, res) => {
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
		return res.render(VIEW.FULL_APPEAL.CERTIFICATES, {
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
				document.name,
				files['file-upload'].name
			);
		}

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);

			return res.redirect(`/${VIEW.FULL_APPEAL.PROPOSED_DEVELOPMENT_CHANGED}`);
		}

		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);

		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(VIEW.FULL_APPEAL.CERTIFICATES, {
			appealId,
			uploadedFile,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = { getCertificates, postCertificates };
