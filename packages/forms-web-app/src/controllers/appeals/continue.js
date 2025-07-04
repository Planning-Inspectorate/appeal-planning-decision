const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { isAppealSubmission, isV2Submission } = require('@pins/common/src/lib/format-address');

const appealSubmissionContinueUrls = {
	[APPEAL_ID.HOUSEHOLDER]: '/appeal-householder-decision/task-list',
	[APPEAL_ID.PLANNING_SECTION_78]: '/full-appeal/submit-appeal/task-list'
};

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	const {
		params: { appealId }
	} = req;

	req.session.navigationHistory.shift();

	if (!appealId)
		throw new Error(`Continue your appeal cannot be invoked without specifying an appeal id`);

	const userAppeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.APPELLANT);

	const appealSubmission = userAppeals.find(
		(appeal) => appeal.id === appealId || appeal._id === appealId
	);

	if (!appealSubmission) throw new Error(`Appeal ${appealId} does not belong to user`);

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

		const friendlyUrl = caseTypeLookup(appealTypeCode, 'processCode')?.friendlyUrl;
		if (!friendlyUrl) throw new Error(`Appeal ${appealId} does not have a valid appeal type code`);

		const redirectUrl = v2SubmissionDynamicContinueUrls(
			friendlyUrl,
			appealSubmission?.AppellantSubmission?.id
		);

		if (!redirectUrl)
			throw new Error(`No redirection is available for appeal type ${appealTypeCode}`);

		return res.redirect(redirectUrl);
	} else {
		throw new Error('Continue your appeal can only be invoked with appeal submissions');
	}
};

/**
 *
 * @param {string} appealUrlStub
 * @param {string} submissionId
 * @returns {string}
 */
const v2SubmissionDynamicContinueUrls = (appealUrlStub, submissionId) =>
	`/appeals/${appealUrlStub}/appeal-form/your-appeal?id=${submissionId}`;
