const logger = require('../../lib/logger');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const getListOfDocuments = (req, res) => {
	res.render('appeal-householder-decision/list-of-documents');
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
		return res.render('appeal-householder-decision/list-of-documents', {
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getListOfDocuments,
	postListOfDocuments
};
