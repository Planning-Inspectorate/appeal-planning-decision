const { add, sub, format: formatDate } = require('date-fns');
const escape = require('escape-html');
const { DIVIDER } = require('@pins/dynamic-forms/src/dynamic-components/utils/question-utils');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const defaultHtml = 'resources/site-address/site-address.html';
const enforcementHtml = 'resources/enforcement/site-address.html';

/**
 * @param {'past' | 'future'} tense
 * @param {number} days
 * @return {string} returns date string in d M yyyy format
 */
exports.getExampleDate = (tense, days = 60) =>
	formatDate(
		{
			past: sub,
			future: add
		}[tense](new Date(), { days }),
		'd M yyyy'
	);

/**
 * @param {import('appeals-service-api').Api.SubmissionIndividual} individual
 * @return {import('@pins/dynamic-forms/src/question-props').Option}
 */
const formatIndividualOption = (individual) => {
	const firstName = individual.firstName || 'Named';
	const lastName = individual.lastName || 'Individual';
	const id = individual.id || 'Id';
	return {
		text: escape(`${firstName} ${lastName}`),
		value: escape(`${id}`)
	};
};

/**
 * @param {import('@pins/dynamic-forms/src/journey-response').JourneyResponse | undefined} response
 * @return {Array<import('@pins/dynamic-forms/src/question-props').Option>}
 */
exports.formatEnforcementSelectNamesOptions = (response) => {
	if (!response || !response.answers) return [];

	const baseIndividuals = response.answers['SubmissionIndividual'] || [];

	const individuals = Array.isArray(baseIndividuals) ? baseIndividuals : [baseIndividuals];

	if (!individuals.length) {
		return [];
	}

	const dynamicOptions = individuals.map(formatIndividualOption);

	dynamicOptions.push({
		[DIVIDER]: 'or'
	});

	dynamicOptions.push({
		text: 'I am appealing on behalf of the group of individuals',
		value: 'None'
	});

	return dynamicOptions;
};

/**
 * @param {import('@pins/dynamic-forms/src/journey-response').JourneyResponse | undefined} response
 * @return {string}
 */
exports.getAppealSiteHtmlByAppealType = (response) => {
	if (!response || !response.answers) return '';

	const appealTypeCode = response.answers.appealTypeCode;

	return appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode ? enforcementHtml : defaultHtml;
};
