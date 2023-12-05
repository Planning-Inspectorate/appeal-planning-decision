const logger = require('../../lib/logger');
const config = require('../../config');
const { VIEW } = require('../../lib/views');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

exports.get = async (req, res) => {
	const { appeal } = req.session;
	res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
		newOrSavedAppeal: appeal?.newOrSavedAppeal
	});
};

exports.post = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			errors,
			errorSummary,
			newOrSavedAppeal: body['new-or-saved-appeal']
		});
		return;
	}

	try {
		appeal.newOrSavedAppeal = body['new-or-saved-appeal'];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			errors,
			errorSummary: [{ text: e.toString(), href: 'new-or-saved-appeal' }]
		});
		return;
	}

	if (body['new-or-saved-appeal'] === NEW_OR_SAVED_APPEAL_OPTION.RETURN) {
		res.redirect(`/${VIEW.APPEAL.EMAIL_ADDRESS}`);
	} else {
		res.redirect(config.appeals.startingPoint);
	}
};
