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
const { isTokenValid } = require('../../../lib/is-token-valid');

const getEnterCode = async (req, res) => {
	const url = `/${REQUEST_NEW_CODE}`;
	await sendToken(req.params.id);
	res.render(ENTER_CODE, {
		requestNewCodeLink: url
	});
};

const postEnterCode = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		session: {
			appeal: { id }
		}
	} = req;
	const token = req.body['email-code'];

	if (Object.keys(errors).length > 0) {
		res.render(ENTER_CODE, {
			token,
			errors,
			errorSummary
		});
		return;
	}

	const tokenValid = await isTokenValid(id, token);

	if (!tokenValid) {
		res.redirect(`/${CODE_EXPIRED}`);
		return;
	}

	let savedAppeal;
	try {
		savedAppeal = await getSavedAppeal(id);
	} catch (err) {
		return res.render(ENTER_CODE, {
			errors,
			errorSummary: [{ text: 'No saved appeal was found for the given id', href: '#' }]
		});
	}

	req.session.appeal = await getExistingAppeal(savedAppeal.appealId);

	if (req.session.appeal.state === 'SUBMITTED') {
		res.redirect(`/${APPEAL_ALREADY_SUBMITTED}`);
	} else {
		res.redirect(`/${TASK_LIST}`);
	}
};

module.exports = {
	getEnterCode,
	postEnterCode
};
