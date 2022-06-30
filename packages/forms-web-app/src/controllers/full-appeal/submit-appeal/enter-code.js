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

	res.render(ENTER_CODE);
};

const postEnterCode = async (req, res) => {
	const { token } = req.body;
	const saved = await getSavedAppeal(token);
	req.session.appeal = await getExistingAppeal(saved.id);
	res.render(TASK_LIST);
};

module.exports = {
	getEnterCode,
	postEnterCode
};
