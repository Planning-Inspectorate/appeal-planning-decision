const logger = require('../../lib/logger');

const getRequestNewCode = (requestNewCodeView) => {
	return async (_, res) => {
		res.render(requestNewCodeView);
	};
};

const getRequestNewCodeLPA = (requestNewCodeView) => {
	return async (_, res) => {
		res.render(requestNewCodeView.REQUEST_NEW_CODE);
	};
};

const postRequestNewCode = (enterCodeView) => {
	return async (req, res) => {
		const id = req.session.enterCodeId;
		delete req.session.enterCodeId;

		req.session.enterCode = req.session.enterCode || {};
		req.session.enterCode.newCode = true;

		const params = id ? `/${id}` : '';
		res.redirect(`/${enterCodeView}${params}`);
	};
};

const postRequestNewCodeLPA = (enterCodeView) => {
	return async (req, res) => {
		const {
			body: { emailAddress, errors = {}, errorSummary = [] }
		} = req;

		// show error page
		if (Object.keys(errors).length > 0) {
			return res.render(enterCodeView.REQUEST_NEW_CODE, {
				errors,
				errorSummary
			});
		}

		let user;

		try {
			user = await req.appealsApiClient.getUserByEmailV2(emailAddress);
		} catch (e) {
			logger.info(e.message);
		}

		if (!user) {
			const customErrorSummary = [{ text: 'Enter a correct email address', href: '#' }];
			return res.render(enterCodeView.REQUEST_NEW_CODE, {
				errors,
				errorSummary: customErrorSummary
			});
		}

		res.redirect(`/${enterCodeView.ENTER_CODE}/${user.id}`);
	};
};

module.exports = {
	getRequestNewCode,
	getRequestNewCodeLPA,
	postRequestNewCode,
	postRequestNewCodeLPA
};
