const { getLPA } = require('../../lib/appeals-api-wrapper');

const {
	VIEW: {
		LPA_DASHBOARD: { EMAIL_ADDRESS, CONFIRM_ADD_USER }
	}
} = require('../../lib/views');

const getEmailAddress = async (req, res) => {
	const lpa = await getLPA('Q9999'); // todo aapd-8: get from user
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
