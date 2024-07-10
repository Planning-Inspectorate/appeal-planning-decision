const {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference
} = require('#utils/appeal-sorting');
const { formatAddress } = require('@pins/common/src/lib/format-address');
const { SERVICE_USER_TYPE } = require('pins-data-model');

/** @type {import('express').RequestHandler} */
const appeals = async (req, res) => {
	const postcode = req.query.search;
	/** @type {import('#utils/appeals-view').AppealViewModel[]} */
	const postcodeSearchResults = await req.appealsApiClient.getPostcodeSearchResults({
		postcode,
		'with-appellant': true
	});

	if (!postcodeSearchResults.length) {
		return res.redirect(`appeal-search-no-results?search=${postcode}&type=postcode`);
	}

	postcodeSearchResults.forEach((appeal) => {
		const appellant = appeal.users.find((x) => x.serviceUserType === SERVICE_USER_TYPE.APPELLANT);
		if (appellant) {
			appeal.appellantFirstName = appellant.firstName;
			appeal.appellantLastName = appellant.lastName;
		}
		appeal.formattedAddress = formatAddress(appeal);
		return appeal;
	});

	const openAppeals = getOpenAppeals(postcodeSearchResults);
	openAppeals.sort(sortByInterestedPartyRepsDueDate);

	const closedAppeals = getClosedAppeals(postcodeSearchResults);
	closedAppeals.sort(sortByCaseReference);

	res.render(`comment-planning-appeal/appeals/index`, { postcode, openAppeals, closedAppeals });
};

module.exports = { appeals };
