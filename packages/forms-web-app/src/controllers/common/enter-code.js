const { getSavedAppeal, getExistingAppeal, sendToken } = require('../../lib/appeals-api-wrapper');
const { isTokenValid } = require('../../lib/is-token-valid');

const getEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		const url = `/${views.REQUEST_NEW_CODE}`;

		//this handles old save & return url (without id params)
		if (req.session.appeal?.id && !req.params.id) {
			res.redirect(`/${views.ENTER_CODE}/${req.session.appeal.id}`);
			return;
		}

		//this handles new save & return url (with id params)
		if (req.params.id) {
			req.session.userTokenId = req.params.id;

			//if middleware UUID validation fails, render the page
			//but do not attempt to send code email to user
			if (Object.keys(errors).length > 0) {
				res.render(views.ENTER_CODE, {
					requestNewCodeLink: url
				});
				return;
			}

			//attempt to send code email to user
			//and render page if API response errors
			try {
				await sendToken(req.params.id);
			} catch (e) {
				res.render(views.ENTER_CODE, {
					requestNewCodeLink: url
				});
				return;
			}
		}

		res.render(views.ENTER_CODE, {
			requestNewCodeLink: url
		});
	};
};

const postEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;
		const token = req.body['email-code'];

		if (Object.keys(errors).length > 0) {
			res.render(views.ENTER_CODE, {
				token,
				errors,
				errorSummary
			});
			return;
		}

		const tokenValid = await isTokenValid(id, token);

		if (!tokenValid) {
			res.redirect(`/${views.CODE_EXPIRED}`);
			return;
		}

		delete req.session.userTokenId;

		let savedAppeal;
		try {
			savedAppeal = await getSavedAppeal(id);
		} catch (err) {
			return res.render(views.ENTER_CODE, {
				errors,
				errorSummary: [
					{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
				]
			});
		}

		req.session.appeal = await getExistingAppeal(savedAppeal.appealId);

		if (req.session.appeal.state === 'SUBMITTED') {
			res.redirect(`/${views.APPEAL_ALREADY_SUBMITTED}`);
		} else {
			res.redirect(`/${views.TASK_LIST}`);
		}
	};
};

module.exports = {
	getEnterCode,
	postEnterCode
};
