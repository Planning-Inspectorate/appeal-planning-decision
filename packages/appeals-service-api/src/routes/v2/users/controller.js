const {
	createUser,
	searchUsers,
	getUserByEmail,
	getUserById,
	updateUser,
	removeLPAUser,
	linkUserToAppeal,
	isRule6User
} = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function userPost(req, res) {
	if ('id' in req.body) {
		throw ApiError.badRequest({ errors: ['id is not allowed'] });
	}
	const body = await createUser(req.body);
	res.status(200).json(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userSearch(req, res) {
	const { lpaCode } = req.query;

	if (!lpaCode) {
		throw ApiError.badRequest({ errors: ['lpaCode is required'] });
	}

	const body = await searchUsers({
		lpaCode: lpaCode?.trim()
	});

	res.status(200).json(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userGet(req, res) {
	const body = await resolveUser(req.params.userLookup);

	res.status(200).json(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userUpdate(req, res) {
	const { id, email } = await resolveUser(req.params.userLookup);
	let updateData = {};

	updateData.id = id;
	updateData.email = email;

	const { isEnrolled, lpaStatus } = req.body;
	if (isEnrolled) updateData.isEnrolled = isEnrolled; // should not be possible to update this to false
	if (lpaStatus) updateData.lpaStatus = lpaStatus;

	const body = await updateUser(updateData);

	res.status(200).json(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userDelete(req, res) {
	const user = await resolveUser(req.params.userLookup);
	await removeLPAUser(user.id);
	res.sendStatus(200);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userLink(req, res) {
	const { userLookup, appealId } = req.params;
	const role = req.body.role;

	const user = await resolveUser(userLookup);
	const result = await linkUserToAppeal(user.id, appealId, role);

	res.status(200).json({
		userLookup,
		appealId: result.appealId,
		role: result.role
	});
}

/**
 * @type {import('express').RequestHandler}
 */
async function userIsRule6User(req, res) {
	const { userLookup } = req.params;

	const result = await isRule6User(userLookup);

	res.status(200).json(result);
}

/**
 * @param {string} userLookup
 * @returns {Promise<import('@prisma/client').AppealUser>}
 */
async function resolveUser(userLookup) {
	userLookup = userLookup.trim();

	if (userLookup.includes('@')) {
		return getUserByEmail(userLookup);
	} else {
		return getUserById(userLookup);
	}
}

module.exports = {
	userPost,
	userSearch,
	userGet,
	userUpdate,
	userDelete,
	userLink,
	userIsRule6User
};
