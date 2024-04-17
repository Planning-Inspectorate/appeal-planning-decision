/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');
const AddMoreQuestion = require('../dynamic-components/add-more/question');
const AddressAddMoreQuestion = require('../dynamic-components/address-add-more/question');
const RadioQuestion = require('../dynamic-components/radio/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');
const AddressValidator = require('../validator/address-validator');
const StringEntryValidator = require('../validator/string-validator');

const {
	validation: {
		stringValidation: { appealReferenceNumber: appealReferenceNumberValidation }
	}
} = require('../../../src/config');
const StringValidator = require('../validator/string-validator');
let {
	validation: {
		characterLimits: { finalComment: inputMaxCharacters }
	}
} = require('../../config');
const { getConditionalFieldName } = require('../dynamic-components/utils/question-utils');
const ConditionalRequiredValidator = require('../validator/conditional-required-validator');
const DateValidator = require('../validator/date-validator');
const DateQuestion = require('../dynamic-components/date/question');

const { documentTypes } = require('@pins/common');

inputMaxCharacters = Math.min(Number(inputMaxCharacters), 32500);

// Define all questions

module.exports = {
	pressAdvert: new BooleanQuestion({
		title: 'Press Advert',
		question: 'Did you put an advert in the local press?',
		// fieldName: 'press-advert',
		fieldName: 'pressAdvert',
		url: 'press-advert',
		validators: [new RequiredValidator()]
	}),
	pressAdvertUpload: new MultiFileUploadQuestion({
		title: 'Uploaded press advert',
		question: 'Upload the press advertisement',
		// fieldName: 'upload-press-advert',
		fieldName: 'uploadPressAdvert',
		url: 'upload-press-advert',
		validators: [
			new RequiredFileUploadValidator('Select the press advertisement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.pressAdvertUpload
	}),
	planningOfficersReportUpload: new MultiFileUploadQuestion({
		title: 'Upload planning officer’s report',
		question: 'Upload the planning officer’s report or what your decision notice would have said',
		// fieldName: 'upload-report',
		fieldName: 'uploadPlanningOfficerReport',
		html: 'resources/upload-planning-officer-report/content.html',
		url: 'upload-planning-officers-report-decision-notice',
		validators: [
			new RequiredFileUploadValidator(
				'Select the planning officer’s report or what your decision notice would have said'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.planningOfficersReportUpload
	}),
	neighbouringSite: new RadioQuestion({
		title: 'Might the inspector need to enter a neighbour’s land or property?',
		question: 'Might the inspector need to enter a neighbour’s land or property?',
		// fieldName: 'inspector-enter-neighbour-site',
		fieldName: 'neighbourSiteAccess',
		url: 'inspector-enter-neighbour-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need to enter a neighbour’s land or property'
			),
			new ConditionalRequiredValidator(),
			new StringValidator({
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Reason must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('neighbourSiteAccess', 'neighbourSiteAccessDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Enter the reason',
					// fieldName: 'reason-for-neighbour-inspection',
					fieldName: 'neighbourSiteAccessDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	neighbouringSitesToBeVisited: new ListAddMoreQuestion({
		title: 'Inspector visit to neighbour',
		pageTitle: 'Neighbour added',
		question: 'Do you want to add another neighbour to be visited?',
		// fieldName: 'neighbouring-site-visits',
		fieldName: 'addNeighbourSiteAccess',
		url: 'neighbour-address',
		subQuestionLabel: 'Neighbour',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator()],
		subQuestion: new AddressAddMoreQuestion({
			title: 'Tell us the address of the neighbour’s land or property',
			question: 'Tell us the address of the neighbour’s land or property',
			// fieldName: 'neighbour-site-address',
			fieldName: 'neighbourSiteAddress',
			validators: [new AddressValidator()],
			viewFolder: 'address-entry'
		})
	}),
	potentialSafetyRisks: new RadioQuestion({
		title: 'Potential safety risks',
		question: 'Add potential safety risks',
		description: 'You need to tell inspectors how to prepare for a site visit and what to bring.',
		html: 'resources/safety-risks/content.html',
		label: 'Are there any potential safety risks?',
		// fieldName: 'safety-risks',
		fieldName: 'lpaSiteSafetyRisks',
		url: 'potential-safety-risks',
		validators: [
			new RequiredValidator('Select yes if there are any potential safety risks'),
			new ConditionalRequiredValidator(
				'Enter the details of the potential risk and what the inspector might need'
			),
			new StringValidator({
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Safety risk must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('lpaSiteSafetyRisks', 'lpaSiteSafetyRiskDetails')
			})
		],

		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Add details of the potential risk and what the inspector might need',
					// fieldName: 'new-safety-risk-value',
					fieldName: 'lpaSiteSafetyRiskDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	procedureType: new RadioQuestion({
		title: 'Procedure type',
		question: 'Which procedure do you think is most appropriate for this appeal?',
		// fieldName: 'procedure-type',
		fieldName: 'lpaProcedurePreference',
		url: 'procedure-type',
		validators: [
			new RequiredValidator('Select the most appropriate procedure'),
			new ConditionalRequiredValidator('Enter how many days you expect the inquiry to last'),
			new StringValidator({
				regex: {
					regex: '^(?:[1-9]\\d{0,2})?$',
					regexMessage:
						'The days you would expect the inquiry to last must be a whole number between 1 and 999'
				},
				fieldName: getConditionalFieldName('lpaProcedurePreference', 'lpaPreferInquiryDuration')
			})
		],

		options: [
			{
				text: 'Written representations',
				value: 'written-representations'
			},
			{
				text: 'Hearing',
				value: 'hearing'
			},
			{
				text: 'Inquiry',
				value: 'inquiry',
				conditional: {
					question: 'How many days would you expect the inquiry to last?',
					// fieldName: 'inquiry-duration',
					fieldName: 'lpaPreferInquiryDuration',
					inputClasses: 'govuk-input--width-3',
					label: 'Length in days:',
					type: 'text'
				}
			}
		]
	}),
	nearbyAppeals: new ListAddMoreQuestion({
		pageTitle: 'Nearby appeal added to the case',
		title: 'n/a',
		question: 'Add another appeal?',
		// fieldName: 'other-appeals-references',
		fieldName: 'addNearbyAppeal',
		url: 'appeal-reference-number',
		subQuestionLabel: 'Other appeal',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another appeal')],
		subQuestion: new AddMoreQuestion({
			title: 'Enter an appeal reference number',
			question: 'Enter an appeal reference number',
			// fieldName: 'other-appeal-reference',
			fieldName: 'nearbyAppealReference',
			hint: 'You can add more appeals later if there is more than one nearby',
			validators: [
				new RequiredValidator('Enter an appeal reference number'),
				new StringEntryValidator(appealReferenceNumberValidation)
			],
			viewFolder: 'identifier'
		})
	}),
	protectedSpecies: new BooleanQuestion({
		title: 'Protected species',
		question: 'Would the development affect a protected species?',
		// fieldName: 'protected-species',
		fieldName: 'protectedSpecies',
		url: 'protected-species',
		validators: [
			new RequiredValidator('Select yes if the development would affect a protected species')
		]
	}),
	meetsColumnTwoThreshold: new BooleanQuestion({
		title: 'Meets or exceeds the threshold or criteria in column 2	',
		question: 'Does the development meet or exceed the threshold or criteria in column 2?',
		// fieldName: 'column-2-threshold',
		fieldName: 'columnTwoThreshold',
		url: 'column-2-threshold',
		validators: [
			new RequiredValidator(
				'Select yes if the development meets or exceeds the threshold or criteria in column 2'
			)
		]
	}),
	ownsAllLand: new BooleanQuestion({
		title: 'Do you own all the land involved in the appeal?',
		question: 'Do you own all the land involved in the appeal?',
		fieldName: 'ownsAllLand',
		url: 'owns-all-land',
		validators: [
			new RequiredValidator('Select yes if you own all of the land involved in the appeal')
		]
	}),
	ownsSomeLand: new BooleanQuestion({
		title: 'Do you own some of the land involved in the appeal?',
		question: 'Do you own some of the land involved in the appeal?',
		fieldName: 'ownsSomeLand',
		url: 'own-some-land',
		validators: [
			new RequiredValidator('Select yes if you own some of the land involved in the appeal')
		]
	}),
	ownsRestOfLand: new RadioQuestion({
		title: 'Do you know who owns the rest of the land involved in the appeal?',
		question: 'Do you know who owns the rest of the land involved in the appeal?',
		fieldName: 'knowsOtherOwners',
		url: 'owns-rest-of-land',
		options: [
			{
				text: 'Yes, I know who owns all of the land',
				value: 'yes'
			},
			{
				text: 'I know who owns some of the land',
				value: 'some'
			},
			{
				text: 'No, I do not know who owns any of the land',
				value: 'no'
			}
		],
		validators: [
			new RequiredValidator(
				'Select if you know who owns the rest of the land involved in the appeal'
			)
		]
	}),
	ownsLandInvolved: new RadioQuestion({
		title: 'Do you know who owns the land involved in the appeal?',
		question: 'Do you know who owns the land involved in the appeal?',
		fieldName: 'knowsAllOwners',
		url: 'owns-land-involved',
		options: [
			{
				text: 'Yes, I know who owns all the land',
				value: 'yes'
			},
			{
				text: 'I know who owns some of the land',
				value: 'some'
			},
			{
				text: 'No, I do not know who owns any of the land',
				value: 'no'
			}
		],
		validators: [
			new RequiredValidator(' Select if you know who owns the land involved in the appeal')
		]
	}),
	planningApplicationDate: new DateQuestion({
		title: 'What date did you submit your planning application?',
		question: 'What date did you submit your planning application?',
		fieldName: 'onApplicationDate',
		url: 'planning-application-date',
		hint: 'For example, 21 01 2024',
		validators: [
			new DateValidator('the date you submitted your planning application', {
				ensurePast: true
			})
		]
	})
};
