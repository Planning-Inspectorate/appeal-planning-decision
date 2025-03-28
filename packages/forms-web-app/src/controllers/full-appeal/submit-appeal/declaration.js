const uuid = require('uuid');
const { storePdfAppeal } = require('../../../services/pdf.service');
const { VIEW } = require('../../../lib/full-appeal/views');
const { submitAppealForBackOfficeProcessing } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');

const {
	FULL_APPEAL: { DECLARATION, APPEAL_SUBMITTED }
} = VIEW;

const getDeclaration = (req, res) => {
	res.render(DECLARATION);
};

const postDeclaration = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;
	const { appeal } = req.session;

	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	log.info(appeal);
	if (!appeal.eligibility.applicationCategories) {
		appeal.eligibility.applicationCategories = ['none_of_these'];
	}
	log.info('Submitting the appeal');

	try {
		const { id, name, location, size } = await storePdfAppeal({
			appeal,
			fileName: `planning-appeal-for-planning-application-${appeal.planningApplicationNumber.replace(
				/\//g,
				'-'
			)}`,
			cookieString: req.headers.cookie
		});

		appeal.state = 'SUBMITTED';
		appeal.appealSubmission = {
			appealPDFStatement: {
				uploadedFile: {
					id,
					name,
					fileName: name,
					originalFileName: name,
					location,
					size
				}
			}
		};

		log.debug({ appealSubmission: appeal.appealSubmission }, 'Appeal submission');

		await submitAppealForBackOfficeProcessing(appeal);
		log.debug('Appeal successfully submitted for processing by the back end');
		res.redirect(`/${APPEAL_SUBMITTED}`);
	} catch (err) {
		log.error({ err }, 'The appeal submission failed');
		res.render(DECLARATION, {
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getDeclaration,
	postDeclaration
};
