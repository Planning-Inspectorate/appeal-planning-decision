const { utils } = require('@pins/common');
const config = require('../../config');
const logger = require('../../lib/logger');

const {
	VIEW: {
		FINAL_COMMENT: { APPEAL_CLOSED_FOR_COMMENT }
	}
} = require('../../lib/views');

const checkFinalCommentDeadline = (req, res, next) => {
	// get final comment from session
	let {
		session: { finalComment }
	} = req;

	if (!finalComment || finalComment.secureCodeEnteredCorrectly !== true) {
		res.status(404);
		logger.info('checkFinalCommentDeadline: No final comment in session - 404');
		return res.render('error/not-found');
	}

	let overrideDate = null;

	// is test LPA + Test environment + has debug date
	// then allow past middleware check
	if (config.server.allowTestingOverrides && utils.isTestLPA(req.session.finalComment?.lpaCode)) {
		overrideDate = req.session.finalCommentOverrideExpiryDate;
	}

	const dateToCheck = overrideDate ? overrideDate : finalComment.finalCommentExpiryDate;

	// if past deadline date
	let now = new Date(new Date().toISOString());
	let expiry = new Date(dateToCheck);
	if (expiry < now) {
		return res.redirect(`/${APPEAL_CLOSED_FOR_COMMENT}`);
	}

	return next();
};

module.exports = checkFinalCommentDeadline;
