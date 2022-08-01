const checkAppealTypeExists = (req, res, next) => {
	const { session: { appeal } = {} } = req;

	const allowList = [
		'/before-you-start/local-planning-department',
		'/before-you-start/type-of-planning-application',
		'/before-you-start/use-a-different-service',
		'/before-you-start/use-existing-service-application-type',
		'/before-you-start/use-existing-service-local-planning-department',
		'/appellant-submission/submission-information',
		'/full-appeal/submit-appeal/declaration-information',
		'/full-appeal/submit-appeal/enter-code',
		'/full-appeal/submit-appeal/appeal-already-submitted',
		'/appeal-householder-decision/planning-application-number',
		'/appeal-householder-decision/email-address',
		'/appeal-householder-decision/email-address-confirmed',
		'/appeal-householder-decision/confirm-email-address',
		'/appeal-householder-decision/list-of-documents',
		'/appeal-householder-decision/application-saved'
	];

	const isInAllowList = allowList.some((path) => req.originalUrl.includes(path));

	if (isInAllowList) {
		return next();
	}

	if (appeal && appeal.appealType) {
		return next();
	}

	return res.redirect('/before-you-start/local-planning-department');
};

module.exports = checkAppealTypeExists;
