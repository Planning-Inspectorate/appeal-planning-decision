const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, REQUEST_NEW_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED }
	}
} = require('../../../lib/full-appeal/views');
const { isTokenExpired } = require('../../../lib/is-token-expired');

const getEnterCode = async (req, res) => {
	const {
		session: { appeal }
	} = req;

	const url = `/${REQUEST_NEW_CODE}`;
	await sendToken(appeal);
	res.render(ENTER_CODE, {
		requestNewCodeLink: url
	});
};

const postEnterCode = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const token = req.body['email-code'];

	if (Object.keys(errors).length > 0) {
		res.render(ENTER_CODE, {
			token,
			errors,
			errorSummary
		});
		return;
	}

	let saved;
	try {
		saved = await getSavedAppeal(token);
	} catch (err) {
		return res.render(ENTER_CODE, {
			errors,
			errorSummary: [{ text: 'No appeal was found for the given token', href: '#' }]
		});
	}

	const tokenCreatedTime = new Date(saved.createdAt);

	if (!isTokenExpired(30, tokenCreatedTime)) {
		req.session.appeal = await getExistingAppeal(saved.appealId);
		if (req.session.appeal.state === 'SUBMITTED') {
			res.redirect(`/${APPEAL_ALREADY_SUBMITTED}`);
		} else {
			res.redirect(`/${TASK_LIST}`);
		}
	} else {
		res.redirect(`/${CODE_EXPIRED}`);
	}
};

module.exports = {
	getEnterCode,
	postEnterCode
};
