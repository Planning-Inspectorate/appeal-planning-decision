const { getAppealStatus } = require('#utils/appeal-status');
const { formatCommentDeadlineText } = require('#utils/format-deadline-text');
const { formatHeadlineData, formatRows } = require('@pins/common');
const { appealSubmissionRows } = require('./ip-appeal-submission-rows');
const { applicationRows } = require('./ip-application-rows');
const { getDepartmentFromCode } = require('../../../../../services/department.service');
const {
	createInterestedPartySession
} = require('../../../../../services/interested-party.service');

/** @type {import('express').Handler} */
const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	createInterestedPartySession(req, appealNumber);

	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(appealNumber);

	const lpa = await getDepartmentFromCode(appeal.LPACode);
	const headlineData = formatHeadlineData(appeal, lpa.name);

	const status = getAppealStatus(appeal);

	const deadlineText = formatCommentDeadlineText(appeal, status);

	const submissionRows = appealSubmissionRows(appeal);
	const appealSubmission = formatRows(submissionRows, appeal);

	const originalApplicationRows = applicationRows(appeal);
	const application = formatRows(originalApplicationRows, appeal);

	res.render(`comment-planning-appeal/appeals/_appealNumber/index`, {
		appeal: {
			...appeal,
			status,
			deadlineText,
			appealSubmission,
			application
		},
		headlineData
	});
};

module.exports = { selectedAppeal };
