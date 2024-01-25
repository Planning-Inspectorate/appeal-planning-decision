const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference
} = require('#utils/appeal-sorting');
const { formatAddress } = require('@pins/common/src/lib/format-address');
const { apiClient } = require('#utils/appeals-api-client');

/** @type {import('express').RequestHandler} */
const appeals = async (req, res) => {
	const postcode = req.query.search;
	/** @type {import('../../utils/appeals-view').AppealViewModel[]} */
	const postcodeSearchResults = await apiClient.getPostcodeSearchResults({
		postcode,
		'with-appellant': true
	});

	if (!postcodeSearchResults.length) {
		return res.redirect(`appeal-search-no-results?search=${postcode}`);
	}

	postcodeSearchResults.forEach((appeal) => (appeal.formattedAddress = formatAddress(appeal)));

	const openAppeals = getOpenAppeals(postcodeSearchResults);
	openAppeals.sort(sortByInterestedPartyRepsDueDate);

	const closedAppeals = getClosedAppeals(postcodeSearchResults);
	closedAppeals.sort(sortByCaseReference);

	res.render(`appeals/index`, { postcode, openAppeals, closedAppeals });
};

module.exports = { appeals };
