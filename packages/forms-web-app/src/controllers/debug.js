const isValidDate = (dateString) => {
	const timestamp = Date.parse(dateString);
	return !isNaN(timestamp);
};

const setCommentDeadline = async (req, res) => {
	const { deadline } = req.query;

	if (!isValidDate(deadline)) {
		delete req.session.finalCommentOverrideExpiryDate;
		return res.sendStatus(400);
	}

	const date = new Date(deadline);
	req.session.finalCommentOverrideExpiryDate = date;
	return res.sendStatus(200);
};

const createHASAppeal = async (req, res) => {
	const data = await req.appealsApiClient.createAppellantSubmission({
		LPACode: 'Q9999',
		appealTypeCode: 'HAS'
	});
	return res.status(200).send(data);
};

module.exports = {
	setCommentDeadline,
	createHASAppeal
};
