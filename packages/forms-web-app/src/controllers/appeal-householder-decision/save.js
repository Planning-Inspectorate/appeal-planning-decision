const { saveAppeal } = require('../../lib/appeals-api-wrapper');

const postSaveAndReturn = async (req, res) => {
	req.session.navigationHistory.shift();
	await saveAppeal(req.session.appeal);
	res.redirect('/appeal-householder-decision/application-saved');
};

module.exports = {
	postSaveAndReturn
};
