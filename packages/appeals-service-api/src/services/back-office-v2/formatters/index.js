const { APPEAL_ID } = require('@pins/business-rules/src/constants');
/**
 * @typedef {import('src/spec/api-types').AppealSubmission} AppealSubmission
 */

const appealTypeToDirName = {
	[APPEAL_ID.HOUSEHOLDER]: 'has'
};

/**
 * this does "work" (the type is visible in autocomplete etc)
 * we should probably just tighten up what we expect to be in the db
 * @type {{
 *   appeal: Record<AppealSubmission['appeal']['appealType'], (appeal: AppealSubmission['appeal']) => *>,
 *   questionnaire: Record<AppealSubmission['appeal']['appealType'], (questionnaireResponse: *) => *>
 * }}
 */
module.exports = ['appeal', 'questionnaire'].reduce(
	(mod, submittable) => ({
		...mod,
		[submittable]: {
			...Object.entries(appealTypeToDirName).reduce(
				(formatters, [appealType, dirName]) => ({
					...formatters,
					[appealType]: require(`./${dirName}/${submittable}`).formatter
				}),
				{}
			)
		}
	}),
	{}
);
