const clearAppealSession = (req, res) => {
	req.session.appeal = null;
	res.status(200).send({ message: 'Session cleared' });
};

module.exports = {
	clearAppealSession
};
