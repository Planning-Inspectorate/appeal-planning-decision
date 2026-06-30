const { getUserFromSession } = require('../../services/user.service');
const { mapToLPADashboardDisplayData } = require('../../lib/dashboard-functions');
const { sortByCaseDecisionDate } = require('@pins/common/src/lib/appeal-sorting');
const { filterAppealsWithinGivenDate } = require('../../lib/filter-decided-appeals');
const { filterTime } = require('../../config');
const { APPEAL_CASE_VALIDATION_OUTCOME } = require('@planning-inspectorate/data-model');
const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const { isNotTransferred } = require('@pins/business-rules/src/lib/filter-transferred-appeal');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	const user = getUserFromSession(req);

	const appealsCaseData = await req.appealsApiClient.getDecidedAppealsCaseDataV2(user.lpaCode);

	const appealsForDisplay = appealsCaseData
		.filter((appeal) => isNotWithdrawn(appeal))
		.filter((appeal) => isNotTransferred(appeal))
		// invalid appeals from appellant case validation are not displayed on decided dashboard
		.filter((appeal) => appeal.caseValidationOutcome !== APPEAL_CASE_VALIDATION_OUTCOME.INVALID);

	appealsForDisplay.sort(sortByCaseDecisionDate);

	const decidedAppeals = appealsForDisplay
		.map(mapToLPADashboardDisplayData)
		.filter((appeal) =>
			filterAppealsWithinGivenDate(
				appeal,
				'caseDecisionOutcomeDate',
				filterTime.FIVE_YEARS_IN_MILISECONDS
			)
		);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName,
		decidedAppeals: decidedAppeals,
		yourAppealsLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getDecidedAppeals
};
