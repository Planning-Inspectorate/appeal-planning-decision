const { getAppealsForUser } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getUserAppeals(req, res) {
	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const content = await getAppealsForUser(userId);
	if (!content) {
		throw ApiError.userNotFound();
	}

	res.status(200).send(content);
}

module.exports = {
	getUserAppeals
};
