exports.getBeforeYouStartFirstPage = async (req, res) => {
	req.session.appeal = undefined;
	res.redirect('/before-you-start/local-planning-authority');
};
