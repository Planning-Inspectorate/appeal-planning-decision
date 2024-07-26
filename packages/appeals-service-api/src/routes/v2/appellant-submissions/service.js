const Repo = require('./repo');
const { rules } = require('@pins/business-rules');
const { mapTypeCodeToAppealId } = require('@pins/common');
const repo = new Repo();

/**
 * @typedef {import('@prisma/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionCreateInput} AppellantSubmissionCreateInput
 */

/**
 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.put = async ({ userId, data }) => {
	return await repo.put({ userId, data });
};

/**
 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.post = async ({ userId, data }) => {
	return await repo.post({ userId, data });
};

/**
 * Clean up old non-submitted appellant submissions
 * @returns {Promise<string>}
 */
exports.deleteOldSubmissions = async () => {
	const nonSubmittedSubmissions = await repo.getNonSubmittedSubmissions();
	const deletedSubmissions = [];

	for (const submission of nonSubmittedSubmissions) {
		const deadlineDate = rules.appeal.deadlineDate(
			submission.applicationDecisionDate,
			mapTypeCodeToAppealId(submission.appealTypeCode),
			submission.applicationDecision
		);

		const currentDate = new Date();
		const threeMonthsPastDeadline = new Date(deadlineDate);
		threeMonthsPastDeadline.setMonth(threeMonthsPastDeadline.getMonth() + 3);

		if (currentDate > threeMonthsPastDeadline) {
			await repo.deleteLinkedRecords(submission.id);

			await repo.deleteSubmission(submission.id);

			deletedSubmissions.push(submission.id);
		}
	}

	return `Deleted submissions: ${deletedSubmissions.join(', ')}`;
};
