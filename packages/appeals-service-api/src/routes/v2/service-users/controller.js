const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { getUserByEmail, unlinkUserFromAppeal } = require('../users/service');
const { put } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const serviceUser = await put(req.body);
	res.send(serviceUser);
};

/**
 * @type {import('express').RequestHandler}
 */
exports.r6UserUnlink = async (req, res) => {
	const { emailAddress, caseReference } = req.params;

	const user = await getUserByEmail(emailAddress);

	await unlinkUserFromAppeal(user.id, caseReference, APPEAL_USER_ROLES.RULE_6_PARTY);

	res.sendStatus(200);
};
