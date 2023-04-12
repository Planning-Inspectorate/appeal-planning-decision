const { getSavedAppeal, getExistingAppeal, sendToken } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		APPELLANT_SUBMISSION: {
			TASK_LIST,
			ENTER_CODE,
			REQUEST_NEW_CODE,
			CODE_EXPIRED,
			APPEAL_ALREADY_SUBMITTED
		}
	}
} = require('../../lib/views');
const { isTokenValid } = require('../../lib/is-token-valid');

const getEnterCode = async (req, res) => {
	const {
		body: { errors = {} }
	} = req;

	const url = `/${REQUEST_NEW_CODE}`;

	//this handles old save & return url (without id params)
	if (req.session.appeal?.id && !req.params.id) {
		res.redirect(`/${ENTER_CODE}/${req.session.appeal.id}`);
		return;
	}

	//this handles new save & return url (with id params)
	if (req.params.id) {
		req.session.userTokenId = req.params.id;

		//if middleware UUID validation fails, render the page
		//but do not attempt to send code email to user
		if (Object.keys(errors).length > 0) {
			res.render(ENTER_CODE, {
				requestNewCodeLink: url
			});
			return;
		}

		//attempt to send code email to user
		//and render page if API response errors
		try {
			await sendToken(req.params.id);
		} catch (e) {
			res.render(ENTER_CODE, {
				requestNewCodeLink: url
			});
			return;
		}
	}

	res.render(ENTER_CODE, {
		requestNewCodeLink: url
	});
};

const postEnterCode = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] },
		params: { id }
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

	delete req.session.userTokenId;

	let savedAppeal;
	try {
		savedAppeal = await getSavedAppeal(id);
	} catch (err) {
		return res.render(ENTER_CODE, {
			errors,
			errorSummary: [
				{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
			]
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
