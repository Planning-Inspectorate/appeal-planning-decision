/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const RadioQuestion = require('../dynamic-components/radio/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');

const StringValidator = require('../validator/string-validator');
let {
	validation: {
		characterLimits: { finalComment: inputMaxCharacters }
	}
} = require('../../config');
const { getConditionalFieldName } = require('../dynamic-components/utils/question-utils');
const ConditionalRequiredValidator = require('../validator/conditional-required-validator');

const { documentTypes } = require('@pins/common');

inputMaxCharacters = Math.min(Number(inputMaxCharacters), 32500);

// Define all questions

module.exports = {
	representationsFromOthers: new BooleanQuestion({
		title: 'Representations from other parties',
		question: 'Did you receive representations from members of the public or other parties?',
		url: 'representations',
		// fieldName: 'representations-other-parties',
		fieldName: 'otherPartyRepresentations',
		validators: [
			new RequiredValidator(
				'Select yes if you received representations from members of the public or other parties'
			)
		]
	}),
	representationUpload: new MultiFileUploadQuestion({
		title: 'Upload representations from other parties',
		question: 'Upload the representations',
		// fieldName: 'upload-representations',
		fieldName: 'uploadRepresentations',
		url: 'upload-representations',
		validators: [
			new RequiredFileUploadValidator('Select the representations'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.representationUpload
	}),
	treePreservationOrder: new BooleanQuestion({
		title: 'Tree Preservation Order',
		question: 'Does a Tree Preservation Order (TPO) apply to any part of the appeal site?',
		// fieldName: 'tree-preservation-order',
		fieldName: 'treePreservationOrder',
		url: 'tree-preservation-order',
		validators: [new RequiredValidator()]
	}),
	treePreservationPlanUpload: new MultiFileUploadQuestion({
		title: 'Tree Preservation Order extent',
		question: 'Upload a plan showing the extent of the order',
		// fieldName: 'upload-plan-showing-order',
		fieldName: 'uploadTreePreservationOrder',
		url: 'upload-plan-showing-order',
		validators: [
			new RequiredFileUploadValidator('Select a plan showing the extent of the order'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.treePreservationPlanUpload
	}),
	supplementaryPlanning: new BooleanQuestion({
		title: 'Supplementary planning documents',
		question: 'Did any supplementary planning documents inform the outcome of the application?',
		// fieldName: 'supplementary-planning-documents',
		fieldName: 'supplementaryPlanningDocs',
		url: 'supplementary-planning-documents',
		validators: [
			new RequiredValidator(
				'Select yes if any supplementary planning documents informed the outcome of the application'
			)
		]
	}),
	supplementaryPlanningUpload: new MultiFileUploadQuestion({
		title: 'Upload supplementary planning documents',
		question: 'Upload relevant policy extracts and supplementary planning documents',
		// fieldName: 'upload-policies-supplementary-planning-documents',
		fieldName: 'uploadSupplementaryPlanningDocs',
		url: 'upload-policies-supplementary-planning-documents',

		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant policy extracts and supplementary planning documents'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.supplementaryPlanningUpload
	}),
	scheduledMonument: new BooleanQuestion({
		title: 'Affects a scheduled monument',
		question: 'Would the development affect a scheduled monument?',
		// fieldName: 'scheduled-monument',
		fieldName: 'affectsScheduledMonument',
		url: 'scheduled-monument',
		validators: [
			new RequiredValidator('Select yes if the development would affect a scheduled monument')
		]
	}),
	statutoryConsultees: new RadioQuestion({
		title: 'Statutory consultees',
		question: 'Did you consult all the relevant statutory consultees about the development?',
		// fieldName: 'statutory-consultees',
		fieldName: 'statutoryConsultees',
		url: 'statutory-consultees',
		validators: [
			new RequiredValidator(
				'Select yes if you consulted all the relevant statutory consultees about the development'
			),
			new ConditionalRequiredValidator(),
			new StringValidator({
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Consulted bodies must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('statutoryConsultees', 'consultedBodiesDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Which bodies did you consult?',
					// fieldName: 'consulted-bodies',
					fieldName: 'consultedBodiesDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	rightOfWayCheck: new BooleanQuestion({
		title: 'Public right of way',
		question: 'Would a public right of way need to be removed or diverted?',
		// fieldName: 'public-right-of-way',
		fieldName: 'publicRightOfWay',
		url: 'public-right-of-way',
		validators: [
			new RequiredValidator(
				'Select yes if a public right of way would need to be removed or diverted'
			)
		]
	}),
	screeningOpinion: new BooleanQuestion({
		title: 'Issued screening opinion',
		question: 'Have you issued a screening opinion?',
		// fieldName: 'screening-opinion',
		fieldName: 'screeningOpinion',
		url: 'screening-opinion',
		validators: [new RequiredValidator('Select yes if you have issued a screening opinion')]
	}),
	screeningOpinionEnvironmentalStatement: new BooleanQuestion({
		title: 'Screening opinion environmental statement',
		question: 'Did your screening opinion say the development needed an environmental statement?',
		// fieldName: 'screening-opinion-environmental-statement',
		fieldName: 'environmentalStatement',
		url: 'screening-opinion-environmental-statement',
		validators: [
			new RequiredValidator(
				'Select yes if your screening opinion says the development needs an environmental statement'
			)
		]
	}),
	sensitiveArea: new RadioQuestion({
		title: 'In, partly in, or likely to affect a sensitive area',
		question: 'Is the development in, partly in, or likely to affect a sensitive area?',
		// fieldName: 'sensitive-area',
		fieldName: 'sensitiveArea',
		url: 'sensitive-area',
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the sensitive area',
					// fieldName: 'sensitive-area-value',
					fieldName: 'sensitiveAreaDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		],
		validators: [
			new RequiredValidator(
				'Select yes if the development is in, partly in, or likely to affect a sensitive area'
			),
			new ConditionalRequiredValidator('Enter a description for the sensitive area'),
			new StringValidator({
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Sensitive area description must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('sensitiveArea', 'sensitiveAreaDetails')
			})
		]
	}),
	screeningOpinionUpload: new MultiFileUploadQuestion({
		title: 'Screening opinion',
		question: 'Upload your screening opinion and any correspondence',
		// fieldName: 'screening-opinion-upload',
		fieldName: 'uploadScreeningOpinion',
		url: 'upload-screening-opinion',
		validators: [
			new RequiredFileUploadValidator('Select your screening opinion and any correspondence'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.screeningOpinionUpload
	}),
	submitEnvironmentalStatement: new RadioQuestion({
		title: 'Environmental impact assessment',
		question: 'Did the applicant submit an environmental statement?',
		// fieldName: 'environmental-statement',
		fieldName: 'requiresEnvironmentalStatement',
		url: 'environmental-statement',
		options: [
			{
				text: 'Yes',
				value: 'yes'
			},
			{
				text: 'No, they have a negative screening direction',
				value: 'no'
			}
		],
		validators: [
			new RequiredValidator('Select yes if the applicant submitted an environmental statement')
		]
	}),
	tellingLandowners: new BooleanQuestion({
		title: 'Telling the landowners',
		question: 'Telling the landowners',
		type: 'checkbox',
		html: 'resources/land-ownership/telling-landowners.html',
		description: 'Have the landowners been told about the appeal?',
		fieldName: 'informedOwners',
		url: 'telling-landowners',
		options: [
			{
				text: 'I confirm that I’ve told all the landowners about my appeal within the last 21 days using a copy of the form in annexe 2A or 2B',
				value: 'yes'
			}
		],
		validators: [
			new RequiredValidator(
				'You must confirm that you’ve told all the landowners about your appeal within the last 21 days using a copy of the form in annexe 2A or 2B'
			)
		]
	})
};
