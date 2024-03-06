const {
	createUser,
	searchUsers,
	getUserByEmail,
	getUserById,
	updateUser,
	removeLPAUser,
	linkUserToAppeal
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
	res.status(200).send(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userSearch(req, res) {
	const { lpaCode } = req.query;

	const body = await searchUsers({
		lpaCode: lpaCode?.trim()
	});

	res.status(200).send(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userGet(req, res) {
	const body = await resolveUser(req.params.userLookup);
	res.status(200).send(body);
}

/**
 * @type {import('express').RequestHandler}
 */
async function userUpdate(req, res) {
	const user = await resolveUser(req.params.userLookup);

	const { isEnrolled, lpaStatus } = req.body;
	if (isEnrolled) user.isEnrolled = isEnrolled;
	if (lpaStatus) user.lpaStatus = lpaStatus;

	const body = await updateUser(user);

	res.status(200).send(body);
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

	res.status(200).send({
		userLookup,
		appealId: result.appealId,
		role: result.role
	});
}

/**
 * @param {string} userLookup
 * @returns {Promise<import('@prisma/client').AppealUser>}
 */
async function resolveUser(userLookup) {
	let user;

	userLookup = userLookup.trim();

	if (userLookup.includes('@')) {
		user = await getUserByEmail(userLookup);
	} else {
		user = await getUserById(userLookup);
	}

	return user;
}

module.exports = {
	userPost,
	userSearch,
	userGet,
	userUpdate,
	userDelete,
	userLink
};
