const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');

const getEnterCode = async (req, res) => {
	const { token } = req.params;
	await sendToken(token);

	console.log(')()()()()()())()');
	console.log(req.session);
	console.log(')()()()()()())()');

	res.render(ENTER_CODE);
};

const postEnterCode = async (req, res) => {
	const token = req.body['email-code'];

	const saved = await getSavedAppeal(token);
	const existingAppeal = await getExistingAppeal(saved.appealId);
	console.log('PPPPPPP');
	console.log(existingAppeal);
	console.log('PPPPPPPP');
	// req.session.appeal = null
	req.session.appeal = existingAppeal;
	res.redirect(`/${TASK_LIST}`);
};

module.exports = {
	getEnterCode,
	postEnterCode
};
