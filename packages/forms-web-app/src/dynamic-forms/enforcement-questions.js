const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const RadioQuestion = require('@pins/dynamic-forms/src/dynamic-components/radio/question');

const RequiredValidator = require('@pins/dynamic-forms/src/validator/required-validator');
const StringValidator = require('@pins/dynamic-forms/src/validator/string-validator');
const ConditionalRequiredValidator = require('@pins/dynamic-forms/src/validator/conditional-required-validator');

const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const {
	getConditionalFieldName,
	DIVIDER
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-utils');
const { INTERESTS_IN_LAND } = require('@pins/common/src/constants');
const {
	validation: {
		characterLimits: { appealFormV2 }
	}
} = require('../config');
const { capitalize } = require('../lib/string-functions');
const { createQuestions } = require('@pins/dynamic-forms/src/create-questions');
const interestInLandRadioOverrides = require('../journeys/question-overrides/interest-in-land/interest-in-land-radio');
const interestInLandBooleanOverrides = require('../journeys/question-overrides/interest-in-land/interest-in-land-boolean');

const escape = require('escape-html');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('appeals-service-api').Api.SubmissionIndividual} SubmissionIndividual
 */

/**
 * @typedef {Object} PropsParams
 * @property {string} interestName
 * @property {string} permissionName
 * @property {string} doOrDoes
 * @property {string} haveOrHas
 * @property {object} [customData]
 */

/**
 * @param {JourneyResponse} response
 * @returns
 */
exports.generateInterestInLandQuestionsAndConditions = (response) => {
	if (!response || !response.answers) return [];

	const enforcementWhoIsAppealing = response.answers.enforcementWhoIsAppealing ?? '';

	switch (enforcementWhoIsAppealing) {
		case fieldValues.enforcementWhoIsAppealing.INDIVIDUAL:
			return individualInterestInLandQuestions(response);
		case fieldValues.enforcementWhoIsAppealing.ORGANISATION:
			return organisationInterestInLandQuestions(response);
		case fieldValues.enforcementWhoIsAppealing.GROUP:
			return groupInterestInLandQuestions(response);
		default:
			return [];
	}
};

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const formatEnforcementIndividualName = (response) => {
	const firstName = response.answers['appellantFirstName'] || 'Named';
	const lastName = response.answers['appellantLastName'] || 'Individual';

	return escape(`${firstName} ${lastName}`);
};

/**
 * @param {import('appeals-service-api').Api.SubmissionIndividual} individual
 * @return {string}
 */
const formatIndividual = (individual) => {
	const firstName = individual.firstName || 'Named';
	const lastName = individual.lastName || 'Individual';
	return escape(`${firstName} ${lastName}`);
};

/**
 * @param {JourneyResponse['answers'] | SubmissionIndividual} answers
 * @param {string} individualId
 * @returns {boolean}
 */
const individualInterestInLandIsOther = (answers, individualId) => {
	// @type SubmissionIndividual
	const individual = answers['SubmissionIndividual'].find((i) => i.id === individualId);

	return interestInLandIsOther(individual);
};

/**
 * @param {JourneyResponse['answers'] | SubmissionIndividual} input
 * @returns {boolean}
 */
const interestInLandIsOther = (input) => input.interestInAppealLand === INTERESTS_IN_LAND.OTHER;

/**
 * @param {JourneyResponse} response
 * @returns
 */
const individualInterestInLandQuestions = (response) => {
	const { isAppellant } = response.answers;

	const responseName = formatEnforcementIndividualName(response);

	const propsParams = isAppellant
		? {
				interestName: 'your',
				permissionName: 'you',
				doOrDoes: 'Do',
				haveOrHas: 'have'
			}
		: {
				interestName: `${responseName}'s`,
				permissionName: responseName,
				doOrDoes: 'Does',
				haveOrHas: 'has'
			};

	const questionProps = getProps(propsParams);

	const questionObjects = getInterestInLandQuestionObjects(questionProps);

	return [
		{
			question: questionObjects.interestInLand
		},
		{
			question: questionObjects.permissionToUseLand,
			condition: () => interestInLandIsOther(response.answers)
		}
	];
};

/**
 * @param {JourneyResponse} response
 * @returns
 */
const organisationInterestInLandQuestions = (response) => {
	const organisationName = response.answers['enforcementOrganisationName'] || 'Named Company';

	const propsParams = {
		interestName: `${organisationName}'s`,
		permissionName: `${organisationName}`,
		doOrDoes: 'Does',
		haveOrHas: 'has'
	};

	const questionProps = getProps(propsParams);

	const questionObjects = getInterestInLandQuestionObjects(questionProps);

	return [
		{
			question: questionObjects.interestInLand
		},
		{
			question: questionObjects.permissionToUseLand,
			condition: () => interestInLandIsOther(response.answers)
		}
	];
};

/**
 * @param {JourneyResponse} response
 * @returns
 */
const groupInterestInLandQuestions = (response) => {
	const baseIndividuals = response.answers['SubmissionIndividual'] || [];

	const individuals = Array.isArray(baseIndividuals) ? [...baseIndividuals] : [baseIndividuals];

	if (!individuals.length) {
		return [];
	}

	return individuals.flatMap((individual) => {
		const name = formatIndividual(individual);
		const propsParams = {
			interestName: `${name}'s`,
			permissionName: name,
			doOrDoes: 'Does',
			haveOrHas: 'has',
			customData: {
				individualId: individual.id
			}
		};

		const questionProps = getProps(propsParams);

		const questionObjects = getInterestInLandQuestionObjects(
			questionProps,
			questionMethodOverrides
		);

		console.log('say word em up');
		console.log(questionObjects);

		return [
			{
				question: questionObjects.interestInLand
			},
			{
				question: questionObjects.permissionToUseLand,
				condition: () => individualInterestInLandIsOther(response.answers, individual.id)
			}
		];
	});
};

/**
 * @param {PropsParams} propsParams
 * @returns
 */
const getProps = (propsParams) => {
	const { interestName, permissionName, doOrDoes, haveOrHas, customData } = propsParams;
	const urlExtension = customData?.individualId ? `-${customData.individualId}` : '';
	return {
		interestInLand: {
			type: 'radio',
			title: `What is ${interestName} interest in the land?`,
			question: `What is ${interestName} interest in the land?`,
			fieldName: `interestInAppealLand${urlExtension}`,
			url: `land-interest${urlExtension}`,
			validators: [
				new RequiredValidator(`Select ${interestName} interest in the land`),
				new ConditionalRequiredValidator(`Enter ${interestName} interest in the land?`),
				new StringValidator({
					maxLength: {
						maxLength: appealFormV2.textInputMaxLength,
						maxLengthMessage: `${capitalize(interestName)} interest in the land must be ${appealFormV2.textInputMaxLength} characters or less`
					},
					fieldName: getConditionalFieldName(`interestInAppealLand`, 'interestInAppealLandDetails')
				})
			],
			options: [
				{
					text: 'Owner',
					value: INTERESTS_IN_LAND.OWNER
				},
				{
					text: 'Tenant',
					value: INTERESTS_IN_LAND.TENANT
				},
				{
					text: 'Mortgage lender',
					value: INTERESTS_IN_LAND.MORTGAGE_LENDER
				},
				{
					[DIVIDER]: 'or'
				},
				{
					text: 'Other',
					value: INTERESTS_IN_LAND.OTHER,
					conditional: {
						question: 'Enter interest in the land',
						fieldName: 'interestInAppealLandDetails',
						type: 'textarea'
					}
				}
			],
			customData
		},
		permissionToUseLand: {
			type: 'boolean',
			title: `${doOrDoes} ${permissionName} have written or verbal permission to use the land?`,
			question: `${doOrDoes} ${permissionName} have written or verbal permission to use the land?`,
			hint: `Only select yes if ${permissionName} ${haveOrHas} permission to use the land today and on the enforcement notice issue date.`,
			fieldName: `hasPermissionToUseLand${urlExtension}`,
			url: `land-permission${urlExtension}`,
			validators: [
				new RequiredValidator(
					`Select yes if ${permissionName} ${haveOrHas} written or verbal permission to use the land`
				)
			],
			customData
		}
	};
};

/** @type {Record<string, typeof import('@pins/dynamic-forms/src/question')>} */
const questionClasses = {
	// @ts-ignore
	boolean: BooleanQuestion,
	// @ts-ignore
	radio: RadioQuestion
};

const questionMethodOverrides = {
	boolean: interestInLandBooleanOverrides,
	radio: interestInLandRadioOverrides
};

const getInterestInLandQuestionObjects = (props, overrides = {}) =>
	createQuestions(props, questionClasses, overrides);
