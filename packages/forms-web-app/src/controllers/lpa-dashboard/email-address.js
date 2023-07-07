const { getLPA } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { EMAIL_ADDRESS, CONFIRM_ADD_USER }
	}
} = require('../../lib/views');

const getEmailAddress = async (req, res) => {
	const user = getLPAUserFromSession(req);
	const lpa = await getLPA(user.lpaCode);

	return res.render(EMAIL_ADDRESS, {
		lpaDomain: `@${lpa.domain}`
	});
};

const postEmailAddress = async (req, res) => {
	return res.redirect(`/${CONFIRM_ADD_USER}`);
};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
