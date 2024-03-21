const { getAppealStatus } = require('#utils/appeal-status');
const { apiClient } = require('#utils/appeals-api-client');
const { formatDeadlineText } = require('#utils/format-deadline-text');
const { formatHeadlineData, formatRows } = require('@pins/common');
const { appealSubmissionRows } = require('./ip-appeal-submission-rows');
const { applicationRows } = require('./ip-application-rows');

/** @type {import('express').Handler} */
const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const appeal = await apiClient.getAppealCaseByCaseRef(appealNumber);

	const headlineData = formatHeadlineData(appeal);

	const status = getAppealStatus(appeal);

	const deadlineText = formatDeadlineText(appeal, status);

	const submissionRows = appealSubmissionRows(appeal);
	const appealSubmission = formatRows(submissionRows, appeal);

	const originalApplicationRows = applicationRows(appeal);
	const application = formatRows(originalApplicationRows, appeal);

	res.render(`appeals/_appealNumber/index`, {
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
