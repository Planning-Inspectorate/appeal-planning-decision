const getEmailConfirmed = async (req, res) => {
	const listOfDocumentsUrl = 'list-of-documents';
	res.render('appeal-householder-decision/email-address-confirmed', {
		listOfDocumentsUrl
	});
};

module.exports = {
	getEmailConfirmed
};
