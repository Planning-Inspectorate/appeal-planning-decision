const { formatAddress } = require('#utils/format-address');
const { formatDate } = require('#utils/format-date');
const { sortByCaseDecisionDate } = require('#utils/appeal-sorting');
const { AppealsApiClient } = require('#utils/appeals-api-client');

/** @type {import('express').RequestHandler} */
const decidedAppeals = async (req, res) => {
	const postcode = req.query.search;
	const decidedAppeals = await new AppealsApiClient().getPostcodeSearchResults({
		postcode,
		'decided-only': true
	});

	if (!decidedAppeals.length) {
		return res.redirect(`/comment-appeal/appeal-search-no-results?search=${postcode}`);
	}

	decidedAppeals.forEach((appeal) => {
		appeal.formattedAddress = formatAddress(appeal);
		appeal.formattedCaseDecisionDate = formatDate(appeal.caseDecisionDate);
		appeal.formattedDecisionColour = mapDecisionColour(appeal.outcome);
	});
	decidedAppeals.sort(sortByCaseDecisionDate);

	res.render(`comment-appeal/decided-appeals/index`, { postcode, decidedAppeals });
};

/**
 * @param {string|undefined} decision
 * @returns {string}
 */
const mapDecisionColour = (decision) => {
	const decisionColourMap = new Map([
		['allowed', 'green'],
		['dismissed', 'orange'],
		['allowed in part', 'yellow'],
		['other', 'grey']
	]);

	return (decision && decisionColourMap.get(decision)) || 'grey';
};

module.exports = { decidedAppeals };