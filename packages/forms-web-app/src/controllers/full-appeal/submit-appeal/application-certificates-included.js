const { VIEW } = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { postSaveAndReturn } = require('../../save');

const logger = require('../../../lib/logger');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'ownershipCertificate';

const getApplicationCertificatesIncluded = async (req, res) => {
	const { submittedSeparateCertificate } = req.session.appeal[sectionName][taskName];
	res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
		submittedSeparateCertificate
	});
};

const postApplicationCertificatesIncluded = async (req, res) => {
	const {
		body,
		session: { appeal }
	} = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
			errors,
			errorSummary
		});
	}

	const submittedSeparateCertificate = body['did-you-submit-separate-certificate'] === 'yes';

	try {
		appeal[sectionName][taskName].submittedSeparateCertificate = submittedSeparateCertificate;

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);

			return submittedSeparateCertificate
				? res.redirect(`/${VIEW.FULL_APPEAL.CERTIFICATES}`)
				: res.redirect(`/${VIEW.FULL_APPEAL.PROPOSED_DEVELOPMENT_CHANGED}`);
		}

		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);

		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
			submittedSeparateCertificate,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = { getApplicationCertificatesIncluded, postApplicationCertificatesIncluded };
