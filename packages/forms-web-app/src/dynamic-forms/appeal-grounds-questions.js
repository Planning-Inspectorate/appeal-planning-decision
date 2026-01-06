/*********************************************************
 * This file holds the definitions for questions used    *
 * in enforcement notice appeals.                        *
 *********************************************************/

// question classes
const MultiFileUploadQuestion = require('@pins/dynamic-forms/src/dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const TextEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/text-entry/question');
const CheckboxQuestion = require('@pins/dynamic-forms/src/dynamic-components/checkbox/question');

// validators
const RequiredValidator = require('@pins/dynamic-forms/src/validator/required-validator');
const RequiredFileUploadValidator = require('@pins/dynamic-forms/src/validator/required-file-upload-validator');
const MultifileUploadValidator = require('@pins/dynamic-forms/src/validator/multifile-upload-validator');
const StringValidator = require('@pins/dynamic-forms/src/validator/string-validator');

const { documentTypes } = require('@pins/common');
const multiFileUploadOverrides = require('../journeys/question-overrides/multi-file-upload');
const appealGroundsBooleanOverrides = require('../journeys/question-overrides/appeal-grounds/appeal-grounds-boolean');
const appealGroundsTextEntryOverrides = require('../journeys/question-overrides/appeal-grounds/appeal-grounds-text-entry');
const appealGroundsCheckboxOverrides = require('../journeys/question-overrides/appeal-grounds/appeal-grounds-checkbox');

const {
	validation: {
		characterLimits: { appealFormV2 }
	},
	fileUpload: {
		pins: { allowedFileTypes, maxFileUploadSize }
	}
} = require('../config');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/question-props').QuestionProps} QuestionProps
 */

const defaultFileUploadValidatorParams = {
	allowedFileTypes: Object.values(allowedFileTypes),
	maxUploadSize: maxFileUploadSize
};

const supportingDocTypesLookup = {
	a: documentTypes.groundASupportingDocuments,
	b: documentTypes.groundBSupportingDocuments,
	c: documentTypes.groundCSupportingDocuments,
	d: documentTypes.groundDSupportingDocuments,
	e: documentTypes.groundESupportingDocuments,
	f: documentTypes.groundFSupportingDocuments,
	g: documentTypes.groundGSupportingDocuments
};

/**
 * @param {JourneyResponse} response
 * @param {'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'} appealGround
 * @returns {boolean}
 */
const responseHasAppealGround = (response, appealGround) => {
	const baseSubmittedAppealGrounds = response.answers['SubmissionAppealGround'] || [];

	const submittedAppealGrounds = Array.isArray(baseSubmittedAppealGrounds)
		? baseSubmittedAppealGrounds
		: [baseSubmittedAppealGrounds];

	if (!submittedAppealGrounds.length) return false;

	return submittedAppealGrounds.some((ground) => ground.groundName === appealGround);
};

/**
 * @param {JourneyResponse} response
 * @param {'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'} appealGround
 * @returns {boolean}
 */
const responseAppealGroundHasDocuments = (response, appealGround) => {
	const baseSubmittedAppealGrounds = response.answers['SubmissionAppealGround'] || [];

	const submittedAppealGrounds = Array.isArray(baseSubmittedAppealGrounds)
		? baseSubmittedAppealGrounds
		: [baseSubmittedAppealGrounds];

	if (!submittedAppealGrounds.length) return false;

	const relevantGround = submittedAppealGrounds.find(
		(ground) => ground.groundName === appealGround
	);

	return relevantGround?.addSupportingDocuments === true;
};

/**
 * @param {JourneyResponse} response
 * @param {'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'} appealGround
 * @returns {Array<{question: QuestionProps, condition?: () => boolean}>}
 */
// eslint-disable-next-line no-unused-vars
const getCommonAppealGroundsQuestionProps = (response, appealGround) => [
	{
		question: {
			type: 'text-entry',
			title: `Facts for ground (${appealGround})`,
			question: `Facts for ground (${appealGround})`,
			fieldName: `facts-${appealGround}`,
			url: `facts-ground-${appealGround}`,
			html: 'resources/enforcement/appeal-ground-facts.html',
			validators: [
				new RequiredValidator(`Enter facts for ground (${appealGround})`),
				new StringValidator({
					maxLength: {
						maxLength: appealFormV2.textInputMaxLength,
						maxLengthMessage: `Your description must be ${appealFormV2.textInputMaxLength} characters or less`
					}
				})
			],
			customData: {
				groundName: appealGround
			}
		},
		condition: () => responseHasAppealGround(response, `${appealGround}`)
	},
	{
		question: {
			type: 'boolean',
			title: `Do you have any documents to support your ground (${appealGround}) facts?`,
			question: `Do you have any documents to support your ground (${appealGround}) facts?`,
			fieldName: `addSupportingDocuments-${appealGround}`,
			url: `facts-ground-${appealGround}-supporting-documents`,
			validators: [
				new RequiredValidator(
					`Select yes if you have any documents to support your ground (${appealGround}) facts`
				)
			],
			customData: {
				groundName: appealGround
			}
		},
		condition: () => responseHasAppealGround(response, `${appealGround}`)
	},
	{
		question: {
			type: 'multi-file-upload',
			title: `Upload your ground (${appealGround}) supporting documents`,
			question: `Upload your ground (${appealGround}) supporting documents`,
			fieldName: `uploadGround${appealGround.toUpperCase()}Supporting`,
			url: `upload-facts-ground-${appealGround}-supporting-documents`,
			validators: [
				new RequiredFileUploadValidator(
					`Select your ground (${appealGround}) supporting documents`
				),
				new MultifileUploadValidator(defaultFileUploadValidatorParams)
			],
			documentType: supportingDocTypesLookup[appealGround],
			actionHiddenText: `your ground (${appealGround}) supporting documents`
		},
		condition: () => responseAppealGroundHasDocuments(response, `${appealGround}`)
	}
];

/** @type {Record<string, typeof import('@pins/dynamic-forms/src/question')>} */
const questionClasses = {
	'multi-file-upload': MultiFileUploadQuestion,
	// @ts-ignore
	boolean: BooleanQuestion,
	// @ts-ignore
	'text-entry': TextEntryQuestion
};

const questionMethodOverrides = {
	'multi-file-upload': multiFileUploadOverrides,
	boolean: appealGroundsBooleanOverrides,
	'text-entry': appealGroundsTextEntryOverrides,
	checkbox: appealGroundsCheckboxOverrides
};

/**
 * @param {JourneyResponse} response
 * @param {Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'>} appealGrounds
 */

exports.getAppealGroundsQuestions = (response, appealGrounds) => {
	const questionPropsAndConditions = appealGrounds.flatMap((appealGround) =>
		getCommonAppealGroundsQuestionProps(response, appealGround)
	);
	return questionPropsAndConditions.map((props) => ({
		// @ts-ignore
		question: new questionClasses[props.question.type](
			props.question,
			questionMethodOverrides[props.question.type]
		),
		condition: props.condition
	}));
};

// future refactor when creating enforcement listed building question
exports.chooseGroundsOfAppealQuestion = new CheckboxQuestion(
	{
		title: 'Choose your grounds of appeal',
		question: 'Choose your grounds of appeal',
		description: 'Select all that apply',
		fieldName: 'appealGrounds',
		url: 'choose-grounds',
		validators: [new RequiredValidator('Select your grounds of appeal')],
		options: [
			{
				text: 'Ground (a)',
				value: 'a',
				hint: {
					text: 'The local planning authority (LPA) should grant planning permission for all (or part) of the development described in the alleged breach.'
				}
			},
			{
				text: 'Ground (b)',
				value: 'b',
				hint: {
					text: 'The alleged breach did not happen.'
				}
			},
			{
				text: 'Ground (c)',
				value: 'c',
				hint: {
					text: 'You do not need planning permission (for example, it is a permitted development or you already have planning permission).'
				}
			},
			{
				text: 'Ground (d)',
				value: 'd',
				hint: {
					text: 'It is too late for the LPA to take enforcement action.'
				}
			},
			{
				text: 'Ground (e)',
				value: 'e',
				hint: {
					text: 'The LPA did not serve the notice properly to everyone with an interest in the land.'
				}
			},
			{
				text: 'Ground (f)',
				value: 'f',
				hint: {
					text: 'A simpler step (or steps) would achieve the same result.'
				}
			},
			{
				text: 'Ground (g)',
				value: 'g',
				hint: {
					text: 'The time to comply with the notice is too short.'
				}
			}
		]
	},
	questionMethodOverrides['checkbox']
);
