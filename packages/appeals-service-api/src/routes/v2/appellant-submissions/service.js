const Repo = require('./repo');
const { rules } = require('@pins/business-rules');
const { mapTypeCodeToAppealId } = require('@pins/common');
const repo = new Repo();
const { docsApiClient } = require('../../../doc-client/docs-api-client');
const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');

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
	/**
	 * @type {string[]}
	 */
	const deletedSubmissions = [];
	try {
		const nonSubmittedSubmissions = await repo.getNonSubmittedSubmissions();
		if (!nonSubmittedSubmissions || nonSubmittedSubmissions.length === 0) {
			return 'No non-submitted submissions to delete';
		}

		await Promise.all(
			nonSubmittedSubmissions.map(async (submission) => {
				const deadlineDate = rules.appeal.deadlineDate(
					submission.applicationDecisionDate,
					mapTypeCodeToAppealId(submission.appealTypeCode),
					submission.applicationDecision
				);

				const currentDate = new Date();
				const threeMonthsPastDeadline = new Date(deadlineDate);
				threeMonthsPastDeadline.setMonth(threeMonthsPastDeadline.getMonth() + 3);

				if (currentDate > threeMonthsPastDeadline) {
					const documents = await repo.getSubmissionDocumentUploads(submission.id);
					await Promise.all(
						documents.map((document) => docsApiClient.deleteSubmissionDocument(document.id))
					);

					await repo.deleteLinkedRecords(submission.id);
					await repo.deleteSubmission(submission.id);

					deletedSubmissions.push(submission.id);
				}
			})
		);

		if (deletedSubmissions.length >= 1) {
			return `Deleted submissions: ${deletedSubmissions.join(', ')}`;
		} else {
			return 'No old non-submitted submissions to delete';
		}
	} catch (e) {
		logger.error({ e }, 'Error deleting old submissions');
		throw ApiError.withMessage(500, 'Error deleting old submissions');
	}
};
