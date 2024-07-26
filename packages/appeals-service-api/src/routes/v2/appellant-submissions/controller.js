const ApiError = require('#errors/apiError');
const { put, post, deleteOldSubmissions } = require('./service');

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

/**
 * @type {import('express').Handler}
 */
exports.post = async (req, res) => {
	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const data = req.body;

	const submission = await post({ userId, data });

	res.send(submission);
};

/**
 * @type {import('express').Handler}
 */
exports.deleteOldSubmissions = async (req, res) => {
	const message = await deleteOldSubmissions();

	res.send(message);
};
