const { formatAddress } = require('@pins/common/src/lib/format-address');
const { formatDate } = require('#utils/format-date');
const { sortByCaseDecisionDate } = require('#utils/appeal-sorting');
const { mapDecisionColour } = require('@pins/business-rules/src/utils/decision-outcome');
const { APPEAL_CASE_DECISION_OUTCOME } = require('pins-data-model');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

/** @type {import('express').RequestHandler} */
const decidedAppeals = async (req, res) => {
	const postcode = req.query.search;
	/** @type {import('#utils/appeals-view').AppealViewModel[]} */
	const decidedAppeals = await req.appealsApiClient.getPostcodeSearchResults({
		postcode,
		'decided-only': true
	});

	if (!decidedAppeals.length) {
		return res.redirect(`appeal-search-no-results?search=${postcode}`);
	}

	decidedAppeals.forEach((appeal) => {
		appeal.formattedAddress = formatAddress(appeal);
		appeal.formattedCaseDecisionDate = formatDate(appeal.caseDecisionOutcomeDate);
		appeal.formattedDecisionColour = mapDecisionColour(appeal.caseDecisionOutcome);
		appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);
		appeal.caseDecisionOutcome =
			appeal.caseDecisionOutcome in APPEAL_CASE_DECISION_OUTCOME
				? APPEAL_CASE_DECISION_OUTCOME[appeal.caseDecisionOutcome].name
				: appeal.caseDecisionOutcome;
	});

	decidedAppeals.sort(sortByCaseDecisionDate);

	res.render(`comment-planning-appeal/decided-appeals/index`, { postcode, decidedAppeals });
};

module.exports = { decidedAppeals };
