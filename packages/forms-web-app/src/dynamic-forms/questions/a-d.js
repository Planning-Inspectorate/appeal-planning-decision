/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const CheckboxQuestion = require('../dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');
const RadioQuestion = require('../dynamic-components/radio/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');
const StringEntryValidator = require('../validator/string-validator');

const {
	validation: {
		stringValidation: { listedBuildingNumber: listedBuildingNumberValidation }
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
const ListedBuildingAddMoreQuestion = require('../dynamic-components/listed-building-add-more/question');
const DateValidator = require('../validator/date-validator');
const DateQuestion = require('../dynamic-components/date/question');
const { documentTypes } = require('@pins/common');

inputMaxCharacters = Math.min(Number(inputMaxCharacters), 32500);

// Define all questions

module.exports = {
	appealTypeAppropriate: new BooleanQuestion({
		title: 'Is this the correct type of appeal?',
		question: 'Is this the correct type of appeal?',
		// fieldName: 'correct-appeal-type',
		fieldName: 'correctAppealType',
		url: 'correct-appeal-type',
		validators: [new RequiredValidator('Select yes if this is the correct type of appeal')]
	}),
	changesListedBuilding: new BooleanQuestion({
		title: 'Changes a listed building',
		question: 'Does the proposed development change a listed building?',
		// fieldName: 'changes-listed-building',
		fieldName: 'changesListedBuilding',
		url: 'changes-listed-building',
		validators: [new RequiredValidator()]
	}),
	changedListedBuildings: new ListAddMoreQuestion({
		title: 'Listed building or site added',
		pageTitle: 'Listed building or site has been added to the case',
		question: 'Add another building or site?',
		// fieldName: 'add-listed-buildings',
		fieldName: 'addChangedListedBuilding',
		url: 'changed-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestion: new ListedBuildingAddMoreQuestion({
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			// fieldName: 'listed-building-number',
			fieldName: 'changedListedBuildingNumber',
			html: 'resources/listed-building-number/content.html',
			validators: [
				new RequiredValidator('Enter a list entry number'),
				new StringEntryValidator(listedBuildingNumberValidation)
			],
			viewFolder: 'identifier'
		})
	}),
	affectedListedBuildings: new ListAddMoreQuestion({
		title: 'Listed building or site added',
		pageTitle: 'Listed building or site has been added to the case',
		question: 'Add another building or site?',
		// fieldName: 'add-listed-buildings',
		fieldName: 'addAffectedListedBuilding',
		url: 'affected-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestion: new ListedBuildingAddMoreQuestion({
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			// fieldName: 'listed-building-number',
			fieldName: 'affectedListedBuildingNumber',
			html: 'resources/listed-building-number/content.html',
			validators: [
				new RequiredValidator('Enter a list entry number'),
				new StringEntryValidator(listedBuildingNumberValidation)
			],
			viewFolder: 'identifier'
		})
	}),
	conservationArea: new BooleanQuestion({
		title: 'Conservation area',
		question: 'Is the site in, or next to a conservation area?',
		// fieldName: 'conservation-area',
		fieldName: 'conservationArea',
		url: 'conservation-area',
		validators: [new RequiredValidator()]
	}),
	conservationAreaUpload: new MultiFileUploadQuestion({
		title: 'Conservation area map and guidance',
		question: 'Upload conservation map and guidance',
		// fieldName: 'conservation-upload',
		fieldName: 'uploadConservation',
		url: 'upload-conservation-area-map-guidance',
		validators: [
			new RequiredFileUploadValidator('Select a conservation map and guidance'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.conservationAreaUpload
	}),
	displaySiteNotice: new BooleanQuestion({
		title: 'Site notice',
		question: 'Did you display a notice at the site?',
		description: 'Notifying relevant parties of the application',
		// fieldName: 'display-site-notice',
		fieldName: 'displaySiteNotice',
		url: 'display-site-notice',
		validators: [new RequiredValidator()]
	}),
	consultationResponses: new BooleanQuestion({
		title: 'Responses or standing advice to upload',
		question:
			'Do you have any consultation responses or standing advice from statutory consultees to upload?',
		// fieldName: 'consultation-responses',
		fieldName: 'consultationResponses',
		url: 'consultation-responses',
		validators: [
			new RequiredValidator(
				'Select yes if you have any consultation responses or standing advice from statutory consultees to upload'
			)
		]
	}),
	consultationResponsesUpload: new MultiFileUploadQuestion({
		title: 'Upload the consultation responses and standing advice',
		question: 'Upload the consultation responses and standing advice',
		// fieldName: 'upload-consultation-responses',
		fieldName: 'uploadConsultationResponses',
		url: 'upload-consultation-responses',
		validators: [
			new RequiredFileUploadValidator('Select the consultation responses and standing advice'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.consultationResponsesUpload
	}),
	accessForInspection: new RadioQuestion({
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property?',
		pageTitle: 'Might the inspector need access to the appellant’s land or property?',
		// fieldName: 'inspector-access-appeal-site',
		fieldName: 'lpaSiteAccess',
		url: 'inspector-access-appeal-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need access to the appellant’s land or property'
			),
			new ConditionalRequiredValidator('Enter the reason'),
			new StringValidator({
				regex: {
					regex: new RegExp(`^[0-9a-z- '()]{0,${inputMaxCharacters}}$`, 'gi'),
					regexMessage: 'Reason must only include letters a to z, hyphens, spaces and apostrophes.'
				},
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Reason must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('lpaSiteAccess', 'lpaSiteAccessDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Enter the reason',
					// fieldName: 'reason-for-inspector-access',
					fieldName: 'lpaSiteAccessDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	appealsNearSite: new BooleanQuestion({
		title: 'Appeals near the site',
		question: 'Are there any other ongoing appeals next to, or close to the site?',
		pageTitle: 'Are there any other ongoing appeals near the site?',
		url: 'ongoing-appeals',
		// fieldName: 'other-ongoing-appeals',
		fieldName: 'nearbyAppeals',
		validators: [
			new RequiredValidator(
				'Select yes if there are any other ongoing appeals next to, or close to the site'
			)
		]
	}),
	addNewConditions: new RadioQuestion({
		title: 'Extra conditions', // this is summary list title
		question: 'Add new planning conditions to this appeal',
		description: 'These are additional to the standard planning conditions we would expect to see.',
		// fieldName: 'new-planning-conditions',
		fieldName: 'newConditions',
		url: 'add-new-planning-conditions',
		html: 'resources/new-planning-conditions/content.html',
		label: 'Are there any new conditions?',
		validators: [
			new RequiredValidator('Select yes if there are any new conditions'),
			new ConditionalRequiredValidator('Enter the new conditions'),
			new StringValidator({
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `New conditions must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName('newConditions', 'newConditionDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the new conditions',
					// fieldName: 'new-conditions-value',
					fieldName: 'newConditionDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	communityInfrastructureLevy: new BooleanQuestion({
		title: 'Community infrastructure levy',
		question: 'Do you have a community infrastructure levy?',
		// fieldName: 'community-infrastructure-levy',
		fieldName: 'infrastructureLevy',
		url: 'community-infrastructure-levy',
		validators: [new RequiredValidator('Select yes if you have a community infrastructure levy')],
		html: 'resources/community-infrastructure-levy/content.html'
	}),
	communityInfrastructureLevyUpload: new MultiFileUploadQuestion({
		title: 'Upload your community infrastructure levy',
		question: 'Upload your community infrastructure levy',
		// fieldName: 'upload-community-infrastructure-levy',
		fieldName: 'uploadInfrastructureLevy',
		url: 'upload-community-infrastructure-levy',
		validators: [
			new RequiredFileUploadValidator('Select your community infrastructure levy'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.communityInfrastructureLevyUpload
	}),
	communityInfrastructureLevyAdopted: new BooleanQuestion({
		title: 'Community infrastructure levy formally adopted',
		question: 'Is the community infrastructure levy formally adopted?',
		// fieldName: 'community-infrastructure-levy-adopted',
		fieldName: 'infrastructureLevyAdopted',
		url: 'community-infrastructure-levy-adopted',
		validators: [new RequiredValidator()]
	}),
	communityInfrastructureLevyAdoptedDate: new DateQuestion({
		title: 'Date community infrastructure levy adopted',
		question: 'When was the community infrastructure levy formally adopted?',
		// fieldName: 'community-infrastructure-levy-adopted-date',
		fieldName: 'infrastructureLevyAdoptedDate',
		hint: 'For example, 7 12 2023',
		validators: [
			new DateValidator('the date the infrastructure levy was formally adopted', {
				ensurePast: true
			})
		]
	}),
	communityInfrastructureLevyAdoptDate: new DateQuestion({
		title: 'Date community infrastructure levy expected to be adopted',
		question: 'When do you expect to formally adopt the community infrastructure levy?',
		// fieldName: 'community-infrastructure-levy-adopt-date',
		fieldName: 'infrastructureLevyExpectedDate',
		hint: 'For example, 21 11 2023',
		validators: [
			new DateValidator('the date you expect to formally adopt the community infrastructure levy', {
				ensureFuture: true
			})
		]
	}),
	areaOfOutstandingNaturalBeauty: new BooleanQuestion({
		title: 'Area of outstanding natural beauty',
		question: 'Is the appeal site in an area of outstanding natural beauty?',
		// fieldName: 'area-of-outstanding-natural-beauty',
		fieldName: 'areaOutstandingBeauty',
		url: 'area-of-outstanding-natural-beauty',
		validators: [
			new RequiredValidator(
				'Select yes if the appeal site is in an area of outstanding natural beauty'
			)
		]
	}),
	designatedSitesCheck: new CheckboxQuestion({
		title: 'Designated sites',
		question: 'Is the development in, near or likely to affect any designated sites?',
		// fieldName: 'designated-sites-check',
		fieldName: 'designatedSites',
		url: 'designated-sites',
		validators: [
			new RequiredValidator(
				'Select a designated site, or select ‘No, it is not in, near or likely to affect any designated sites’'
			),
			new ConditionalRequiredValidator('Enter other designations')
		],
		options: [
			{
				text: 'SSSI (site of special scientific interest)',
				value: 'SSSI'
			},
			{
				text: 'cSAC (candidate special area of conservation)',
				value: 'cSAC'
			},
			{
				text: 'SAC (special area of conservation)',
				value: 'SAC'
			},
			{
				text: 'pSPA (potential special protection area)',
				value: 'pSPA'
			},
			{
				text: 'SPA Ramsar (Ramsar special protection area)',
				value: 'SPA'
			},
			{
				text: 'Other',
				value: 'other',
				conditional: {
					question: 'Other designation(s)',
					type: 'text',
					// fieldName: 'other-designations'
					fieldName: 'otherDesignations'
				}
			},
			{
				divider: 'or'
			},
			{
				text: 'No, it is not in, near or likely to affect any designated sites',
				value: 'None',
				behaviour: 'exclusive'
			}
		]
	}),
	developmentDescription: new RadioQuestion({
		title: 'Development description',
		question: 'Description of development',
		// fieldName: 'development-description',
		fieldName: 'developmentDescription',
		url: 'development-description',
		validators: [new RequiredValidator('Select a description of development')],
		options: [
			{
				text: 'Agriculture and aquaculture',
				value: 'agriculture-aquaculture'
			},
			{
				text: 'Changes and extensions',
				value: 'change-extensions'
			},
			{
				text: 'Chemical industry (unless included in Schedule 1)',
				value: 'chemical-industry'
			},
			{
				text: 'Energy industry',
				value: 'energy-industry'
			},
			{
				text: 'Extractive industry',
				value: 'extractive-industry'
			},
			{
				text: 'Food industry',
				value: 'food-industry'
			},
			{
				text: 'Infrastructure projects',
				value: 'infrastructure-projects'
			},
			{
				text: 'Mineral industry',
				value: 'mineral-industry'
			},
			{
				text: 'Other projects',
				value: 'other-projects'
			},
			{
				text: 'Production and processing of metals',
				value: 'production-processing-of-metals'
			},
			{
				text: 'Rubber industry',
				value: 'rubber-industry'
			},
			{
				text: 'Textile, leather, wood and paper industries',
				value: 'textile-industries'
			},
			{
				text: 'Tourism and leisure',
				value: 'tourism-leisure'
			}
		]
	}),
	advertisingAppeal: new BooleanQuestion({
		title: 'Advertising your appeal',
		question: 'Advertising your appeal',
		type: 'checkbox',
		html: 'resources/land-ownership/advertised-appeal.html',
		fieldName: 'advertisedAppeal',
		url: 'advertising-appeal',
		options: [
			{
				text: 'I confirm that I’ve advertised my appeal in the press within the last 21 days using a copy of the form in annexe 2A or 2B',
				value: 'yes'
			}
		],
		validators: [
			new RequiredValidator(
				'You must confirm that you’ve advertised your appeal in the press within the last 21 days using a copy of the form in annexe 2A or 2B'
			)
		]
	}),
	costApplication: new RadioQuestion({
		title: 'Do you need to apply for an award of appeal costs?',
		question: 'Do you need to apply for an award of appeal costs?',
		fieldName: 'costApplication',
		url: 'apply-appeal-costs',
		options: [
			{
				text: 'Yes',
				value: 'yes'
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	})
};
