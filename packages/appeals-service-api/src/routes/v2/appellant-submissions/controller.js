const ApiError = require('#errors/apiError');
const { put } = require('./service');

/**
 * @type {import('express').Handler}
 */
exports.put = async (req, res) => {
	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const data = req.body;

	const submission = await put({ userId, data });

	res.send(submission);
};
