/**
 * @type {import('express').RequestHandler}
 */
const getEmailConfirmed = async (req, res) => {
	const listOfDocumentsUrl = '/appeals/householder/appeal-form/before-you-start';

	return res.render('appeal-householder-decision/email-address-confirmed', {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
