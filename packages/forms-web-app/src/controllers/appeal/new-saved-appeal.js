const logger = require('../../lib/logger');
const config = require('../../config');
const { VIEW } = require('../../lib/views');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');

exports.get = async (req, res) => {
	const { newOrSavedAppeal } = req.session;
	res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
		bannerHtmlOverride: config.betaBannerText,
		newOrSavedAppeal
	});
};

exports.post = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			bannerHtmlOverride: config.betaBannerText,
			errors,
			errorSummary,
			newOrSavedAppeal: body['new-or-saved-appeal']
		});
		return;
	}

	try {
		req.session.newOrSavedAppeal = body['new-or-saved-appeal'];
	} catch (e) {
		logger.error(e);

		res.render(VIEW.APPEAL.NEW_OR_SAVED_APPEAL, {
			bannerHtmlOverride: config.betaBannerText,
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

exports.startNew = async (req, res) => {
	req.session.appeal = undefined;
	req.session.newOrSavedAppeal = NEW_OR_SAVED_APPEAL_OPTION.START_NEW;
	res.redirect(`/${VIEW.BEFORE_YOU_START.LOCAL_PLANNING}`);
};
