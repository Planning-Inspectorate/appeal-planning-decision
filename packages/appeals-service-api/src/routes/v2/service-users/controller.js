const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { getUserByEmail, unlinkUserFromAppeal } = require('../users/service');
const { put, getForEmailCaseAndType, getServiceUserById } = require('./service');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');
const { getCaseAndAppellant } = require('../appeal-cases/service');
const {
	sendRule6PartyAddedEmailToRule6Party,
	sendRule6PartyAddedEmailToMainParties,
	sendRule6PartyUpdatedEmailToMainParties
} = require('#lib/notify');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const { emailAddress, caseReference, serviceUserType, id } = req.body;
	let isNewRule6Party = false;
	if (serviceUserType === SERVICE_USER_TYPE.RULE_6_PARTY) {
		let existingUser;
		if (id) {
			existingUser = await getServiceUserById(id);
		}

		if (!existingUser) {
			existingUser = await getForEmailCaseAndType(emailAddress, caseReference, [
				SERVICE_USER_TYPE.RULE_6_PARTY
			]);
		}

		if (existingUser) {
			req.body.id = existingUser.id;
		} else {
			isNewRule6Party = true;
		}
	}

	const serviceUser = await put(req.body);

	if (serviceUser && serviceUser.serviceUserType === SERVICE_USER_TYPE.RULE_6_PARTY) {
		const appealCase = await getCaseAndAppellant({ caseReference: serviceUser.caseReference });

		if (appealCase) {
			if (isNewRule6Party) {
				await sendRule6PartyAddedEmailToRule6Party(serviceUser, appealCase);
				await sendRule6PartyAddedEmailToMainParties(serviceUser, appealCase);
			} else {
				await sendRule6PartyUpdatedEmailToMainParties(serviceUser, appealCase);
			}
		}
	}

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
