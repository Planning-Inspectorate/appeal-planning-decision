const { formatAddress } = require('#utils/format-address');
const { formatDate } = require('#utils/format-date');
const { sortByCaseDecisionDate } = require('#utils/appeal-sorting');
const { apiClient } = require('#utils/appeals-api-client');
const { mapDecisionColour } = require('@pins/business-rules/src/utils/decision-outcome');

/** @type {import('express').RequestHandler} */
const decidedAppeals = async (req, res) => {
	const postcode = req.query.search;
	/** @type {import('../../utils/appeals-view').AppealViewModel[]} */
	const decidedAppeals = await apiClient.getPostcodeSearchResults({
		postcode,
		'decided-only': true
	});

	if (!decidedAppeals.length) {
		return res.redirect(`appeal-search-no-results?search=${postcode}`);
	}

	decidedAppeals.forEach((appeal) => {
		appeal.formattedAddress = formatAddress(appeal);
		appeal.formattedCaseDecisionDate = formatDate(appeal.caseDecisionDate);
		appeal.formattedDecisionColour = mapDecisionColour(appeal.outcome);
	});
	decidedAppeals.sort(sortByCaseDecisionDate);

	res.render(`decided-appeals/index`, { postcode, decidedAppeals });
};

module.exports = { decidedAppeals };
