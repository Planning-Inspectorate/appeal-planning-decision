const { APPEAL_ID } = require('@pins/business-rules/src/constants');
/**
 * @typedef {import('src/spec/api-types').AppealSubmission['appeal']} AppealSubmission
 * @typedef {AppealSubmission['appealType']} AppealType
 * @typedef {import('../../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * @template TArg0
 * @template TArg1
 * @template TReturn
 * @typedef {(arg0: TArg0, arg1?: TArg1) => TReturn} Formatter
 */

/**
 * @template TArg0
 * @template TArg1
 * @template TReturn
 * @typedef {Record<AppealType, Formatter<TArg0, TArg1, TReturn>>} Formatters
 */

/**
 * @template TArg0
 * @template TArg1
 * @template TReturn
 * @typedef {Record<string, Formatters<TArg0, TArg1, TReturn>>} Module
 */

const appealTypeToDirName = {
	[APPEAL_ID.HOUSEHOLDER]: 'has'
};

/**
 * @template TArg0
 * @template TArg1
 * @template TReturn
 * @param {string} submittable
 * @returns {(formatters: Formatters<TArg0, TArg1, TReturn>, entries: [AppealType, string]) => Formatters<TArg0, TArg1, TReturn>}
 */
const reduceFormatters =
	(submittable) =>
	(formatters, [appealType, dirName]) => ({
		...formatters,
		[appealType]: require(`./${dirName}/${submittable}`).formatter
	});

/**
 * @template TArg0
 * @template TArg1
 * @template TReturn
 * @type {(mod: Module<TArg0, TArg1, TReturn>, submittable: string) => Module<TArg0, TArg1, TReturn>}
 */
const reduceModules = (mod, submittable) => ({
	...mod,
	[submittable]: {
		...Object.entries(appealTypeToDirName).reduce(reduceFormatters(submittable), {})
	}
});

/**
 * this does "work" (the type is visible in autocomplete etc)
 * we should probably just tighten up what we expect to be in the db
 * @type {{
 *   appeal: Formatters<AppealSubmission, undefined, *>
 *   questionnaire: Formatters<string, LPAQuestionnaireSubmission, *>
 * }}
 */
module.exports = ['appeal', 'questionnaire'].reduce(reduceModules, {});
