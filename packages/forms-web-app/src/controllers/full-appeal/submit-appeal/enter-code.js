const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, REQUEST_NEW_CODE }
	}
} = require('../../../lib/full-appeal/views');

const getEnterCode = async (req, res) => {
	const url = `/${REQUEST_NEW_CODE}`;
	const { token } = req.params;
	await sendToken(token);

	res.render(ENTER_CODE, {
		requestNewCodeLink: url
	});
};

const postEnterCode = async (req, res) => {
	const token = req.body['email-code'];

	const saved = await getSavedAppeal(token);
	req.session.appeal = await getExistingAppeal(saved.appealId);
	res.redirect(`/${TASK_LIST}`);
};

module.exports = {
	getEnterCode,
	postEnterCode
};
