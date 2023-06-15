const { getLPA, createUser, errorMessages } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { ENTER_EMAIL },
		ERROR_PAGES: { UNAUTHORIZED }
	}
} = require('../../lib/views');

const getServiceInvite = async (req, res) => {
	const lpaCode = req.params.lpaCode;

	try {
		if (!lpaCode) {
			return genericAuthError(res);
		}

		const lpa = await getLPA(lpaCode);

		if (!lpa || lpa.inTrial !== true) {
			return genericAuthError(res);
		}

		await createUser(lpa.email, true, lpaCode);
	} catch (err) {
		logger.error(err);

		// user already added for lpa so direct to enter email page
		if (err.message && err.message === errorMessages.user.only1Admin) {
			return res.redirect(`/${ENTER_EMAIL}`);
		}

		return genericAuthError(res);
	}

	return res.redirect(`/${ENTER_EMAIL}`);
};

function genericAuthError(res) {
	res.status(401);
	logger.info('No lpaCode: 401');
	return res.render(UNAUTHORIZED);
}

module.exports = {
	getServiceInvite
};
