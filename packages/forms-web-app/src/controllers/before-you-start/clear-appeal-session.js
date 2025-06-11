const clearAppealSession = (req, res) => {
	req.session.appeal = null;
	res.redirect('/before-you-start/local-planning-authority');
};

module.exports = {
	clearAppealSession
};
