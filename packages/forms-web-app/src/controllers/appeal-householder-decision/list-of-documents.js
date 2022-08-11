const {
	VIEW: { LIST_OF_DOCUMENTS }
} = require('../../lib/views');

const logger = require('../../lib/logger');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const getListOfDocuments = (req, res) => {
	const { typeOfPlanningApplication } = req.session.appeal;

	res.render(LIST_OF_DOCUMENTS, {
		typeOfPlanningApplication
	});
};

const postListOfDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;

	try {
		if (req.body['save-and-return'] !== '') {
			return res.redirect('/appeal-householder-decision/task-list');
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
