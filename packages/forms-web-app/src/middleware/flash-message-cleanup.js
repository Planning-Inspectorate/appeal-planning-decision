/**
 * Using the session to allow messages to persist over an HTTP redirect.
 * @type {import('express').Handler}
 */
module.exports = (req, res, next) => {
	const {
		session: { flashMessages = [] }
	} = req;

	// store the messages for one time use on the current request.
	res.locals.flashMessages = flashMessages;

	// reset the `flashMessages` container if there were any
	if (flashMessages.length) {
		req.session.flashMessages = [];
	}

	next();
};
