const {
	formatTitlePrefix,
	formatParagraphWording,
	formatLink
} = require('./format-no-results-page');

/** @type {import('express').RequestHandler} */
const appealSearchNoResults = async (req, res) => {
	const searchQuery = req.query.search;
	let typeOfSearch = req.query.type;
	const defaultSearchType = 'postcode';

	// handle case if user enters url with no search params
	if (typeOfSearch === undefined) {
		return res.redirect(`enter-postcode`);
	}
	typeOfSearch = typeof typeOfSearch === 'string' ? typeOfSearch : defaultSearchType;

	const pageTitle = formatTitlePrefix(typeOfSearch);
	const pageHeading = pageTitle;
	const paragraph = formatParagraphWording(typeOfSearch);
	const linkToRelatedSearchPage = formatLink(typeOfSearch);

	const decidedAppeals =
		typeOfSearch === 'postcode'
			? await req.appealsApiClient.getPostcodeSearchResults({
					postcode: searchQuery,
					'decided-only': true
			  })
			: [];

	const viewDecidedAppeals = !!decidedAppeals.length;

	res.render(`comment-planning-appeal/appeal-search-no-results/index`, {
		pageTitle,
		pageHeading,
		paragraph,
		linkToRelatedSearchPage,
		searchQuery,
		viewDecidedAppeals,
		typeOfSearch
	});
};

module.exports = { appealSearchNoResults };
