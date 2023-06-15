const { getSavedAppeal, getExistingAppeal, sendToken } = require('../../lib/appeals-api-wrapper');
const { isTokenValid } = require('../../lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');

const getEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;

		const action = req.session?.enterCode?.action ?? enterCodeConfig.actions.saveAndReturn;

		if (action === enterCodeConfig.actions.saveAndReturn) {
			req.session.enterCode = req.session.enterCode || {};
			req.session.enterCode.action = enterCodeConfig.actions.saveAndReturn;
		}

		// show new code success message only once
		const newCode = req.session?.enterCode?.newCode;
		if (newCode) {
			delete req.session?.enterCode?.newCode;
		}

		const url = `/${views.REQUEST_NEW_CODE}`;
		const confirmEmailUrl =
			action === enterCodeConfig.actions.confirmEmail ? `/${views.EMAIL_ADDRESS}` : null;

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
				return renderEnterCodePage();
			}

			//attempt to send code email to user
			//and render page if API response errors
			try {
				await sendToken(req.params.id, action);
			} catch (e) {
				return renderEnterCodePage();
			}
		}

		return renderEnterCodePage();

		function renderEnterCodePage() {
			res.render(views.ENTER_CODE, {
				requestNewCodeLink: url,
				confirmEmailLink: confirmEmailUrl,
				showNewCode: newCode
			});
		}
	};
};

const postEnterCode = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;
		const token = req.body['email-code'];

		// show error page
		if (Object.keys(errors).length > 0) {
			return res.render(views.ENTER_CODE, {
				token,
				errors,
				errorSummary
			});
		}

		// check token
		let tokenValid = await isTokenValid(id, token, req.session);

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		if (!tokenValid.valid) {
			const customErrorSummary = [{ text: 'Enter a correct code', href: '#email-code' }];

			return res.render(views.ENTER_CODE, {
				token,
				errors: {},
				errorSummary: customErrorSummary
			});
		}

		// if handling an email confirmation
		// session will be in browser so can redirect here and consider email confirmed
		if (tokenValid.action === enterCodeConfig.actions.confirmEmail) {
			delete req.session?.enterCode?.action;
			return res.redirect(`/${views.EMAIL_CONFIRMED}`);
		}

		// n.b. older save and return objects in db may not have an action - May 2023

		// delete user session
		delete req.session.userTokenId;

		// look up appeal from db
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

		// redirect
		if (req.session.appeal.state === 'SUBMITTED') {
			return res.redirect(`/${views.APPEAL_ALREADY_SUBMITTED}`);
		} else {
			return res.redirect(`/${views.TASK_LIST}`);
		}
	};
};

const getEnterCodeLPA = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {} }
		} = req;
		console.log(errors);
		res.render(views.ENTER_CODE);
		return;
	};
};

const postEnterCodeLPA = (views) => {
	return async (req, res) => {
		const {
			body: { errors = {}, errorSummary = [] },
			params: { id }
		} = req;

		const token = req.body['email-code'];

		// show error page
		if (Object.keys(errors).length > 0) {
			return res.render(views.ENTER_CODE, {
				token,
				errors,
				errorSummary
			});
		}

		// check token
		let tokenValid = await isTokenValid(id, token, req.session);

		if (tokenValid.tooManyAttempts) {
			return res.redirect(`/${views.NEED_NEW_CODE}`);
		}

		if (tokenValid.expired) {
			return res.redirect(`/${views.CODE_EXPIRED}`);
		}

		if (!tokenValid.valid) {
			const customErrorSummary = [{ text: 'Enter a correct code', href: '#email-code' }];

			return res.render(views.ENTER_CODE, {
				token,
				errors: {},
				errorSummary: customErrorSummary
			});
		}

		return res.redirect(`/${views.DASHBOARD}`);
	};
};

module.exports = {
	getEnterCode,
	postEnterCode,
	getEnterCodeLPA,
	postEnterCodeLPA
};
