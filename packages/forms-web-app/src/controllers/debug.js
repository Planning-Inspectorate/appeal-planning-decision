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

const radios = async (req, res) => {
	res.render('debug-radios');
};

const radios2 = async (req, res) => {
	res.render('debug-radios2');
};

const radios3 = async (req, res) => {
	res.render('debug-radios3');
};

const radios4 = async (req, res) => {
	res.render('debug-radios4');
};

const radios5 = async (req, res) => {
	res.render('debug-radios5');
};

module.exports = {
	setCommentDeadline,
	radios,
	radios2,
	radios3,
	radios4,
	radios5
};
