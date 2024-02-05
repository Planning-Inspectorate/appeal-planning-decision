const { apiClient } = require('#lib/appeals-api-client');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { isAppealSubmission } = require('@pins/common/src/lib/format-address');

const appealSubmissionContinueUrls = {
	[APPEAL_ID.HOUSEHOLDER]: '/appeal-householder-decision/task-list',
	[APPEAL_ID.PLANNING_SECTION_78]: '/full-appeal/submit-appeal/task-list'
};

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	const {
		params: { appealId },
		session: { email }
	} = req;

	if (!appealId)
		throw new Error(`Continue your appeal cannot be invoked without specifying an appeal id`);

	const user = await apiClient.getUserByEmailV2(email);
	const appealSubmission = await apiClient.getUserAppealById({
		userId: user.id,
		appealSubmissionId: appealId
	});

	if (!appealSubmission) throw new Error(`Appeal ${appealId} does not belong to user ${user.id}`);

	if (!isAppealSubmission(appealSubmission))
		throw new Error('Continue your appeal can only be invoked with appeal submissions');

	req.session.appeal = appealSubmission.appeal;

	if (!appealSubmission.appeal?.appealType)
		throw new Error(`Appeal ${appealId} does not have an appeal type`);

	const redirectUrl = appealSubmissionContinueUrls[appealSubmission.appeal.appealType];

	if (!redirectUrl)
		throw new Error(
			`No redirection is available for appeal type ${appealSubmission.appeal.appealType}`
		);

	res.redirect(redirectUrl);
};
