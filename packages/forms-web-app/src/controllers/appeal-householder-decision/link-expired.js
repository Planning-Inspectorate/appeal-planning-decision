const getLinkExpired = (_, res) => {
	res.render('appeal-householder-decision/link-expired', {
		sendNewLinkUrl: '/appeal-householder-decision/sent-another-link'
	});
};

module.exports = { getLinkExpired };
