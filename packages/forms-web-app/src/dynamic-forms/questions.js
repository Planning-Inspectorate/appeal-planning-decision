/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

// question classes
const CheckboxQuestion = require('./dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('./dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('./dynamic-components/boolean/question');
const RadioQuestion = require('./dynamic-components/radio/question');
const DateQuestion = require('./dynamic-components/date/question');
const TextEntryQuestion = require('./dynamic-components/text-entry/question');
const SingleLineInputQuestion = require('./dynamic-components/single-line-input/question');
const MultiFieldInputQuestion = require('./dynamic-components/multi-field-input/question');
const NumberEntryQuestion = require('./dynamic-components/number-entry/question');
const SiteAddressQuestion = require('./dynamic-components/site-address/question');
const UnitOptionEntryQuestion = require('./dynamic-components/unit-option-entry/question');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');

// validators
const RequiredValidator = require('./validator/required-validator');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const MultifileUploadValidator = require('./validator/multifile-upload-validator');
const AddressValidator = require('./validator/address-validator');
const StringEntryValidator = require('./validator/string-validator');
const StringValidator = require('./validator/string-validator');
const ConditionalRequiredValidator = require('./validator/conditional-required-validator');
const UnitOptionEntryValidator = require('./validator/unit-option-entry-validator');
const DateValidator = require('./validator/date-validator');
const MultiFieldInputValidator = require('./validator/multi-field-input-validator');
const NumericValidator = require('./validator/numeric-validator');
const ConfirmationCheckboxValidator = require('./validator/confirmation-checkbox-validator');

const {
	APPEAL_CASE_PROCEDURE,
	APPEAL_EIA_DEVELOPMENT_DESCRIPTION,
	APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE
} = require('@planning-inspectorate/data-model');
const { getConditionalFieldName, DIVIDER } = require('./dynamic-components/utils/question-utils');
const { documentTypes } = require('@pins/common');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const {
	validation: {
		characterLimits: { appealFormV2 },
		stringValidation: {
			appealReferenceNumber: appealReferenceNumberValidation,
			listedBuildingNumber: listedBuildingNumberValidation,
			appealSiteArea: { minValue, maxValue, minValueHectres },
			numberOfWitnesses: { maxWitnesses },
			lengthOfInquiry: { minDays, maxDays }
		}
	}
} = require('../config');
const { createQuestions } = require('./create-questions');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');

// method overrides
const multiFileUploadOverrides = require('../journeys/question-overrides/multi-file-upload');
const siteAddressOverrides = require('../journeys/question-overrides/site-address');
const formatNumber = require('./dynamic-components/utils/format-number');

/** @typedef {import('./question-props').QuestionProps} QuestionProps */
/** @typedef {import('./question')} Question */

const { getExampleDate } = require('./questions-utils');

// Define all questions
/** @type {Record<string, QuestionProps>} */
exports.questionProps = {
	appealTypeAppropriate: {
		type: 'boolean',
		title: `Is a ${QUESTION_VARIABLES.APPEAL_TYPE} appeal the correct type of appeal?`,
		question: `Is a ${QUESTION_VARIABLES.APPEAL_TYPE} appeal the correct type of appeal?`,
		fieldName: 'correctAppealType',
		url: 'correct-appeal-type',
		validators: [
			new RequiredValidator(
				`Select yes if ${QUESTION_VARIABLES.APPEAL_TYPE} appeal is the correct type of appeal`
			)
		],
		variables: [QUESTION_VARIABLES.APPEAL_TYPE]
	},
	listedBuildingCheck: {
		type: 'boolean',
		title: 'Affects a listed building',
		question: 'Does the proposed development affect the setting of listed buildings?',
		fieldName: 'affectsListedBuilding',
		url: 'affect-listed-building',
		validators: [
			new RequiredValidator(
				'Select yes if the proposed development affects the setting of listed buildings'
			)
		]
	},
	changesListedBuilding: {
		type: 'boolean',
		title: 'Changes a listed building',
		question: 'Does the proposed development change a listed building?',
		fieldName: 'changesListedBuilding',
		url: 'changes-listed-building',
		validators: [new RequiredValidator('Select yes if the development changes a listed building')]
	},
	changedListedBuildings: {
		type: 'list-add-more',
		title: 'Listed building or site added',
		pageTitle: 'Listed building or site has been added to the case',
		question: 'Add another building or site?',
		fieldName: 'addChangedListedBuilding',
		url: 'changed-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestionProps: {
			type: 'listed-building',
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			fieldName: fieldNames.changedListedBuildingNumber,
			html: 'resources/listed-building-number/content.html',
			validators: [
				new RequiredValidator('Enter a list entry number'),
				new StringEntryValidator(listedBuildingNumberValidation)
			],
			viewFolder: 'add-more'
		}
	},
	affectedListedBuildings: {
		type: 'list-add-more',
		title: 'Listed building or site added',
		pageTitle: 'Listed building or site has been added to the case',
		question: 'Add another building or site?',
		fieldName: 'addAffectedListedBuilding',
		url: 'affected-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestionProps: {
			type: 'listed-building',
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			fieldName: fieldNames.affectedListedBuildingNumber,
			html: 'resources/listed-building-number/content.html',
			validators: [
				new RequiredValidator('Enter a list entry number'),
				new StringEntryValidator(listedBuildingNumberValidation)
			],
			viewFolder: 'add-more'
		}
	},
	conservationArea: {
		type: 'boolean',
		title: 'Conservation area',
		question: 'Is the site in, or next to a conservation area?',
		fieldName: 'conservationArea',
		url: 'conservation-area',
		validators: [
			new RequiredValidator('Select yes if the site is in, or next to a conservation area')
		]
	},
	conservationAreaUpload: {
		type: 'multi-file-upload',
		title: 'Conservation area map and guidance',
		question: 'Upload conservation map and guidance',
		fieldName: 'uploadConservation',
		url: 'upload-conservation-area-map-guidance',
		validators: [
			new RequiredFileUploadValidator('Select a conservation map and guidance'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.conservationMap,
		actionHiddenText: 'conservation map and guidance'
	},
	greenBelt: {
		type: 'boolean',
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		fieldName: 'greenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator('Select yes if the site is in a green belt')]
	},
	whoWasNotified: {
		type: 'multi-file-upload',
		title: 'Who was notified',
		url: 'upload-who-you-notified',
		question: 'Who did you notify about this application?',
		fieldName: 'uploadWhoNotified',
		validators: [
			new RequiredFileUploadValidator('Select your document that lists who you notified'),
			new MultifileUploadValidator()
		],
		html: 'resources/notified-who/content.html',
		documentType: documentTypes.whoWasNotified
	},
	pressAdvertUpload: {
		type: 'multi-file-upload',
		title: 'Uploaded press advert',
		question: 'Upload the press advertisement',
		fieldName: 'uploadPressAdvert',
		url: 'upload-press-advert',
		validators: [
			new RequiredFileUploadValidator('Select the press advertisement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.pressAdvertUpload,
		actionHiddenText: 'the press advertisement'
	},
	consultationResponses: {
		type: 'boolean',
		title: 'Responses or standing advice to upload',
		question:
			'Do you have any consultation responses or standing advice from statutory consultees to upload?',
		fieldName: 'consultationResponses',
		url: 'consultation-responses',
		validators: [
			new RequiredValidator(
				'Select yes if you have any consultation responses or standing advice from statutory consultees to upload'
			)
		]
	},
	consultationResponsesUpload: {
		type: 'multi-file-upload',
		title: 'Upload the consultation responses and standing advice',
		question: 'Upload the consultation responses and standing advice',
		fieldName: 'uploadConsultationResponses',
		url: 'upload-consultation-responses',
		validators: [
			new RequiredFileUploadValidator('Select the consultation responses and standing advice'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.consultationResponsesUpload,
		actionHiddenText: 'the consultation responses and standing advice'
	},
	howYouNotifiedPeople: {
		type: 'checkbox',
		title: 'Type of notification',
		question: 'How did you notify relevant parties about the planning application?',
		description: 'Select all that apply',
		fieldName: 'notificationMethod',
		url: 'notification-type',
		validators: [
			new RequiredValidator('Select how you notified people about the planning application')
		],
		options: [
			//Options for checkboxes / radio buttons
			{
				text: 'A site notice',
				value: 'site-notice'
			},
			{
				text: 'Letters or emails to interested parties',
				value: 'letters-or-emails'
			},
			{
				text: 'An advert in the local press',
				value: 'advert'
			}
		]
	},
	uploadSiteNotice: {
		type: 'multi-file-upload',
		title: 'Uploaded site notice',
		question: 'Upload the site notice',
		fieldName: 'uploadSiteNotice',
		url: 'upload-site-notice',
		validators: [
			new RequiredFileUploadValidator('Select the site notice'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadSiteNotice,
		actionHiddenText: 'the site notice'
	},
	appealNotification: {
		type: 'multi-file-upload',
		title: 'Appeal notification letter',
		question: 'Upload the appeal notification letter and the list of people that you notified',
		fieldName: 'appealNotification',
		url: 'appeal-notification-letter',
		validators: [
			new RequiredFileUploadValidator(
				'Select the appeal notification letter and the list of people that you notified'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.appealNotification,
		actionHiddenText: 'the appeal notification letter and the list of people that you notified'
	},
	representationsFromOthers: {
		type: 'boolean',
		title: 'Representations from other parties',
		question: 'Did you receive representations from members of the public or other parties?',
		url: 'representations',
		fieldName: 'otherPartyRepresentations',
		validators: [
			new RequiredValidator(
				'Select yes if you received representations from members of the public or other parties'
			)
		]
	},
	representationUpload: {
		type: 'multi-file-upload',
		title: 'Upload representations from other parties',
		question: 'Upload the representations',
		fieldName: 'uploadRepresentations',
		url: 'upload-representations',
		validators: [
			new RequiredFileUploadValidator('Select the representations'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.representationUpload,
		actionHiddenText: 'the representations'
	},
	planningOfficersReportUpload: {
		type: 'multi-file-upload',
		title: 'Upload planning officer’s report',
		question: 'Upload the planning officer’s report or what your decision notice would have said',
		fieldName: 'uploadPlanningOfficerReport',
		html: 'resources/upload-planning-officer-report/content.html',
		url: 'upload-planning-officers-report-decision-notice',
		validators: [
			new RequiredFileUploadValidator(
				'Select the planning officer’s report or what your decision notice would have said'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.planningOfficersReportUpload,
		actionHiddenText: 'the planning officer’s report or what your decision notice would have said'
	},
	accessForInspection: {
		type: 'radio',
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property?',
		pageTitle: 'Might the inspector need access to the appellant’s land or property?',
		fieldName: 'lpaSiteAccess',
		url: 'inspector-access-appeal-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need access to the appellant’s land or property'
			),
			new ConditionalRequiredValidator('Enter the reason'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Reason must be ${appealFormV2.textInputMaxLength} characters or less`
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
					fieldName: 'lpaSiteAccessDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	neighbouringSite: {
		type: 'radio',
		title: 'Might the inspector need to enter a neighbour’s land or property?',
		question: 'Might the inspector need to enter a neighbour’s land or property?',
		fieldName: 'neighbourSiteAccess',
		url: 'inspector-enter-neighbour-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need to enter a neighbour’s land or property'
			),
			new ConditionalRequiredValidator(),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Reason must be ${appealFormV2.textInputMaxLength} characters or less`
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
					fieldName: 'neighbourSiteAccessDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	neighbouringSitesToBeVisited: {
		type: 'list-add-more',
		title: 'Inspector visit to neighbour',
		pageTitle: 'Neighbour added',
		question: 'Do you want to add another neighbour to be visited?',
		fieldName: 'addNeighbourSiteAccess',
		url: 'neighbour-address',
		subQuestionLabel: 'Neighbour',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator()],
		subQuestionProps: {
			type: 'address',
			title: 'Tell us the address of the neighbour’s land or property',
			question: 'Tell us the address of the neighbour’s land or property',
			fieldName: 'neighbourSiteAddress',
			validators: [new AddressValidator()],
			viewFolder: 'address-entry'
		}
	},
	potentialSafetyRisks: {
		type: 'radio',
		title: 'Potential safety risks',
		question: 'Add potential safety risks',
		description: 'You need to tell inspectors how to prepare for a site visit and what to bring.',
		html: 'resources/safety-risks/content.html',
		label: 'Are there any potential safety risks?',
		fieldName: 'lpaSiteSafetyRisks',
		url: 'potential-safety-risks',
		validators: [
			new RequiredValidator('Select yes if there are any potential safety risks'),
			new ConditionalRequiredValidator(
				'Enter the details of the potential risk and what the inspector might need'
			),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Safety risk must be ${appealFormV2.textInputMaxLength} characters or less`
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
					fieldName: 'lpaSiteSafetyRiskDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	procedureType: {
		type: 'radio',
		title: 'Procedure type',
		question: 'Which procedure do you think is most appropriate for this appeal?',
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
				value: APPEAL_CASE_PROCEDURE.WRITTEN
			},
			{
				text: 'Hearing',
				value: APPEAL_CASE_PROCEDURE.HEARING
			},
			{
				text: 'Inquiry',
				value: APPEAL_CASE_PROCEDURE.INQUIRY,
				conditional: {
					question: 'How many days would you expect the inquiry to last?',
					fieldName: 'lpaPreferInquiryDuration',
					inputClasses: 'govuk-input--width-3',
					label: 'Length in days:',
					type: 'text'
				}
			}
		]
	},
	whyInquiry: {
		type: 'text-entry',
		title: 'Why would you prefer an inquiry?',
		question: 'Why would you prefer an inquiry?',
		fieldName: 'lpaPreferInquiryDetails',
		validators: [new RequiredValidator('Enter why you would prefer an inquiry')]
	},
	whyHearing: {
		type: 'text-entry',
		title: 'Why would you prefer a hearing?',
		question: 'Why would you prefer a hearing?',
		fieldName: 'lpaPreferHearingDetails',
		validators: [new RequiredValidator('Enter why you would prefer a hearing')]
	},
	appealsNearSite: {
		type: 'boolean',
		title: 'Appeals near the site',
		question: 'Are there any other ongoing appeals next to, or close to the site?',
		pageTitle: 'Are there any other ongoing appeals near the site?',
		url: 'ongoing-appeals',
		fieldName: 'nearbyAppeals',
		validators: [
			new RequiredValidator(
				'Select yes if there are any other ongoing appeals next to, or close to the site'
			)
		]
	},
	nearbyAppeals: {
		type: 'list-add-more',
		pageTitle: 'Nearby appeal added to the case',
		title: 'n/a',
		question: 'Add another appeal?',
		fieldName: 'addNearbyAppeal',
		url: 'appeal-reference-number',
		subQuestionLabel: 'Other appeal',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another appeal')],
		subQuestionProps: {
			type: 'case',
			title: 'Enter an appeal reference number',
			question: 'Enter an appeal reference number',
			fieldName: fieldNames.nearbyAppealReference,
			hint: 'You can add more appeals later if there is more than one nearby',
			validators: [
				new RequiredValidator('Enter an appeal reference number'),
				new StringEntryValidator(appealReferenceNumberValidation)
			],
			viewFolder: 'add-more'
		}
	},
	addNewConditions: {
		type: 'radio',
		title: 'Extra conditions', // this is summary list title
		question: 'Add new planning conditions to this appeal',
		description: 'These are additional to the standard planning conditions we would expect to see.',
		fieldName: 'newConditions',
		url: 'add-new-planning-conditions',
		html: 'resources/new-planning-conditions/content.html',
		label: 'Are there any new conditions?',
		validators: [
			new RequiredValidator('Select yes if there are any new conditions'),
			new ConditionalRequiredValidator('Enter the new conditions'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMediumLength,
					maxLengthMessage: `New conditions must be ${appealFormV2.textAreaMediumLength} characters or less`
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
					fieldName: 'newConditionDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	// /*S78 questions */
	emergingPlan: {
		type: 'boolean',
		title: 'Emerging plans',
		question: 'Do you have an emerging plan that is relevant to this appeal?',
		fieldName: 'emergingPlan',
		url: 'emerging-plan',
		validators: [
			new RequiredValidator(
				'Select yes if you have an emerging plan that is relevant to this appeal'
			)
		],
		html: 'resources/emerging-plan/content.html'
	},
	emergingPlanUpload: {
		type: 'multi-file-upload',
		title: 'Upload emerging plan and supporting information	',
		question: 'Upload the emerging plan and supporting information',
		fieldName: 'uploadEmergingPlan',
		url: 'upload-emerging-plan',
		validators: [
			new RequiredFileUploadValidator('Select the emerging plan and supporting information'),
			new MultifileUploadValidator()
		],
		html: 'resources/emerging-plan-upload/content.html',
		documentType: documentTypes.emergingPlanUpload,
		actionHiddenText: 'the emerging plan and supporting information'
	},
	developmentPlanPolicies: {
		type: 'boolean',
		title: 'Do you have any relevant policies from your statutory development plan?',
		question: 'Do you have any relevant policies from your statutory development plan?',
		fieldName: 'developmentPlanPolicies',
		url: 'other-development-plan-policies',
		validators: [
			new RequiredValidator(
				'Select yes if you have any relevant policies from your statutory development plan'
			)
		]
	},
	uploadDevelopmentPlanPolicies: {
		type: 'multi-file-upload',
		title: 'Policies from statutory development plan',
		question: 'Upload relevant policies from your statutory development plan',
		fieldName: 'uploadDevelopmentPlanPolicies',
		url: 'upload-development-plan-policies',
		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant policies from your statutory development plan'
			),
			new MultifileUploadValidator()
		],
		html: 'resources/upload-relevant-policies/content.html',
		documentType: documentTypes.uploadDevelopmentPlanPolicies,
		actionHiddenText: 'relevant policies from your statutory development plan'
	},
	otherRelevantPolicies: {
		type: 'boolean',
		title: 'Do you have any other relevant policies?',
		question: 'Do you have any other relevant policies to upload?',
		fieldName: 'otherRelevantPolicies',
		url: 'other-relevant-policies',
		validators: [new RequiredValidator('Select yes if you have any other relevant policies')]
	},
	uploadOtherRelevantPolicies: {
		type: 'multi-file-upload',
		title: 'Upload any other relevant policies',
		question: 'Upload any other relevant policies',
		fieldName: 'uploadOtherPolicies',
		url: 'upload-other-relevant-policies',
		validators: [
			new RequiredFileUploadValidator('Select any other relevant policies'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOtherRelevantPolicies,
		actionHiddenText: 'any other relevant policies'
	},
	communityInfrastructureLevy: {
		type: 'boolean',
		title: 'Community infrastructure levy',
		question: 'Do you have a community infrastructure levy?',
		fieldName: 'infrastructureLevy',
		url: 'community-infrastructure-levy',
		validators: [new RequiredValidator('Select yes if you have a community infrastructure levy')],
		html: 'resources/community-infrastructure-levy/content.html'
	},
	communityInfrastructureLevyUpload: {
		type: 'multi-file-upload',
		title: 'Upload your community infrastructure levy',
		question: 'Upload your community infrastructure levy',
		fieldName: 'uploadInfrastructureLevy',
		url: 'upload-community-infrastructure-levy',
		validators: [
			new RequiredFileUploadValidator('Select your community infrastructure levy'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.communityInfrastructureLevyUpload,
		actionHiddenText: 'your community infrastructure levy'
	},
	communityInfrastructureLevyAdopted: {
		type: 'boolean',
		title: 'Community infrastructure levy formally adopted',
		question: 'Is the community infrastructure levy formally adopted?',
		fieldName: 'infrastructureLevyAdopted',
		url: 'community-infrastructure-levy-adopted',
		validators: [
			new RequiredValidator('Select yes if the community infrastructure levy is formally adopted')
		]
	},
	communityInfrastructureLevyAdoptedDate: {
		type: 'date',
		title: 'Date community infrastructure levy adopted',
		question: 'When was the community infrastructure levy formally adopted?',
		fieldName: 'infrastructureLevyAdoptedDate',
		hint: `For example, ${getExampleDate('past')}`,
		validators: [
			new DateValidator('the date the infrastructure levy was formally adopted', {
				ensurePast: true
			})
		]
	},
	communityInfrastructureLevyAdoptDate: {
		type: 'date',
		title: 'Date community infrastructure levy expected to be adopted',
		question: 'When do you expect to formally adopt the community infrastructure levy?',
		fieldName: 'infrastructureLevyExpectedDate',
		hint: `For example, ${getExampleDate('future')}`,
		validators: [
			new DateValidator('the date you expect to formally adopt the community infrastructure levy', {
				ensureFuture: true
			})
		]
	},
	uploadNeighbourLetterAddresses: {
		type: 'multi-file-upload',
		title: 'Letter sent to neighbours',
		question: 'Upload letters or emails sent to interested parties with their addresses',
		fieldName: 'uploadLettersInterestedParties',
		url: 'letters-interested-parties',
		validators: [
			new RequiredFileUploadValidator(
				'Select letters or emails sent to interested parties with their addresses'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadNeighbourLetterAddresses,
		actionHiddenText: 'letters or emails sent to interested parties with their addresses'
	},
	treePreservationOrder: {
		type: 'boolean',
		title: 'Tree Preservation Order',
		question: 'Does a Tree Preservation Order (TPO) apply to any part of the appeal site?',
		fieldName: 'treePreservationOrder',
		url: 'tree-preservation-order',
		validators: [
			new RequiredValidator(
				'Select yes if a Tree Preservation Order (TPO) applies to any part of the site'
			)
		]
	},
	treePreservationPlanUpload: {
		type: 'multi-file-upload',
		title: 'Tree Preservation Order extent',
		question: 'Upload a plan showing the extent of the order',
		fieldName: 'uploadTreePreservationOrder',
		url: 'upload-plan-showing-order',
		validators: [
			new RequiredFileUploadValidator('Select a plan showing the extent of the order'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.treePreservationPlanUpload,
		actionHiddenText: 'a plan showing the extent of the order'
	},
	uploadDefinitiveMap: {
		type: 'multi-file-upload',
		title: 'Definitive map and statement extract',
		question: 'Upload the definitive map and statement extract',
		fieldName: 'uploadDefinitiveMapStatement',
		url: 'upload-definitive-map-statement',
		validators: [
			new RequiredFileUploadValidator('Select the definitive map and statement extract'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadDefinitiveMap,
		actionHiddenText: 'the definitive map and statement extract'
	},
	supplementaryPlanning: {
		type: 'boolean',
		title: 'Supplementary planning documents',
		question:
			'Did any supplementary planning documents inform the outcome of the planning application?',
		fieldName: 'supplementaryPlanningDocs',
		url: 'supplementary-planning-documents',
		html: 'resources/supplementary-planning-documents/content.html',
		validators: [
			new RequiredValidator(
				'Select yes if any supplementary planning documents informed the outcome of the planning application'
			)
		]
	},
	supplementaryPlanningUpload: {
		type: 'multi-file-upload',
		title: 'Upload supplementary planning documents',
		question: 'Upload relevant policy extracts and supplementary planning documents',
		fieldName: 'uploadSupplementaryPlanningDocs',
		url: 'upload-policies-supplementary-planning-documents',

		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant policy extracts and supplementary planning documents'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.supplementaryPlanningUpload,
		actionHiddenText: 'relevant policy extracts and supplementary planning documents'
	},
	scheduledMonument: {
		type: 'boolean',
		title: 'Affects a scheduled monument',
		question: 'Would the development affect a scheduled monument?',
		fieldName: 'affectsScheduledMonument',
		url: 'scheduled-monument',
		validators: [
			new RequiredValidator('Select yes if the development would affect a scheduled monument')
		]
	},
	gypsyOrTraveller: {
		type: 'boolean',
		title: 'Gypsy or Traveller',
		question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
		fieldName: 'gypsyTraveller',
		url: 'gypsy-traveller',
		validators: [
			new RequiredValidator(
				'Select yes if the development relates to anyone claiming to be a Gypsy or Traveller'
			)
		]
	},
	statutoryConsultees: {
		type: 'radio',
		title: 'Statutory consultees',
		question: 'Did you consult all the relevant statutory consultees about the development?',
		fieldName: 'statutoryConsultees',
		url: 'statutory-consultees',
		validators: [
			new RequiredValidator(
				'Select yes if you consulted all the relevant statutory consultees about the development'
			),
			new ConditionalRequiredValidator(),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Consulted bodies must be ${appealFormV2.textInputMaxLength} characters or less`
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
					fieldName: 'consultedBodiesDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	protectedSpecies: {
		type: 'boolean',
		title: 'Protected species',
		question: 'Would the development affect a protected species?',
		fieldName: 'protectedSpecies',
		url: 'protected-species',
		validators: [
			new RequiredValidator('Select yes if the development would affect a protected species')
		]
	},
	rightOfWayCheck: {
		type: 'boolean',
		title: 'Public right of way',
		question: 'Would a public right of way need to be removed or diverted?',
		fieldName: 'publicRightOfWay',
		url: 'public-right-of-way',
		validators: [
			new RequiredValidator(
				'Select yes if a public right of way would need to be removed or diverted'
			)
		]
	},
	areaOfOutstandingNaturalBeauty: {
		type: 'boolean',
		title: 'Area of outstanding natural beauty',
		question: 'Is the appeal site in an area of outstanding natural beauty?',
		fieldName: 'areaOutstandingBeauty',
		url: 'area-of-outstanding-natural-beauty',
		validators: [
			new RequiredValidator(
				'Select yes if the appeal site is in an area of outstanding natural beauty'
			)
		]
	},
	designatedSitesCheck: {
		type: 'checkbox',
		title: 'Designated sites',
		question: 'Is the development in, near or likely to affect any designated sites?',
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
					fieldName: 'otherDesignations'
				}
			},
			{
				[DIVIDER]: 'or'
			},
			{
				text: 'No, it is not in, near or likely to affect any designated sites',
				value: 'None',
				behaviour: 'exclusive'
			}
		]
	},
	screeningOpinion: {
		type: 'boolean',
		title: 'Issued screening opinion',
		question: 'Have you issued a screening opinion?',
		fieldName: 'screeningOpinion',
		url: 'screening-opinion',
		validators: [new RequiredValidator('Select yes if you have issued a screening opinion')]
	},
	screeningOpinionEnvironmentalStatement: {
		type: 'boolean',
		title: 'Screening opinion environmental statement',
		question: 'Did your screening opinion say the development needed an environmental statement?',
		fieldName: 'environmentalStatement',
		url: 'screening-opinion-environmental-statement',
		validators: [
			new RequiredValidator(
				'Select yes if your screening opinion says the development needs an environmental statement'
			)
		]
	},
	scopingOpinion: {
		type: 'boolean',
		title: 'Did you receive a scoping opinion?',
		question: 'Did you receive a scoping opinion?',
		fieldName: 'scopingOpinion',
		url: 'scoping-opinion',
		validators: [new RequiredValidator('Select yes if you have issued a scoping opinion')]
	},
	environmentalImpactSchedule: {
		type: 'radio',
		title: 'Schedule type',
		question: 'Is the development a schedule 1 or schedule 2 development?',
		fieldName: 'environmentalImpactSchedule',
		url: 'schedule-1-or-2',
		validators: [new RequiredValidator('Select the development schedule')],
		options: [
			{
				text: 'Yes, schedule 1',
				value: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1
			},
			{
				text: 'Yes, schedule 2',
				value: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2
			},
			{
				[DIVIDER]: 'or'
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	uploadEnvironmentalStatement: {
		type: 'multi-file-upload',
		title: 'Upload the environmental statement and supporting information',
		question: 'Upload the environmental statement and supporting information',
		fieldName: 'uploadEnvironmentalStatement',
		url: 'upload-environmental-statement',
		validators: [
			new RequiredFileUploadValidator(
				'Select the environmental statement and supporting information'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadEnvironmentalStatement,
		actionHiddenText: 'the environmental statement and supporting information'
	},
	meetsColumnTwoThreshold: {
		type: 'boolean',
		title: 'Meets or exceeds the threshold or criteria in column 2	',
		question: 'Does the development meet or exceed the threshold or criteria in column 2?',
		fieldName: 'columnTwoThreshold',
		url: 'column-2-threshold',
		validators: [
			new RequiredValidator(
				'Select yes if the development meets or exceeds the threshold or criteria in column 2'
			)
		]
	},
	sensitiveArea: {
		type: 'radio',
		title: 'In, partly in, or likely to affect a sensitive area',
		question: 'Is the development in, partly in, or likely to affect a sensitive area?',
		fieldName: 'sensitiveArea',
		url: 'sensitive-area',
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the sensitive area',
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
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Sensitive area description must be ${appealFormV2.textInputMaxLength} characters or less`
				},
				fieldName: getConditionalFieldName('sensitiveArea', 'sensitiveAreaDetails')
			})
		]
	},
	screeningOpinionUpload: {
		type: 'multi-file-upload',
		title: 'Screening opinion',
		question: 'Upload your screening opinion and any correspondence',
		fieldName: 'uploadScreeningOpinion',
		url: 'upload-screening-opinion',
		validators: [
			new RequiredFileUploadValidator('Select your screening opinion and any correspondence'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.screeningOpinionUpload,
		actionHiddenText: 'your screening opinion and any correspondence'
	},
	scopingOpinionUpload: {
		type: 'multi-file-upload',
		title: 'Scoping opinion',
		question: 'Upload your scoping opinion',
		fieldName: 'uploadScopingOpinion',
		url: 'upload-scoping-opinion',
		validators: [
			new RequiredFileUploadValidator('Select your scoping opinion'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.scopingOpinionUpload,
		actionHiddenText: 'your scoping opinion'
	},
	uploadScreeningDirection: {
		type: 'multi-file-upload',
		title: 'Upload the screening direction',
		question: 'Upload the screening direction',
		fieldName: 'uploadScreeningDirection',
		url: 'upload-screening-direction',
		validators: [
			new RequiredFileUploadValidator('Select the screening direction'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadScreeningDirection,
		actionHiddenText: 'the screening direction'
	},
	developmentDescription: {
		type: 'radio',
		title: 'Development description',
		question: 'Description of development',
		fieldName: 'developmentDescription',
		url: 'development-description',
		validators: [new RequiredValidator('Select a description of development')],
		options: [
			{
				text: 'Agriculture and aquaculture',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.AGRICULTURE_AQUACULTURE
			},
			{
				text: 'Changes and extensions',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.CHANGE_EXTENSIONS
			},
			{
				text: 'Chemical industry (unless included in Schedule 1)',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.CHEMICAL_INDUSTRY
			},
			{
				text: 'Energy industry',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.ENERGY_INDUSTRY
			},
			{
				text: 'Extractive industry',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.EXTRACTIVE_INDUSTRY
			},
			{
				text: 'Food industry',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.FOOD_INDUSTRY
			},
			{
				text: 'Infrastructure projects',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.INFRASTRUCTURE_PROJECTS
			},
			{
				text: 'Mineral industry',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.MINERAL_INDUSTRY
			},
			{
				text: 'Other projects',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.OTHER_PROJECTS
			},
			{
				text: 'Production and processing of metals',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.PRODUCTION_PROCESSING_OF_METALS
			},
			{
				text: 'Rubber industry',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.RUBBER_INDUSTRY
			},
			{
				text: 'Textile, leather, wood and paper industries',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.TEXTILE_INDUSTRIES
			},
			{
				text: 'Tourism and leisure',
				value: APPEAL_EIA_DEVELOPMENT_DESCRIPTION.TOURISM_LEISURE
			}
		]
	},
	submitEnvironmentalStatement: {
		type: 'radio',
		title: 'Did the applicant submit an environmental statement?',
		question: 'Did the applicant submit an environmental statement?',
		fieldName: 'applicantSubmittedEnvironmentalStatement',
		url: 'environmental-statement',
		options: [
			{
				text: 'Yes',
				value: 'yes'
			},
			{
				text: 'No',
				value: 'no'
			}
		],
		validators: [
			new RequiredValidator('Select yes if the applicant submitted an environmental statement')
		]
	},
	siteArea: {
		type: 'number',
		title: 'What is the area of the appeal site?',
		question: 'What is the area of the appeal site?',
		suffix: 'm\u00B2',
		fieldName: 'siteAreaSquareMetres',
		hint: 'Total site area, in square metres.',
		url: 'site-area',
		validators: [
			new RequiredValidator('Enter the area of the appeal site'),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${appealFormV2.textInputMaxLength}}$`, 'gi'),
				regexMessage: 'Enter the area of the site using numbers 0 to 9',
				min: minValue,
				minMessage: `Appeal site area must be at least ${minValue}m\u00B2`,
				max: maxValue,
				maxMessage: `Appeal site area must be ${maxValue.toLocaleString()}m\u00B2 or less`,
				fieldName: 'siteAreaSquareMetres'
			})
		]
	},
	ownsAllLand: {
		type: 'boolean',
		title: 'Do you own all of the land involved in the appeal?',
		question: 'Do you own all of the land involved in the appeal?',
		fieldName: 'ownsAllLand',
		url: 'own-all-land',
		validators: [
			new RequiredValidator('Select yes if you own all of the land involved in the appeal')
		]
	},
	ownsSomeLand: {
		type: 'boolean',
		title: 'Do you own some of the land involved in the appeal?',
		question: 'Do you own some of the land involved in the appeal?',
		fieldName: 'ownsSomeLand',
		url: 'own-some-land',
		validators: [
			new RequiredValidator('Select yes if you own some of the land involved in the appeal')
		]
	},
	knowsWhoOwnsRestOfLand: {
		type: 'radio',
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
	},
	knowsWhoOwnsLandInvolved: {
		type: 'radio',
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
	},
	tellingLandowners: {
		type: 'boolean',
		title: 'Have the landowners been told about the appeal?',
		question: 'Telling the landowners',
		interfaceType: 'checkbox',
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
	},
	identifyingLandowners: {
		type: 'boolean',
		title: 'Have you attempted to identify the landowners?',
		question: 'Identifying the landowners',
		interfaceType: 'checkbox',
		html: 'resources/land-ownership/identifying-landowners.html',
		fieldName: 'identifiedOwners',
		url: 'identifying-landowners',
		options: [
			{
				text: 'I confirm that I’ve attempted to identify all the landowners, but have not been successful',
				value: 'yes'
			}
		],
		validators: [
			new RequiredValidator(
				'You must confirm that you’ve attempted to identify all the landowners, but have not been successful'
			)
		]
	},
	advertisingAppeal: {
		type: 'boolean',
		title: 'Have you advertised the appeal?',
		question: 'Advertising your appeal',
		interfaceType: 'checkbox',
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
	},
	inspectorAccess: {
		type: 'radio',
		title: 'Will an inspector need to access your land or property?',
		question: 'Will an inspector need to access your land or property?',
		html: 'resources/inspector-access/content.html',
		fieldName: 'appellantSiteAccess',
		url: 'inspector-need-access',
		validators: [
			new RequiredValidator('Select yes if an inspector will need to access your land or property'),
			new ConditionalRequiredValidator(
				'Enter a reason why an inspector cannot view the appeal site from a public road or footpath'
			),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Reason must be ${appealFormV2.textInputMaxLength} characters or less`
				},
				fieldName: getConditionalFieldName('appellantSiteAccess', 'appellantSiteAccessDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question:
						'Enter a reason why an inspector cannot view the appeal site from a public road or footpath.',
					hint: 'For example, the appeal site is at the rear of a terraced property.',
					fieldName: 'appellantSiteAccessDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	healthAndSafety: {
		type: 'radio',
		title: 'Are there any health and safety issues on the appeal site?',
		question: 'Health and safety issues',
		html: 'resources/health-and-safety/content.html',
		legend: 'Are there any health and safety issues on the appeal site?',
		fieldName: 'appellantSiteSafety',
		url: 'health-safety-issues',
		validators: [
			new RequiredValidator(
				'Select yes if there are any health and safety issues on the appeal site'
			),
			new ConditionalRequiredValidator('Enter the health and safety issues'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Health and safety issues must be ${appealFormV2.textInputMaxLength} characters or less`
				},
				fieldName: getConditionalFieldName('appellantSiteSafety', 'appellantSiteSafetyDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the health and safety issues',
					fieldName: 'appellantSiteSafetyDetails',
					type: 'textarea'
				}
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	},
	uploadOriginalApplicationForm: {
		type: 'multi-file-upload',
		title: 'Application form',
		question: 'Upload your application form',
		description:
			'Upload the application form that you sent to the local planning authority, including the date. Do not upload a draft application.\nIf you do not have your application form, you can search for it on the local planning authority’s website.',
		fieldName: 'uploadOriginalApplicationForm',
		url: 'upload-application-form',
		validators: [
			new RequiredFileUploadValidator('Select your application form'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOriginalApplicationForm,
		actionHiddenText: 'your application form'
	},
	uploadApplicationDecisionLetter: {
		type: 'multi-file-upload',
		title: 'Decision letter',
		question: 'Upload the decision letter from the local planning authority',
		description: `This letter tells you about the decision on your application. \n\nWe need the letter from the local planning authority that tells you their decision on your application (also called a ‘decision notice’).\n\nDo not upload the planning officer’s report.`,
		fieldName: 'uploadApplicationDecisionLetter',
		url: 'upload-decision-letter',
		validators: [
			new RequiredFileUploadValidator('Select the decision letter'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadApplicationDecisionLetter,
		actionHiddenText: 'the decision letter from the local planning authority'
	},
	uploadChangeOfDescriptionEvidence: {
		type: 'multi-file-upload',
		title: 'Agreement to change the description of development',
		question: 'Upload evidence of your agreement to change the description of development',
		description:
			'For example, an email or letter from the local planning authority that confirms they have changed the description of development.',
		fieldName: 'uploadChangeOfDescriptionEvidence',
		url: 'upload-description-evidence',
		validators: [
			new RequiredFileUploadValidator(
				'Select the evidence of your agreement to change the description of development'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadChangeOfDescriptionEvidence,
		actionHiddenText: 'evidence of your agreement to change the description of development'
	},
	enterApplicationReference: {
		type: 'single-line-input',
		title: 'What is the application reference number?',
		question: 'What is the application reference number?',
		fieldName: 'applicationReference',
		url: 'reference-number',
		hint: 'You can find this on any correspondence from the local planning authority. For example, the letter confirming your application.',
		validators: [
			new RequiredValidator('Enter the application reference number'),
			new StringValidator({
				maxLength: {
					maxLength: 250,
					maxLengthMessage: `Reference number must be 250 characters or less`
				}
			})
		]
	},
	planningApplicationDate: {
		type: 'date',
		title: 'What date did you submit your application?',
		question: 'What date did you submit your application?',
		fieldName: 'onApplicationDate',
		url: 'application-date',
		hint: `For example, ${getExampleDate('past')}`,
		validators: [
			new DateValidator('the date you submitted your application', {
				ensurePast: true
			})
		]
	},
	enterDevelopmentDescription: {
		type: 'text-entry',
		title: 'Enter the description of development that you submitted in your application',
		question: 'Enter the description of development that you submitted in your application',
		fieldName: 'developmentDescriptionOriginal',
		url: 'enter-description-of-development',
		hint: 'If the local planning authority changed the description of development, you can upload evidence of your agreement to change the description later.',
		validators: [
			new RequiredValidator('Enter a description'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Your description must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			})
		]
	},
	updateDevelopmentDescription: {
		type: 'boolean',
		title: 'Did the local planning authority change the description of development?',
		question: 'Did the local planning authority change the description of development?',
		fieldName: 'updateDevelopmentDescription',
		url: 'description-development-correct',
		html: 'resources/development-description/content.html',
		validators: [
			new RequiredValidator(
				'Select yes if the local planning authority changed the description of development'
			)
		],
		options: [
			{
				text: 'Yes, I agreed a new description with the local planning authority',
				value: 'yes',
				attributes: { 'data-cy': 'answer-yes' }
			},
			{
				text: 'No',
				value: 'no',
				attributes: { 'data-cy': 'answer-no' }
			}
		]
	},
	grantOrLoan: {
		type: 'boolean',
		title: 'Was a grant or loan made to preserve the listed building at the appeal site?',
		question: 'Was a grant or loan made to preserve the listed building at the appeal site?',
		fieldName: 'section3aGrant',
		url: 'preserve-grant-loan',
		hint: 'We only need to know about grants and loans made under section 3A or 4 of the Historic Buildings and Ancient Monuments Act 1953.',
		validators: [
			new RequiredValidator(
				'Select yes if a grant or loan was made to preserve the listed building at the appeal site?'
			)
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				attributes: { 'data-cy': 'answer-yes' }
			},
			{
				text: 'No',
				value: 'no',
				attributes: { 'data-cy': 'answer-no' }
			}
		]
	},
	uploadAppellantStatement: {
		type: 'multi-file-upload',
		title: 'Appeal statement',
		question: 'Upload your appeal statement',
		html: 'resources/upload-appeal-statement/content.html',
		fieldName: 'uploadAppellantStatement',
		url: 'upload-appeal-statement',
		validators: [
			new RequiredFileUploadValidator('Select your appeal statement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantStatement,
		actionHiddenText: 'your appeal statement'
	},
	uploadStatementCommonGround: {
		type: 'multi-file-upload',
		title: 'Draft statement of common ground',
		question: 'Upload your draft statement of common ground',
		fieldName: 'uploadStatementCommonGround',
		url: 'upload-draft-statement-common-ground',
		validators: [
			new RequiredFileUploadValidator('Select the draft statement of common ground'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadStatementCommonGround,
		actionHiddenText: 'your draft statement of common ground'
	},
	costApplication: {
		type: 'boolean',
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
		],
		validators: [
			new RequiredValidator('Select yes if you need to apply for an award of appeal costs')
		]
	},
	uploadCostApplication: {
		type: 'multi-file-upload',
		title: 'Application for an award of appeal costs',
		question: 'Upload your application for an award of appeal costs',
		fieldName: 'uploadCostApplication',
		url: 'upload-appeal-costs-application',
		validators: [
			new RequiredFileUploadValidator('Select your application for an award of appeal costs'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadCostApplication,
		actionHiddenText: 'your application for an award of appeal costs'
	},
	anyOtherAppeals: {
		type: 'boolean',
		title: 'Are there other appeals linked to your development?',
		question: 'Are there other appeals linked to your development?',
		fieldName: 'appellantLinkedCase',
		url: 'other-appeals',
		html: 'resources/other-appeals/content.html',
		validators: [
			new RequiredValidator('Select yes if there are other appeals linked to your development')
		]
	},
	linkAppeals: {
		type: 'list-add-more',
		pageTitle: 'You’ve added a linked appeal',
		title: 'n/a',
		question: 'Add another appeal?',
		fieldName: 'appellantLinkedCaseAdd',
		url: 'enter-appeal-reference',
		subQuestionLabel: 'Other appeal',
		subQuestionTitle: 'Enter the appeal reference number',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another linked appeal')],
		subQuestionProps: {
			type: 'case',
			title: 'Enter the appeal reference number',
			question: 'Enter the appeal reference number',
			fieldName: fieldNames.appellantLinkedCaseReference,
			html: 'resources/appellant-linked-case/content.html',
			hint: 'For example, 0221532.',
			validators: [
				new RequiredValidator('Enter the appeal reference number'),
				new StringEntryValidator(appealReferenceNumberValidation)
			],
			viewFolder: 'add-more'
		}
	},
	applicationName: {
		type: 'boolean',
		title: 'Was the application made in your name? ',
		question: 'Was the application made in your name?',
		fieldName: 'isAppellant',
		url: 'application-name',
		html: 'resources/your-details/application-name.html',
		validators: [new RequiredValidator('Select yes if the application was made in your name')],
		options: [
			{
				text: 'Yes, the application was made in my name',
				value: 'yes',
				attributes: { 'data-cy': 'answer-yes' }
			},
			{
				text: "No, I'm acting on behalf of the applicant",
				value: 'no',
				attributes: { 'data-cy': 'answer-no' }
			}
		]
	},
	applicantName: {
		type: 'multi-field-input',
		title: "What is the applicant's name?",
		question: "What is the applicant's name?",
		html: 'resources/your-details/applicant-name.html',
		fieldName: 'applicantName',
		url: 'applicant-name',
		formatType: 'contactDetails',
		inputFields: [
			{
				fieldName: 'appellantFirstName',
				label: 'First name',
				formatJoinString: ' ',
				attributes: { spellcheck: 'false', autocomplete: 'given-name' }
			},
			{
				fieldName: 'appellantLastName',
				label: 'Last name',
				formatJoinString: '\n',
				attributes: { spellcheck: 'false', autocomplete: 'family-name' }
			},
			{
				fieldName: 'appellantCompanyName',
				label: 'Company name (optional)',
				formatJoinString: '',
				attributes: { spellcheck: 'false' }
			}
		],
		validators: [
			new MultiFieldInputValidator({
				requiredFields: [
					{
						fieldName: 'appellantFirstName',
						errorMessage: "Enter the applicant's first name",
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'First name must be 250 characters or less'
						}
					},
					{
						fieldName: 'appellantLastName',
						errorMessage: "Enter the applicant's last name",
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'Last name must be 250 characters or less'
						}
					}
				],
				noInputsMessage: "Enter the applicant's name"
			})
		]
	},
	contactDetails: {
		type: 'multi-field-input',
		title: 'Contact details',
		question: 'Contact details',
		fieldName: 'contactDetails',
		url: 'contact-details',
		formatType: 'contactDetails',
		inputFields: [
			{
				fieldName: 'contactFirstName',
				label: 'First name',
				formatJoinString: ' ',
				attributes: { spellcheck: 'false', autocomplete: 'given-name' }
			},
			{
				fieldName: 'contactLastName',
				label: 'Last name',
				formatJoinString: '\n',
				attributes: { spellcheck: 'false', autocomplete: 'family-name' }
			},
			{
				fieldName: 'contactCompanyName',
				label: 'Organisation name (optional)',
				formatJoinString: '',
				attributes: { spellcheck: 'false' }
			}
		],
		validators: [
			new MultiFieldInputValidator({
				requiredFields: [
					{
						fieldName: 'contactFirstName',
						errorMessage: 'Enter your first name',
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'First name must be 250 characters or less'
						}
					},
					{
						fieldName: 'contactLastName',
						errorMessage: 'Enter your last name',
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'Last name must be 250 characters or less'
						}
					}
				],
				noInputsMessage: "Enter the applicant's name"
			})
		]
	},
	contactPhoneNumber: {
		type: 'single-line-input',
		title: 'What is your phone number?',
		question: 'What is your phone number?',
		description: 'We may use your phone number to contact you about the appeal.',
		label: 'UK telephone number',
		fieldName: 'contactPhoneNumber',
		url: 'phone-number',
		inputAttributes: { type: 'tel', autocomplete: 'tel' },
		validators: [
			new RequiredValidator('Enter a phone number'),
			new StringValidator({
				regex: {
					regex: /^\+?[0-9 ]{10,15}$/,
					regexMessage:
						'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
				}
			})
		]
	},
	appealSiteAddress: {
		type: 'site-address',
		title: 'What is the address of the appeal site?',
		question: 'What is the address of the appeal site?',
		fieldName: 'siteAddress',
		html: 'resources/site-address/site-address.html',
		url: 'appeal-site-address',
		viewFolder: 'address-entry',
		validators: [new AddressValidator()]
	},
	s78SiteArea: {
		type: 'unit-option',
		title: 'What is the area of the appeal site?',
		question: 'What is the area of the appeal site?',
		fieldName: 'siteAreaUnits',
		conditionalFieldName: 'siteAreaSquareMetres',
		url: 'site-area',
		validators: [
			new RequiredValidator(
				'Select if the area of the appeal site is in square metres or hectares'
			),
			new UnitOptionEntryValidator({
				errorMessage: 'Enter the area of the appeal site',
				unit: 'Appeal site area'
			})
		],
		options: [
			{
				text: 'Square metres',
				value: 'm\u00B2',
				conditional: {
					label: 'Site area, in square metres',
					fieldName: 'siteAreaSquareMetres_m\u00B2',
					suffix: 'm\u00B2'
				},
				validator: {
					min: minValue,
					max: maxValue,
					regexps: [
						{
							regex: new RegExp(`^[0-9]{0,${appealFormV2.textInputMaxLength}}$`, 'gi'),
							regexMessage: 'Enter the area of the site using numbers 0 to 9'
						}
					]
				}
			},
			{
				text: 'Hectares',
				value: 'ha',
				conditional: {
					label: 'Site area, in hectares',
					fieldName: 'siteAreaSquareMetres_hectares',
					suffix: 'ha',
					conversionFactor: 10000
				},
				validator: {
					min: minValueHectres,
					max: maxValue,
					regexps: [
						{
							regex: new RegExp('^\\d+(\\.\\d+)?$'),
							regexMessage: 'Enter the area of the site using numbers 0 to 9'
						},

						{
							regex: new RegExp('^\\d+(\\.\\d{1,2})?$'),
							regexMessage: 'Appeal site area must be 2 decimal places or less, like 2 or 2.13'
						}
					]
				}
			}
		]
	},
	appellantGreenBelt: {
		type: 'boolean',
		title: 'Is the appeal site in a green belt?',
		question: 'Is the appeal site in a green belt?',
		fieldName: 'appellantGreenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator('Select yes if the appeal site is in a green belt')]
	},
	submitPlanningObligation: {
		type: 'boolean',
		title: 'Do you plan to submit a planning obligation to support your appeal?',
		question: 'Do you plan to submit a planning obligation to support your appeal?',
		fieldName: 'planningObligation',
		url: 'submit-planning-obligation',
		validators: [
			new RequiredValidator(
				'Select yes if you plan to submit a planning obligation to support your appeal'
			)
		]
	},
	planningObligationStatus: {
		type: 'radio',
		title: 'What is the status of your planning obligation?',
		question: 'What is the status of your planning obligation?',
		fieldName: 'statusPlanningObligation',
		url: 'status-planning-obligation',
		validators: [new RequiredValidator('Select the status of your planning obligation')],
		options: [
			{
				text: 'Finalised and ready to submit',
				value: 'finalised'
			},
			{
				text: 'Not started yet',
				value: 'not started yet',
				conditionalText: {
					html: 'The deadline to submit your finalised planning obligation is around 6 weeks after you submit your appeal. We’ll tell you the exact date when we confirm your appeal.'
				}
			}
		]
	},
	uploadPlanningObligation: {
		type: 'multi-file-upload',
		title: 'Planning obligation',
		question: 'Upload your planning obligation',
		fieldName: 'uploadPlanningObligation',
		url: 'upload-planning-obligation',
		validators: [
			new RequiredFileUploadValidator('Select your planning obligation'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadPlanningObligation,
		actionHiddenText: 'your planning obligation'
	},
	designAccessStatement: {
		type: 'boolean',
		title: 'Did you submit a design and access statement with your application?',
		question: 'Did you submit a design and access statement with your application?',
		fieldName: 'designAccessStatement',
		url: 'submit-design-access-statement',
		html: 'resources/plans-drawings/design-access.html',
		validators: [
			new RequiredValidator(
				'Select yes if you submitted a design and access statement with your application'
			)
		]
	},
	uploadDesignAccessStatement: {
		type: 'multi-file-upload',
		title: 'Design and access statement',
		question: 'Upload your design and access statement',
		fieldName: 'uploadDesignAccessStatement',
		url: 'upload-design-access-statement',
		html: 'resources/plans-drawings/upload-design-access.html',
		validators: [
			new RequiredFileUploadValidator('Select your design and access statement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadDesignAccessStatement,
		actionHiddenText: 'your design and access statement'
	},
	uploadPlansDrawingsHAS: {
		type: 'multi-file-upload',
		title: 'Upload the plans, drawings and list of plans',
		question: 'Upload the plans, drawings and list of plans',
		fieldName: 'uploadPlansDrawings',
		url: 'upload-plans-drawings',
		validators: [
			new RequiredFileUploadValidator('Select the plans, drawings and list of plans'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadPlansDrawings,
		actionHiddenText: 'the plans, drawings and list of plans'
	},
	uploadPlansDrawingsDocuments: {
		type: 'multi-file-upload',
		title: 'Plans, drawings and supporting documents',
		question:
			'Upload your plans, drawings and supporting documents you submitted with your application',
		fieldName: 'uploadPlansDrawings',
		url: 'upload-plans-drawings-documents',
		html: 'resources/plans-drawings/upload-plans-drawings.html',
		validators: [
			new RequiredFileUploadValidator('Select your plans, drawings and supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadPlansDrawings,
		actionHiddenText:
			'your plans, drawings and supporting documents you submitted with your application'
	},
	newPlansDrawings: {
		type: 'boolean',
		title: 'Do you have any new plans or drawings that support your appeal?',
		question: 'Do you have any new plans or drawings that support your appeal?',
		fieldName: 'newPlansDrawings',
		url: 'new-plans-drawings',
		validators: [
			new RequiredValidator(
				'Select yes if you have any new plans or drawings that support your appeal'
			)
		]
	},
	uploadNewPlansDrawings: {
		type: 'multi-file-upload',
		title: 'New plans or drawings',
		question: 'Upload your new plans or drawings',
		fieldName: 'uploadNewPlansDrawings',
		url: 'upload-new-plans-drawings',
		validators: [
			new RequiredFileUploadValidator('Select your new plans or drawings'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadNewPlansDrawings,
		actionHiddenText: 'your new plans or drawings'
	},
	otherNewDocuments: {
		type: 'boolean',
		title: 'Do you have any other new documents that support your appeal?',
		question: 'Do you have any other new documents that support your appeal?',
		fieldName: 'otherNewDocuments',
		url: 'other-new-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have any other new documents that support your appeal'
			)
		]
	},
	separateOwnershipCert: {
		type: 'boolean',
		title:
			'Did you submit a separate ownership certificate and agricultural land declaration with your application?',
		question:
			'Did you submit a separate ownership certificate and agricultural land declaration with your application?',
		fieldName: 'ownershipCertificate',
		url: 'separate-ownership-certificate',
		html: 'resources/ownership-certificate/content.html',
		validators: [
			new RequiredValidator(
				'Select yes if you submitted a separate ownership certificate and agricultural land declaration with your application'
			)
		]
	},
	uploadSeparateOwnershipCert: {
		type: 'multi-file-upload',
		title: 'Separate ownership certificate and agricultural land declaration',
		question: 'Upload your separate ownership certificate and agricultural land declaration',
		fieldName: 'uploadOwnershipCertificate',
		url: 'upload-certificate-declaration',
		validators: [
			new RequiredFileUploadValidator(
				'Select your separate ownership certificate and agricultural land declaration'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOwnershipCertificate,
		actionHiddenText: 'your separate ownership certificate and agricultural land declaration'
	},
	uploadOtherNewDocuments: {
		type: 'multi-file-upload',
		title: 'Other new supporting documents',
		question: 'Upload your other new supporting documents',
		fieldName: 'uploadOtherNewDocuments',
		url: 'upload-other-new-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your other new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOtherNewDocuments,
		actionHiddenText: 'your other new supporting documents'
	},
	appellantProcedurePreference: {
		type: 'radio',
		title: 'How would you prefer us to decide your appeal?',
		question: 'How would you prefer us to decide your appeal?',
		fieldName: 'appellantProcedurePreference',
		url: 'decide-appeal',
		validators: [new RequiredValidator('Select how you would prefer us to decide your appeal')],
		options: [
			{
				text: 'Written representations',
				value: APPEAL_CASE_PROCEDURE.WRITTEN,
				hint: {
					text: 'For appeals where the issues are clear from written statements and a site visit. This is the quickest and most common way to make an appeal.'
				}
			},
			{
				text: 'Hearing',
				value: APPEAL_CASE_PROCEDURE.HEARING,
				hint: {
					text: 'For appeals with more complex issues. The Inspector leads a discussion to answer questions they have about the appeal.'
				}
			},
			{
				text: 'Inquiry',
				value: APPEAL_CASE_PROCEDURE.INQUIRY,
				hint: {
					text: 'For appeals with very complex issues. Appeal evidence is tested by legal representatives, who question witnesses under oath.'
				}
			}
		]
	},
	appellantPreferHearing: {
		type: 'text-entry',
		title: 'Why would you prefer a hearing?',
		question: 'Why would you prefer a hearing?',
		url: 'why-prefer-hearing',
		fieldName: 'appellantPreferHearingDetails',
		validators: [
			new RequiredValidator('Enter why you would prefer a hearing'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Why you would prefer a hearing must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			})
		]
	},
	agriculturalHolding: {
		type: 'boolean',
		title: 'Is the appeal site part of an agricultural holding?',
		question: 'Is the appeal site part of an agricultural holding?',
		fieldName: 'agriculturalHolding',
		url: 'agricultural-holding',
		html: 'resources/agricultural-holding/content.html',
		validators: [
			new RequiredValidator('Select yes if the appeal site is part of an agricultural holding')
		]
	},
	tenantAgriculturalHolding: {
		type: 'boolean',
		title: 'Are you a tenant of the agricultural holding?',
		question: 'Are you a tenant of the agricultural holding?',
		fieldName: 'tenantAgriculturalHolding',
		url: 'tenant-agricultural-holding',
		validators: [
			new RequiredValidator('Select yes if you are a tenant of the agricultural holding')
		]
	},
	otherTenantsAgriculturalHolding: {
		type: 'boolean',
		title: 'Are there any other tenants?',
		question: 'Are there any other tenants?',
		fieldName: 'otherTenantsAgriculturalHolding',
		url: 'other-tenants',
		validators: [new RequiredValidator('Select yes if there are any other tenants')]
	},
	informedTenantsAgriculturalHolding: {
		type: 'boolean',
		title: 'Have the tenants been told about the appeal?',
		question: 'Telling the tenants',
		interfaceType: 'checkbox',
		html: 'resources/agricultural-holding/telling-tenants.html',
		description: 'Have the tenants been told about the appeal?',
		fieldName: 'informedTenantsAgriculturalHolding',
		url: 'telling-tenants',
		options: [
			{
				text: 'I confirm that I’ve told all the tenants about my appeal within the last 21 days using a copy of the form in annexe 2A',
				value: 'yes'
			}
		],
		validators: [
			new RequiredValidator('You must confirm that you’ve told the tenants about the appeal')
		]
	},
	appellantPreferInquiry: {
		type: 'text-entry',
		title: 'Why would you prefer an inquiry?',
		question: 'Why would you prefer an inquiry?',
		url: 'why-prefer-inquiry',
		fieldName: 'appellantPreferInquiryDetails',
		validators: [
			new RequiredValidator('Enter why you would prefer an inquiry'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Why you would prefer an inquiry must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			})
		]
	},
	inquiryHowManyDays: {
		type: 'number',
		title: 'How many days would you expect the inquiry to last?',
		question: 'How many days would you expect the inquiry to last?',
		url: 'how-many-days-inquiry',
		fieldName: 'appellantPreferInquiryDuration',
		validators: [
			new RequiredValidator('Enter the number of days you would expect the inquiry to last'),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${appealFormV2.textInputMaxLength}}$`, 'gi'),
				regexMessage: 'Enter the number of days using numbers 0 to 9',
				min: minDays,
				minMessage: `Number of days must be at least ${minDays}`,
				max: maxDays,
				maxMessage: `Number of days must be ${maxDays} numbers or less`,
				fieldName: 'appellantPreferInquiryDuration'
			})
		]
	},
	inquiryHowManyWitnesses: {
		type: 'number',
		title: 'How many witnesses would you expect to give evidence at the inquiry?',
		question: 'How many witnesses would you expect to give evidence at the inquiry?',
		url: 'how-many-witnesses',
		fieldName: 'appellantPreferInquiryWitnesses',
		validators: [
			new RequiredValidator(
				'Enter the number of witnesses you would expect to give evidence at the inquiry'
			),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${appealFormV2.textInputMaxLength}}$`, 'gi'),
				regexMessage: 'Enter the number of witnesses using numbers 0 to 9',
				max: maxWitnesses,
				maxMessage: `Number of witnesses must be ${maxWitnesses} or less`,
				fieldName: 'appellantPreferInquiryWitnesses'
			})
		]
	},
	lpaStatement: {
		type: 'text-entry',
		title: 'Appeal statement',
		question: 'Appeal statement',
		label: 'Enter your statement',
		url: 'appeal-statement',
		fieldName: 'lpaStatement',
		validators: [
			new RequiredValidator('Enter your statement'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMaxLength,
					maxLengthMessage: `Your statement must be ${formatNumber(
						appealFormV2.textAreaMaxLength
					)} characters or less`
				}
			})
		]
	},
	additionalDocuments: {
		type: 'boolean',
		title: 'Add supporting documents',
		question: 'Do you have additional documents to support your appeal statement?',
		fieldName: 'additionalDocuments',
		url: 'additional-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have additional documents to support your appeal statement'
			)
		]
	},
	uploadLpaStatementDocuments: {
		type: 'multi-file-upload',
		title: 'Supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadLpaStatementDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLpaStatementDocuments,
		actionHiddenText: 'your new supporting documents'
	},
	rule6Statement: {
		type: 'text-entry',
		title: 'Appeal statement',
		question: 'Appeal statement',
		label: 'Enter your statement',
		url: 'appeal-statement',
		fieldName: 'rule6Statement',
		validators: [
			new RequiredValidator('Enter your statement'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMaxLength,
					maxLengthMessage: `Your statement must be ${formatNumber(
						appealFormV2.textAreaMaxLength
					)} characters or less`
				}
			})
		]
	},
	rule6AdditionalDocuments: {
		type: 'boolean',
		title: 'Add supporting documents',
		question: 'Do you have additional documents to support your appeal statement?',
		fieldName: 'rule6AdditionalDocuments',
		url: 'additional-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have additional documents to support your appeal statement'
			)
		]
	},
	uploadRule6StatementDocuments: {
		type: 'multi-file-upload',
		title: 'Supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadRule6StatementDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadRule6StatementDocuments,
		actionHiddenText: 'your new supporting documents'
	},
	appellantFinalComment: {
		type: 'boolean',
		title: 'Do you want to submit any final comments?',
		question: 'Do you want to submit any final comments?',
		fieldName: 'appellantFinalComment',
		url: 'submit-final-comments',
		validators: [new RequiredValidator('Select yes if you want to submit any final comments')]
	},
	appellantFinalCommentDetails: {
		type: 'text-entry',
		title: 'Add your final comments',
		question: 'Add your final comments',
		url: 'final-comments',
		html: 'resources/appellant-final-comments/content.html',
		fieldName: 'appellantFinalCommentDetails',
		textEntryCheckbox: {
			header: 'Your comments',
			name: 'sensitiveInformationCheckbox',
			text: 'I confirm that I have not included any sensitive information in my final comments'
		},
		validators: [
			new RequiredValidator('Enter your final comments'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMediumLength,
					maxLengthMessage: `Your final comments must be ${formatNumber(
						appealFormV2.textAreaMediumLength
					)} characters or less`
				}
			}),
			new ConfirmationCheckboxValidator({
				checkboxName: 'sensitiveInformationCheckbox',
				errorMessage:
					'You must confirm that you have not included any sensitive information in your final comments'
			})
		]
	},
	appellantFinalCommentDocuments: {
		type: 'boolean',
		title: 'Do you have additional documents to support your final comments?',
		question: 'Do you have additional documents to support your final comments?',
		html: 'resources/appellant-final-comments/additional-documents.html',
		fieldName: 'appellantFinalCommentDocuments',
		url: 'additional-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have additional documents to support your final comments'
			)
		]
	},
	uploadAppellantFinalCommentDocuments: {
		type: 'multi-file-upload',
		title: 'New supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadAppellantFinalCommentDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantFinalCommentDocuments,
		actionHiddenText: 'your new supporting documents'
	},
	lpaFinalComment: {
		type: 'boolean',
		title: 'Do you want to submit any final comments?',
		question: 'Do you want to submit any final comments?',
		fieldName: 'lpaFinalComment',
		url: 'submit-final-comments',
		validators: [new RequiredValidator('Select yes if you want to submit any final comments')]
	},
	lpaFinalCommentDetails: {
		type: 'text-entry',
		title: 'Add your final comments',
		question: 'Add your final comments',
		url: 'final-comments',
		html: 'resources/lpa-final-comments/comment-details.html',
		fieldName: 'lpaFinalCommentDetails',
		textEntryCheckbox: {
			header: 'Your comments',
			name: 'sensitiveInformationCheckbox',
			text: 'I confirm that I have not included any sensitive information in my final comments'
		},
		validators: [
			new RequiredValidator('Enter your final comments'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMediumLength,
					maxLengthMessage: `Your final comments must be ${formatNumber(
						appealFormV2.textAreaMediumLength
					)} characters or less`
				}
			}),
			new ConfirmationCheckboxValidator({
				checkboxName: 'sensitiveInformationCheckbox',
				errorMessage:
					'You must confirm that you have not included any sensitive information in your final comments'
			})
		]
	},
	lpaFinalCommentDocuments: {
		type: 'boolean',
		title: 'Do you have additional documents to support your final comments?',
		question: 'Do you have additional documents to support your final comments?',
		hint: 'You must not add new evidence to your appeal',
		fieldName: 'lpaFinalCommentDocuments',
		url: 'additional-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have additional documents to support your final comments'
			)
		]
	},
	uploadLPAFinalCommentDocuments: {
		type: 'multi-file-upload',
		title: 'New supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadLPAFinalCommentDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLPAFinalCommentDocuments,
		actionHiddenText: 'your new supporting documents'
	},
	uploadAppellantProofOfEvidenceDocuments: {
		type: 'multi-file-upload',
		title: 'Your proof of evidence and summary',
		question: 'Upload your proof of evidence and summary',
		fieldName: 'uploadAppellantProofOfEvidenceDocuments',
		html: 'resources/upload-proof-evidence/content.html',
		url: 'upload-proof-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your proof of evidence and summary'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantProofOfEvidenceDocuments,
		actionHiddenText: 'your proof of evidence and summary'
	},
	appellantAddWitnesses: {
		type: 'boolean',
		title: 'Added witnesses',
		question: 'Do you need to add any witnesses?',
		fieldName: 'appellantWitnesses',
		url: 'add-witnesses',
		validators: [new RequiredValidator('Select yes if you need to add any witnesses')]
	},
	uploadAppellantWitnessesEvidence: {
		type: 'multi-file-upload',
		title: 'Witness proof of evidence and summary',
		question: 'Upload your witnesses and their evidence',
		fieldName: 'uploadAppellantWitnessesEvidence',
		html: 'resources/upload-proof-evidence/witnesses-evidence.html',
		url: 'upload-witnesses-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your witnesses and their evidence'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantWitnessesEvidence,
		actionHiddenText: 'your witnesses and their evidence'
	},
	uploadLpaProofOfEvidenceDocuments: {
		type: 'multi-file-upload',
		title: 'Your proof of evidence and summary',
		question: 'Upload your proof of evidence and summary',
		fieldName: 'uploadLpaProofOfEvidenceDocuments',
		html: 'resources/upload-proof-evidence/content.html',
		url: 'upload-proof-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your proof of evidence and summary'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLpaProofOfEvidenceDocuments,
		actionHiddenText: 'your proof of evidence and summary'
	},
	lpaAddWitnesses: {
		type: 'boolean',
		title: 'Added witnesses',
		question: 'Do you need to add any witnesses?',
		fieldName: 'lpaWitnesses',
		url: 'add-witnesses',
		validators: [new RequiredValidator('Select yes if you need to add any witnesses')]
	},
	uploadLpaWitnessesEvidence: {
		type: 'multi-file-upload',
		title: 'Witness proof of evidence and summary',
		question: 'Upload your witnesses and their evidence',
		fieldName: 'uploadLpaWitnessesEvidence',
		html: 'resources/upload-proof-evidence/witnesses-evidence.html',
		url: 'upload-witnesses-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your witnesses and their evidence'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLpaWitnessesEvidence,
		actionHiddenText: 'your witnesses and their evidence'
	},
	uploadRule6ProofOfEvidenceDocuments: {
		type: 'multi-file-upload',
		title: 'Your proof of evidence and summary',
		question: 'Upload your proof of evidence and summary',
		fieldName: 'uploadRule6ProofOfEvidenceDocuments',
		html: 'resources/upload-proof-evidence/content.html',
		url: 'upload-proof-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your proof of evidence and summary'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadRule6ProofOfEvidenceDocuments,
		actionHiddenText: 'your proof of evidence and summary'
	},
	rule6AddWitnesses: {
		type: 'boolean',
		title: 'Added witnesses',
		question: 'Do you need to add any witnesses?',
		fieldName: 'rule6Witnesses',
		url: 'add-witnesses',
		validators: [new RequiredValidator('Select yes if you need to add any witnesses')]
	},
	uploadRule6WitnessesEvidence: {
		type: 'multi-file-upload',
		title: 'Witness proof of evidence and summary',
		question: 'Upload your witnesses and their evidence',
		fieldName: 'uploadRule6WitnessesEvidence',
		html: 'resources/upload-proof-evidence/witnesses-evidence.html',
		url: 'upload-witnesses-evidence',
		validators: [
			new RequiredFileUploadValidator('Select your witnesses and their evidence'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadRule6WitnessesEvidence,
		actionHiddenText: 'your witnesses and their evidence'
	},
	consultHistoricEngland: {
		type: 'boolean',
		title: 'Did you consult Historic England?',
		question: 'Did you consult Historic England?',
		fieldName: 'consultHistoricEngland',
		url: 'consult-historic-england',
		validators: [new RequiredValidator('Select yes if you consulted Historic England')]
	},
	uploadHistoricEnglandConsultation: {
		type: 'multi-file-upload',
		title: 'Upload your consultation with Historic England',
		question: 'Upload your consultation with Historic England',
		fieldName: 'uploadHistoricEnglandConsultation',
		url: 'historic-england-consultation',
		validators: [
			new RequiredFileUploadValidator('Select your consultation with Historic England'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadHistoricEnglandConsultation,
		actionHiddenText: 'your consultation with Historic England'
	},
	majorMinorDevelopment: {
		type: 'radio',
		title: 'Was your application for a major or minor development?',
		question: 'Was your application for a major or minor development?',
		legend: 'Development class',
		fieldName: 'majorMinorDevelopment',
		url: 'major-minor-development',
		html: 'resources/major-minor-development/content.html',
		validators: [
			new RequiredValidator('Select if your application was for a major or minor development')
		],
		options: [
			{
				text: 'Major development',
				value: fieldValues.majorMinorDevelopment.MAJOR
			},
			{
				text: 'Minor development',
				value: fieldValues.majorMinorDevelopment.MINOR
			},
			{
				[DIVIDER]: 'or'
			},
			{
				text: 'Other',
				value: fieldValues.majorMinorDevelopment.OTHER
			}
		]
	},
	developmentType: {
		type: 'radio',
		title: 'Was your application about any of the following?',
		question: 'Was your application about any of the following?',
		fieldName: 'typeDevelopment',
		url: 'application-about',
		validators: [
			new RequiredValidator('Select if your application was about any of the following')
		],
		options: [
			{
				text: 'Householder development',
				value: fieldValues.applicationAbout.HOUSEHOLDER
			},
			{
				text: 'Change of use',
				value: fieldValues.applicationAbout.CHANGE_OF_USE
			},
			{
				text: 'Mineral working',
				value: fieldValues.applicationAbout.MINERAL_WORKINGS
			},
			{
				text: 'Dwellings',
				value: fieldValues.applicationAbout.DWELLINGS
			},
			{
				text: 'General industry, storage or warehousing',
				value: fieldValues.applicationAbout.INDUSTRY_STORAGE
			},
			{
				text: 'Offices, light industry or research and development',
				value: fieldValues.applicationAbout.OFFICES
			},
			{
				text: 'Retail and services',
				value: fieldValues.applicationAbout.RETAIL_SERVICES
			},
			{
				text: 'Traveller and caravan pitches',
				value: fieldValues.applicationAbout.TRAVELLER_CARAVAN
			},
			{
				text: 'Other',
				value: fieldValues.applicationAbout.OTHER
			}
		]
	},
	highwayLand: {
		type: 'radio',
		title: 'Is the appeal site on highway land?',
		question: 'Is the appeal site on highway land?',
		fieldName: 'highwayLand',
		url: 'highway-land',
		validators: [new RequiredValidator('Select yes if the appeal site is on highway land')],
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
	}
};

/** @type {Record<string, typeof import('./question')>} */
const questionClasses = {
	checkbox: CheckboxQuestion,
	'multi-file-upload': MultiFileUploadQuestion,
	boolean: BooleanQuestion,
	radio: RadioQuestion,
	date: DateQuestion,
	'text-entry': TextEntryQuestion,
	'single-line-input': SingleLineInputQuestion,
	'multi-field-input': MultiFieldInputQuestion,
	number: NumberEntryQuestion,
	'site-address': SiteAddressQuestion,
	'unit-option': UnitOptionEntryQuestion,
	'list-add-more': ListAddMoreQuestion
};

exports.getQuestions = () =>
	createQuestions(exports.questionProps, questionClasses, {
		'multi-file-upload': multiFileUploadOverrides,
		'site-address': siteAddressOverrides
	});
