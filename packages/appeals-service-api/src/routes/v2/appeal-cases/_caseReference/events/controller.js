const { AppealEventRepository } = require('./repo');
const repo = new AppealEventRepository();

/**
 * @type {import('express').RequestHandler}
 */
async function getAppealEvents(req, res) {
	const { type, includePast } = req.query;
	const content = await repo.getEventsByAppealRef(req.params.caseReference, {
		type,
		includePast: includePast === 'true'
	});
	res.status(200).json(content);
}

module.exports = {
	getAppealEvents
};
