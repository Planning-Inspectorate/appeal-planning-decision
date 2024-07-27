const { getLPA, errorMessages } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS },
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

		await req.appealsApiClient.createUser({
			email: lpa.email,
			isLpaUser: true,
			isLpaAdmin: true,
			lpaCode: lpaCode
		});
	} catch (err) {
		logger.error(err);

		// user already added for lpa so direct to enter email page
		if (err.message && err.message === errorMessages.user.only1Admin) {
			return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);
		}

		return genericAuthError(res);
	}

	return res.redirect(`/${YOUR_EMAIL_ADDRESS}`);
};

function genericAuthError(res) {
	res.status(401);
	logger.info('No lpaCode: 401');
	return res.render(UNAUTHORIZED);
}

module.exports = {
	getServiceInvite
};
