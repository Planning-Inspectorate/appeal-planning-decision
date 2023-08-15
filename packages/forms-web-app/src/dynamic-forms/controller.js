// common controllers for dynamic forms
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');

const {
	VIEW: { TASK_LIST }
} = require('./dynamic-components/views');

async function renderTaskList(req, res) {
	const { caseRef } = req.params;

	const user = getLPAUserFromSession(req);
	const caseReference = encodeURIComponent(caseRef);
	const appeal = await getAppealByLPACodeAndId(user.lpaCode, caseReference);

	return res.render(TASK_LIST, {
		appeal
	});
}

module.exports = {
	renderTaskList
};
