const logger = require('../../../lib/logger');
const {
	VIEW: { LIST_OF_DOCUMENTS, TASK_LIST, EMAIL_ADDRESS_CONFIRMED }
} = require('../../../lib/views');
const { postSaveAndReturn } = require('../../save');

const getListOfDocuments = (_, res) => {
	const typeOfPlanningApplication = 'full-appeal';

	res.render(LIST_OF_DOCUMENTS, {
		typeOfPlanningApplication
	});
};

const postListOfDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;

	try {
		if (req.body['save-and-return'] !== '') {
			return res.redirect(`/${TASK_LIST}`);
		}
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		return res.render(LIST_OF_DOCUMENTS, {
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getListOfDocuments,
	postListOfDocuments
};
