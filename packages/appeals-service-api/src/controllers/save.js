const { logger } = require('../configuration/config');
const {
	saveAndReturnCreateService,
	saveAndReturnNotifyContinue,
	saveAndReturnNotifyCode,
	saveAndReturnGetServiceToken
} = require('../services/save-and-return.service');

async function saveAndReturnCreate(req, res) {
	const appeal = req.body;
	if (!appeal || !appeal.id) {
		res.status(400).send('Invalid Id');
		throw new Error('');
	}
	await saveAndReturnCreateService(appeal);
	await saveAndReturnNotifyContinue(appeal);
	res.status(201).send(appeal);
}

async function saveAndReturnGet(req, res) {
	const { token } = req.params;
	const appeal = await saveAndReturnGetServiceToken(token);
	res.status(200).send(appeal);
}

async function saveAndReturnToken(req, res) {
	const appeal = req.body;
	logger.info(`appeal in controller: ${appeal}`);
	logger.info('calling saveAndReturnNotifyCode');
	await saveAndReturnNotifyCode(appeal);
	logger.info('exiting saveAndReturnNotifyCode');
	res.status(200).send({});
}

module.exports = {
	saveAndReturnCreate,
	saveAndReturnGet,
	saveAndReturnToken
};
