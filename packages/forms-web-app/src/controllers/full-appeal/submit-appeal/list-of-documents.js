const logger = require('../../../lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { LIST_OF_DOCUMENTS: currentPage, TASK_LIST, EMAIL_CONFIRMED }
	}
} = require('../../../lib/full-appeal/views');
const { postSaveAndReturn } = require('../../save');
const backLink = `/${EMAIL_CONFIRMED}`;

const getListOfDocuments = (_, res) => {
	res.render(currentPage, { backLink });
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
		return res.render(currentPage, {
			backLink,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getListOfDocuments,
	postListOfDocuments
};
