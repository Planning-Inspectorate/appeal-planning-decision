const { getAppealStatus } = require('#utils/appeal-status');
const { formatCommentDeadlineText } = require('../../../../../utils/format-deadline-text');
const { formatCommentDecidedData } = require('../../../../../utils/format-comment-decided-data');
const { formatCommentHeadlineText } = require('../../../../../utils/format-headline-text');
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

	const headlineText = formatCommentHeadlineText(appealNumber, status);

	const deadlineText = formatCommentDeadlineText(appeal, status);

	const submissionRows = appealSubmissionRows(appeal);
	// For MVP we are only displaying headlines for decided appeals
	const appealSubmission = status === 'decided' ? [] : formatRows(submissionRows, appeal);

	const originalApplicationRows = applicationRows(appeal);
	// For MVP we are only displaying headlines for decided appeals
	const application = status === 'decided' ? [] : formatRows(originalApplicationRows, appeal);

	const decidedData = formatCommentDecidedData(appeal);

	res.render(`comment-planning-appeal/appeals/_appealNumber/index`, {
		appeal: {
			...appeal,
			status,
			headlineText,
			deadlineText,
			appealSubmission,
			application,
			decidedData
		},
		headlineData
	});
};

module.exports = { selectedAppeal };
