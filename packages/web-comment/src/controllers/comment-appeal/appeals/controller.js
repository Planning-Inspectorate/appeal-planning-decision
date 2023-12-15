const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference
} = require('../../../utils/appealSorting');
const { formatAddress } = require('../../../utils/formatAddress');
const { AppealsApiClient } = require('../../../utils/appealsApiClient');

const appeals = async (req, res) => {
	const postcode = req.query.search;
	const postcodeSearchResults = await new AppealsApiClient().getPostcodeSearchResults({
		postcode,
		'with-appellant': true
	});

	if (!postcodeSearchResults.length) {
		return res.redirect(`/comment-appeal/appeal-search-no-results?search=${postcode}`);
	}

	postcodeSearchResults.forEach((appeal) => (appeal.formattedAddress = formatAddress(appeal)));

	const openAppeals = getOpenAppeals(postcodeSearchResults);
	openAppeals.sort(sortByInterestedPartyRepsDueDate);

	const closedAppeals = getClosedAppeals(postcodeSearchResults);
	closedAppeals.sort(sortByCaseReference);

	res.render(`comment-appeal/appeals/index`, { postcode, openAppeals, closedAppeals });
};

module.exports = { appeals };
