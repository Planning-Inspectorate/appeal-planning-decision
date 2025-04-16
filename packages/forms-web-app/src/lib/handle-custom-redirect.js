/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const handleCustomRedirect = (req, res) => {
	const redirect = req.session.loginRedirect;
	delete req.session.loginRedirect;
	res.redirect(redirect);
};

module.exports = { handleCustomRedirect };
