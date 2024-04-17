/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

exports.questions = {
	...require('./questions/a-d'),
	...require('./questions/e-h'),
	...require('./questions/i-l'),
	...require('./questions/m-p'),
	...require('./questions/q-t'),
	...require('./questions/u-x')
};
