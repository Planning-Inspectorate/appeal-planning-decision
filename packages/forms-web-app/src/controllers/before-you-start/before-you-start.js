const config = require('../../config');
const { VIEW } = require('../../lib/views');

exports.getBeforeYouStartFirstPage = async (_, res) => {
	res.render(VIEW.BEFORE_YOU_START.FIRST_PAGE, { bannerHtmlOverride: config.betaBannerText });
};

exports.postBeforeYouStartFirstPage = async (req, res) => {
	req.session.appeal = undefined;
	res.redirect('/before-you-start/local-planning-authority');
};
