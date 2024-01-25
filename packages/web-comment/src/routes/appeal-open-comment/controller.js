/** @type {import('express').RequestHandler} */
const appealOpenComment = async (req, res) => {
	res.render(`appeal-open-comment/index`);
};

module.exports = { appealOpenComment };
