const { getAppealByLPACodeAndId } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

module.exports = () => async (req, res, next) => {
	const referenceId = req.params.referenceId;
	const encodedReferenceId = encodeURIComponent(referenceId);

	const user = getLPAUserFromSession(req);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, encodedReferenceId);

	res.locals.appeal = appeal;

	return next();
};
