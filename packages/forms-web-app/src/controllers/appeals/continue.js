const { apiClient } = require('#lib/appeals-api-client');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { isAppealSubmission, isV2Submission } = require('@pins/common/src/lib/format-address');

const appealSubmissionContinueUrls = {
	[APPEAL_ID.HOUSEHOLDER]: '/appeal-householder-decision/task-list',
	[APPEAL_ID.PLANNING_SECTION_78]: '/full-appeal/submit-appeal/task-list'
};

const v2SubmissionDynamicContinueUrls = {
	v2Has: (submissionId) => `/appeals/householder/appeal-form/your-appeal?id=${submissionId}`
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

	const userAppeals = await apiClient.getUserAppealsById(user.id);

	const appealSubmission = userAppeals.find(
		(appeal) => appeal.id === appealId || appeal._id === appealId
	);

	if (!appealSubmission) throw new Error(`Appeal ${appealId} does not belong to user ${user.id}`);

	if (isAppealSubmission(appealSubmission)) {
		// v1 submission
		req.session.appeal = appealSubmission.appeal;

		const appealType = appealSubmission.appeal?.appealType;

		if (!appealType) throw new Error(`Appeal ${appealId} does not have an appeal type`);

		const redirectUrl = appealSubmissionContinueUrls[appealType];

		if (!redirectUrl) throw new Error(`No redirection is available for appeal type ${appealType}`);

		return res.redirect(redirectUrl);
	} else if (isV2Submission(appealSubmission)) {
		// v2 submission
		req.session.appeal = appealSubmission;

		const appealTypeCode = appealSubmission?.AppellantSubmission?.appealTypeCode;

		if (!appealTypeCode) throw new Error(`Appeal ${appealId} does not have an appeal type code`);

		const redirectUrl = v2SubmissionDynamicContinueUrls.v2Has(
			appealSubmission?.AppellantSubmission?.id
		);

		if (!redirectUrl)
			throw new Error(`No redirection is available for appeal type ${appealTypeCode}`);

		return res.redirect(redirectUrl);
	} else {
		throw new Error('Continue your appeal can only be invooked with appeal submissions');
	}
};
