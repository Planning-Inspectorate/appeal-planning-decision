const setLocalslDisplayCookieBannerValue = (req, res, next) => {
	res.locals.displayCookieBanner = !req.cookies.cookie_policy;
	next();
};

module.exports = { setLocalslDisplayCookieBannerValue };
