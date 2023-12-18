const { formatAddress } = require('../../../utils/formatAddress');
const { formatDate } = require('../../../utils/formatDate');
const { sortByCaseDecisionDate } = require('../../../utils/appealSorting');
const { AppealsApiClient } = require('../../../utils/appealsApiClient');

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
		appeal.formattedDecisionColour = mapDecisionColour(appeal.decision);
	});
	decidedAppeals.sort(sortByCaseDecisionDate);

	res.render(`comment-appeal/decided-appeals/index`, { postcode, decidedAppeals });
};

/**
 * @param {string} decision
 * @returns {string}
 */
const mapDecisionColour = (decision) => {
	const decisionColourMap = new Map([
		['allowed', 'green'],
		['dismissed', 'orange'],
		['allowed in part', 'yellow'],
		['other', 'grey']
	]);

	return decisionColourMap.get(decision) || 'grey';
};

module.exports = { decidedAppeals };
