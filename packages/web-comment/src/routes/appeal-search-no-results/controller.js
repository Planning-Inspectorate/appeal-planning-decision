const {
	isPostcodeOrReferenceNumber,
	formatTitlePrefix,
	formatParagraphWording,
	formatLink
} = require('./format-no-results-page');

/** @type {import('express').RequestHandler} */
const appealSearchNoResults = async (req, res) => {
	const searchQuery = req.query.search;
	const typeOfSearch = isPostcodeOrReferenceNumber(searchQuery);

	const pageTitle = formatTitlePrefix(typeOfSearch);
	const pageHeading = pageTitle;
	const paragraph = formatParagraphWording(typeOfSearch);
	const linkToRelatedSearchPage = formatLink(typeOfSearch);

	res.render(`appeal-search-no-results/index`, {
		pageTitle,
		pageHeading,
		paragraph,
		linkToRelatedSearchPage,
		searchQuery
	});
};

module.exports = { appealSearchNoResults };
