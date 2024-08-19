const ApiError = require('#errors/apiError');
const { get, patch, confirmOwnership, getDownloadDetails, getCaseReference } = require('./service');

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	const appellantSubmissionId = req.params.id;

	if (!appellantSubmissionId) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const submission = await get({ appellantSubmissionId, userId });

	res.send(submission);
};

/**
 * @type {import('express').Handler}
 */
exports.patch = async (req, res) => {
	const appellantSubmissionId = req.params.id;

	if (!appellantSubmissionId) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const data = req.body;

	const submission = await patch({ appellantSubmissionId, userId, data });

	res.send(submission);
};

// Endpoint which checks whether a user is linked with an appellant submission
/**
 * @type {import('express').Handler}
 */
exports.confirm = async (req, res) => {
	const appellantSubmissionId = req.params.id;

	if (!appellantSubmissionId) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const result = await confirmOwnership({ appellantSubmissionId, userId });

	res.status(200).send(result);
};

// Endpoint for retrieving details required for appellant submission pdf generation
/**
 * @type {import('express').Handler}
 */
exports.getDownloadDetails = async (req, res) => {
	const appellantSubmissionId = req.params.id;

	if (!appellantSubmissionId) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const result = await getDownloadDetails({ appellantSubmissionId, userId });

	res.send(result);
};

// Endpoint for retrieving details required for appellant submission pdf generation
/**
 * @type {import('express').Handler}
 */
exports.getCaseReference = async (req, res) => {
	const appellantSubmissionId = req.params.id;

	if (!appellantSubmissionId) {
		throw ApiError.badRequest({ errors: ['Submission id is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const result = await getCaseReference({ appellantSubmissionId, userId });

	res.send(result);
};
