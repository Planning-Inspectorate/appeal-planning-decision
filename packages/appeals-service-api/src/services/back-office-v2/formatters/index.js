const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { existsSync } = require('fs');
const path = require('path');

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
	[APPEAL_ID.HOUSEHOLDER]: 'has',
	[APPEAL_ID.PLANNING_SECTION_78]: 's78'
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
	(formatters, [appealType, dirName]) => {
		const requireableFormatterPath = `./${dirName}/${submittable}`;
		const fullFormatterPath = path.join(__dirname, requireableFormatterPath) + '.js';
		const formatterFileExists = existsSync(fullFormatterPath);
		if (!formatterFileExists) {
			console.warn(`No formatter file found at ${fullFormatterPath}`);
			return formatters;
		}
		const formatterModule = require(requireableFormatterPath);
		if (!formatterModule.formatter) {
			console.warn(`No formatter function found in  file found at ${fullFormatterPath}`);
			return formatters;
		}
		return {
			...formatters,
			[appealType]: formatterModule.formatter
		};
	};

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
