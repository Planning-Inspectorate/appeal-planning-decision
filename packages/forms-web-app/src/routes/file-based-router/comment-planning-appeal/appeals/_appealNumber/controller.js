const { getAppealStatus } = require('#utils/appeal-status');
const { formatCommentDeadlineText } = require('../../../../../utils/format-deadline-text');
const { formatCommentDecidedData } = require('../../../../../utils/format-comment-decided-data');
const { formatCommentHeadlineText } = require('../../../../../utils/format-headline-text');
const { formatHeadlineData } = require('@pins/common');
const { getDepartmentFromCode } = require('../../../../../services/department.service');
const {
	createInterestedPartySession
} = require('../../../../../services/interested-party.service');

/** @type {import('express').Handler} */
const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(appealNumber);

	createInterestedPartySession(req, appealNumber, appeal.siteAddressPostcode);

	const lpa = await getDepartmentFromCode(appeal.LPACode);
	const headlineData = formatHeadlineData(appeal, lpa.name);

	const status = getAppealStatus(appeal);

	const headlineText = formatCommentHeadlineText(appealNumber, status);

	const deadlineText = formatCommentDeadlineText(appeal, status);

	const decidedData = formatCommentDecidedData(appeal);

	res.render(`comment-planning-appeal/appeals/_appealNumber/index`, {
		appeal: {
			...appeal,
			status,
			headlineText,
			deadlineText,
			decidedData
		},
		headlineData
	});
};

module.exports = { selectedAppeal };
