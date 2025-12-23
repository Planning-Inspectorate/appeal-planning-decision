/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

// question classes
const CheckboxQuestion = require('@pins/dynamic-forms/src/dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('@pins/dynamic-forms/src/dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const RadioQuestion = require('@pins/dynamic-forms/src/dynamic-components/radio/question');
const DateQuestion = require('@pins/dynamic-forms/src/dynamic-components/date/question');
const TextEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/text-entry/question');
const SingleLineInputQuestion = require('@pins/dynamic-forms/src/dynamic-components/single-line-input/question');
const MultiFieldInputQuestion = require('@pins/dynamic-forms/src/dynamic-components/multi-field-input/question');
const NumberEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/number-entry/question');
const SiteAddressQuestion = require('@pins/dynamic-forms/src/dynamic-components/site-address/question');
const UnitOptionEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/unit-option-entry/question');
const ListAddMoreQuestion = require('@pins/dynamic-forms/src/dynamic-components/list-add-more/question');
const ContentQuestion = require('@pins/dynamic-forms/src/dynamic-components/content/question');

// validators
const RequiredValidator = require('@pins/dynamic-forms/src/validator/required-validator');
const RequiredFileUploadValidator = require('@pins/dynamic-forms/src/validator/required-file-upload-validator');
const MultifileUploadValidator = require('@pins/dynamic-forms/src/validator/multifile-upload-validator');
const AddressValidator = require('@pins/dynamic-forms/src/validator/address-validator');
const StringValidator = require('@pins/dynamic-forms/src/validator/string-validator');
const ConditionalRequiredValidator = require('@pins/dynamic-forms/src/validator/conditional-required-validator');
const UnitOptionEntryValidator = require('@pins/dynamic-forms/src/validator/unit-option-entry-validator');
const DateValidator = require('@pins/dynamic-forms/src/validator/date-validator');
const MultiFieldInputValidator = require('@pins/dynamic-forms/src/validator/multi-field-input-validator');
const NumericValidator = require('@pins/dynamic-forms/src/validator/numeric-validator');
const ConfirmationCheckboxValidator = require('@pins/dynamic-forms/src/validator/confirmation-checkbox-validator');

const {
	APPEAL_CASE_PROCEDURE,
	APPEAL_EIA_DEVELOPMENT_DESCRIPTION,
	APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE
} = require('@planning-inspectorate/data-model');
const {
	getConditionalFieldName,
	DIVIDER
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-utils');
const { documentTypes } = require('@pins/common');
const { fieldNames } = require('@pins/common/src/dynamic-forms/field-names');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');
const {
	validation: {
		characterLimits: {
			appealFormV2,
			questionnaire: {
				addressLine1MaxLength,
				addressLine1MinLength,
				addressLine2MaxLength,
				addressLine2MinLength,
				townCityMaxLength,
				townCityMinLength,
				countyMaxLength,
				countyMinLength,
				postcodeMaxLength,
				postcodeMinLength
			}
		},
		stringValidation: {
			appealReferenceNumber: appealReferenceNumberValidation,
			listedBuildingNumber: listedBuildingNumberValidation,
			appealSiteArea: { minValue, maxValue, minValueHectres },
			numberOfWitnesses: { maxWitnesses },
			lengthOfInquiry: { minDays, maxDays }
		}
	},
	fileUpload: {
		pins: { allowedFileTypes, maxFileUploadSize }
	}
} = require('../config');
const { createQuestions } = require('@pins/dynamic-forms/src/create-questions');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const { INTERESTS_IN_LAND } = require('@pins/common/src/constants');

// method overrides
const multiFileUploadOverrides = require('../journeys/question-overrides/multi-file-upload');
const siteAddressOverrides = require('../journeys/question-overrides/site-address');
const multiFieldInputOverrides = require('../journeys/question-overrides/multi-field-input');
const formatNumber = require('@pins/dynamic-forms/src/dynamic-components/utils/format-number');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('@pins/dynamic-forms/src/question-props').QuestionProps} QuestionProps
 * @typedef {import('@pins/dynamic-forms/src/question')} Question
 */

const {
	getExampleDate,
	formatEnforcementSelectNamesOptions,
	getAppealSiteHtmlByAppealType
} = require('./questions-utils');
const { capitalize } = require('../lib/string-functions');

const defaultFileUploadValidatorParams = {
	allowedFileTypes: Object.values(allowedFileTypes),
	maxUploadSize: maxFileUploadSize
};

const defaultAddressValidatorParams = {
	addressLine1MaxLength,
	addressLine1MinLength,
	addressLine2MaxLength,
	addressLine2MinLength,
	townCityMaxLength,
	townCityMinLength,
	countyMaxLength,
	countyMinLength,
	postcodeMaxLength,
	postcodeMinLength
};

// Define all questions
/**
 * @param {JourneyResponse} response
 * @returns {Record<string, QuestionProps>}
 */
exports.getQuestionProps = (response) => ({
	appealTypeAppropriate: {
		type: 'boolean',
		title: `Is ${QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A} appeal the correct type of appeal?`,
		question: `Is ${QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A} appeal the correct type of appeal?`,
		fieldName: 'correctAppealType',
		url: 'correct-appeal-type',
		validators: [
			new RequiredValidator(
				`Select yes if ${QUESTION_VARIABLES.APPEAL_TYPE} appeal is the correct type of appeal`
			)
		],
		variables: [QUESTION_VARIABLES.APPEAL_TYPE, QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]
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
				new StringValidator(listedBuildingNumberValidation)
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
				new StringValidator(listedBuildingNumberValidation)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
		validators: [new MultifileUploadValidator(defaultFileUploadValidatorParams)],
		documentType: documentTypes.planningOfficersReportUpload,
		actionHiddenText: 'the planning officer’s report or what your decision notice would have said',
		showSkipLink: true
	},
	accessForInspection: {
		type: 'radio',
		title: 'Access for inspection',
		question: 'Will the inspector need access to the appellant’s land or property?',
		pageTitle: 'Will the inspector need access to the appellant’s land or property?',
		fieldName: 'lpaSiteAccess',
		url: 'inspector-access-appeal-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector will need access to the appellant’s land or property'
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
		title: 'Will the inspector need to enter a neighbour’s land or property?',
		question: 'Will the inspector need to enter a neighbour’s land or property?',
		fieldName: 'neighbourSiteAccess',
		url: 'inspector-enter-neighbour-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector will need to enter a neighbour’s land or property'
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
			validators: [new AddressValidator(defaultAddressValidatorParams)],
			viewFolder: 'address-entry'
		}
	},
	potentialSafetyRisks: {
		type: 'radio',
		title: 'Potential safety risks',
		question: 'Add potential safety risks',
		description: 'You need to tell inspectors how to prepare for a site visit and what to bring.',
		html: 'resources/safety-risks/content.html',
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
				new StringValidator(appealReferenceNumberValidation)
			],
			viewFolder: 'add-more'
		}
	},
	addNewConditions: {
		type: 'radio',
		pageTitle: 'Are there any new conditions?',
		title: 'Extra conditions', // this is summary list title
		question: 'Check if there are any new conditions',
		description: 'Tell us about any new conditions. Do not include the standard conditions.',
		fieldName: 'newConditions',
		url: 'new-conditions',
		html: 'resources/new-planning-conditions/content.html',
		legend: 'Are there any new conditions?',
		validators: [
			new RequiredValidator('Select yes if there are any new conditions'),
			new ConditionalRequiredValidator('Enter the new conditions'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textAreaMediumLength,
					maxLengthMessage: `New conditions must be ${appealFormV2.textAreaMediumLength} characters or fewer`
				},
				fieldName: getConditionalFieldName('newConditions', 'newConditionDetails')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Enter the new conditions',
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
		title: 'Is the site in a national landscape?',
		question: 'Is the site in a national landscape?',
		fieldName: 'areaOutstandingBeauty',
		url: 'area-of-outstanding-natural-beauty',
		hint: 'A national landscape used to be called an ‘area of outstanding natural beauty’.',
		validators: [new RequiredValidator('Select yes if the site is in a national landscape')]
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
				value: fieldValues.designatedSites.other,
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
		title: 'What is the development category?',
		question: 'What is the development category?',
		fieldName: 'environmentalImpactSchedule',
		url: 'schedule-1-or-2',
		validators: [new RequiredValidator('Select the development category')],
		options: [
			{
				text: 'Schedule 1',
				value: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_1
			},
			{
				text: 'Schedule 2',
				value: APPEAL_EIA_ENVIRONMENTAL_IMPACT_SCHEDULE.SCHEDULE_2
			},
			{
				[DIVIDER]: 'or'
			},
			{
				// text was 'No' historically, keep value as 'no' as is used in display logic
				text: 'Other',
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
	submitEnvironmentalStatementAppellant: {
		type: 'radio',
		title: 'Did the appellant submit an environmental statement?',
		question: 'Did the appellant submit an environmental statement?',
		fieldName: 'appellantSubmittedEnvironmentalStatement',
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
			new RequiredValidator('Select yes if the appellant submitted an environmental statement')
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
		title: 'Access for inspection',
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadStatementCommonGround,
		actionHiddenText: 'your draft statement of common ground'
	},
	costApplication: {
		type: 'boolean',
		title: 'Do you want to apply for an award of appeal costs?',
		question: 'Do you want to apply for an award of appeal costs?',
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
			new RequiredValidator('Select yes if you want to apply for an award of appeal costs')
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
				new StringValidator(appealReferenceNumberValidation)
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
		html: getAppealSiteHtmlByAppealType(response),
		url: 'appeal-site-address',
		viewFolder: 'address-entry',
		validators: [new AddressValidator(defaultAddressValidatorParams)]
	},
	appealSiteGridReference: {
		type: 'multi-field-input',
		title: 'Grid reference',
		question: 'Enter the grid reference',
		url: 'grid-reference',
		viewFolder: 'grid-reference',
		fieldName: 'gridReference',
		html: 'resources/grid-reference/grid-reference.html',
		formatType: 'gridReference',
		inputFields: [
			{
				fieldName: 'siteGridReferenceEasting',
				label: 'Eastings',
				hint: 'For example, 359608',
				classes: 'govuk-!-width-one-quarter',
				formatJoinString: ' '
			},
			{
				fieldName: 'siteGridReferenceNorthing',
				label: 'Northings',
				hint: 'For example, 172607',
				classes: 'govuk-!-width-one-quarter',
				formatJoinString: ' '
			}
		],
		validators: [
			new MultiFieldInputValidator({
				requiredFields: [
					{
						fieldName: 'siteGridReferenceEasting',
						errorMessage: 'Enter the eastings grid reference',
						regex: {
							regex: new RegExp(`^[0-9]*$`, 'gi'),
							regexMessage: 'Eastings must only include numbers 0 to 9'
						},
						minLength: {
							minLength: 6,
							minLengthMessage: 'Eastings must be at least 6 digits'
						},
						lessThan: {
							lessThan: 692201,
							lessThanMessage: 'Eastings must be 692200 or less',
							allowLeadingZeros: true
						}
					},
					{
						fieldName: 'siteGridReferenceNorthing',
						errorMessage: 'Enter the northings grid reference',
						regex: {
							regex: new RegExp(`^[0-9]*$`, 'gi'),
							regexMessage: 'Northings must only include numbers 0 to 9'
						},
						minLength: {
							minLength: 6,
							minLengthMessage: 'Northings must be at least 6 digits'
						},
						lessThan: {
							lessThan: 1300000,
							lessThanMessage: 'Northings must be 1299999 or less',
							allowLeadingZeros: true
						}
					}
				],
				noInputsMessage: 'Enter the eastings and northings grid references'
			})
		]
	},
	appealSiteIsContactAddress: {
		type: 'boolean',
		title: 'Is the appeal site address your contact address?',
		question: 'Is the appeal site address your contact address?',
		fieldName: 'siteAddressIsContactAddress',
		url: 'is-contact-address',
		validators: [new RequiredValidator('Select yes if the appeal site is your contact address')]
	},
	contactAddress: {
		type: 'site-address',
		title: 'What is your contact address?',
		question: 'What is your contact address?',
		fieldName: fieldNames.contactAddress,
		url: 'contact-address',
		viewFolder: 'address-entry',
		validators: [new AddressValidator(defaultAddressValidatorParams)]
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
	appellantContinue: {
		type: 'content',
		title: 'Submit final comments',
		html: 'resources/appellant-final-comment-notice/appellant-final-comment-notice.html',
		label: 'You can upload any supporting documents after you add your final comments.',
		question: 'Submit final comments',
		url: 'upload-final-comments',
		fieldName: 'statementContinue'
	},
	lpaContinue: {
		type: 'content',
		title: 'Submit your final comments',
		label: 'You can upload any supporting documents after you add your final comments.',
		description: 'You can upload any supporting documents after you add your final comments.',
		backLinkText: 'Back to manage your appeals',
		question: 'Submit your final comments',
		url: 'upload-final-comments',
		fieldName: 'statementContinue'
	},
	statementContinue: {
		type: 'content',
		title: 'Submit an appeal statement',
		description: 'You can upload any supporting documents after you add your appeal statement.',
		label: 'You can upload any supporting documents after you add your appeal statement.',
		question: 'Submit an appeal statement',
		url: 'upload-appeal-statement',
		fieldName: 'statementContinue'
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadLpaStatementDocuments,
		actionHiddenText: 'your new supporting documents'
	},
	rule6Statement: {
		type: 'text-entry',
		title: 'Appeal statement',
		question: 'Enter your statement',
		label: 'Enter your statement',
		url: 'appeal-statement',
		fieldName: 'rule6Statement',
		hint: 'Address each item separately, dealing with legal matters first',
		html: 'resources/rule-6/rule-6-statement-guidance.html',
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
					maxLength: appealFormV2.textAreaMaxLength,
					maxLengthMessage: `Your final comments must be ${formatNumber(
						appealFormV2.textAreaMaxLength
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
					maxLength: appealFormV2.textAreaMaxLength,
					maxLengthMessage: `Your final comments must be ${formatNumber(
						appealFormV2.textAreaMaxLength
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
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
	//enforcement questions
	//  Constraints, designations and other issues
	enforcementAppealTypeAppropriate: {
		type: 'boolean',
		title: `Is enforcement the correct type of appeal?`,
		question: `Is enforcement the correct type of appeal?`,
		fieldName: 'correctAppealType',
		url: 'correct-appeal-type',
		validators: [
			new RequiredValidator(
				`Select yes if ${QUESTION_VARIABLES.APPEAL_TYPE} appeal is the correct type of appeal`
			)
		],
		variables: [QUESTION_VARIABLES.APPEAL_TYPE, QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]
	},

	// Enforcement specific questions
	enforcementOtherOperations: {
		type: 'boolean',
		title:
			'Does the enforcement notice relate to building, engineering, mining or other operations?',
		question:
			'Does the enforcement notice relate to building, engineering, mining or other operations?',
		fieldName: 'enforcementOtherOperations',
		url: 'other-operations',
		validators: [
			new RequiredValidator(
				'Select yes if the enforcement notice relates to building, engineering, mining or other operations'
			)
		]
	},
	enforcementSiteArea: {
		type: 'number',
		title: 'What is the area of the appeal site?',
		question: 'What is the area of the appeal site?',
		suffix: 'm\u00B2',
		fieldName: 'siteAreaSquareMetres',
		hint: 'Tell is the area of the appeal site from the notice plan.',
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
	enforcementAllegedBreachArea: {
		type: 'boolean',
		title: 'Is the area of the alleged breach the same as the site area?',
		question: 'Is the area of the alleged breach the same as the site area?',
		fieldName: 'enforcementAllegedBreachArea',
		url: 'alleged-breach-area',
		validators: [
			new RequiredValidator(
				'Select yes if the area of the alleged breach is the same as the site area'
			)
		]
	},
	enforcementCreateFloorSpace: {
		type: 'boolean',
		title: 'Does the alleged breach create any floor space?',
		question: 'Does the alleged breach create any floor space?',
		fieldName: 'enforcementCreateFloorSpace',
		url: 'create-floor-space',
		validators: [new RequiredValidator('Select yes if the alleged breach creates any floor space')]
	},
	enforcementRefuseWasteMaterials: {
		type: 'boolean',
		title:
			'Does the enforcement notice include a change of use of land to dispose, refuse or waste materials?',
		question:
			'Does the enforcement notice include a change of use of land to dispose, refuse or waste materials?',
		fieldName: 'enforcementRefuseWasteMaterials',
		url: 'refuse-waste-materials',
		validators: [
			new RequiredValidator('Select yes if the alleged breach does create any floor space')
		]
	},
	enforcementMineralExtractionMaterials: {
		type: 'boolean',
		title:
			'Does the enforcement notice include the change of use of land to dispose of remaining materials after mineral extraction?',
		question:
			'Does the enforcement notice include the change of use of land to dispose of remaining materials after mineral extraction?',
		fieldName: 'enforcementMineralExtractionMaterials',
		url: 'mineral-extraction-materials',
		validators: [
			new RequiredValidator(
				'Select yes if the enforcement notice does include the change of use of land to dispose of remaining materials after mineral extraction'
			)
		]
	},
	enforcementStoreMinerals: {
		type: 'boolean',
		title:
			'Does the enforcement notice include a change of use of land to store minerals in the open?',
		question:
			'Does the enforcement notice include a change of use of land to store minerals in the open?',
		fieldName: 'enforcementStoreMinerals',
		url: 'store-minerals',
		validators: [
			new RequiredValidator(
				'Select yes if the enforcement notice does include include a change of use of land to store minerals in the open'
			)
		]
	},
	enforcementCreateBuilding: {
		type: 'boolean',
		title: 'Does the enforcement notice include the erection of a building or buildings?',
		question: 'Does the enforcement notice include the erection of a building or buildings?',
		fieldName: 'enforcementCreateBuilding',
		url: 'create-building',
		validators: [
			new RequiredValidator(
				'Select yes if the enforcement notice does include the erection of a building or buildings'
			)
		]
	},
	enforcementAgriculturalPurposes: {
		type: 'boolean',
		title: 'Is the building on agricultural land and will it be used for agricultural purposes?',
		question: 'Is the building on agricultural land and will it be used for agricultural purposes?',
		fieldName: 'enforcementAgriculturalPurposes',
		url: 'agricultural-purposes',
		validators: [
			new RequiredValidator(
				'Select yes if the building is on agricultural land and will be used for agricultural purposes'
			)
		]
	},
	enforcementSingleHouse: {
		type: 'boolean',
		title: 'Is the enforcement notice for a single private dwelling house?',
		question: 'Is the enforcement notice for a single private dwelling house?',
		hint: 'Includes either building a new house or a change of use.',
		fieldName: 'enforcementSingleHouse',
		url: 'single-house',
		validators: [
			new RequiredValidator(
				'Select yes if the enforcement notice is for a single private dwelling house'
			)
		]
	},
	enforcementTrunkRoad: {
		type: 'boolean',
		title: 'Is the appeal site within 67 metres of a trunk road?',
		question: 'Is the appeal site within 67 metres of a trunk road?',
		fieldName: 'enforcementTrunkRoad',
		url: 'trunk-road',
		validators: [
			new RequiredValidator('Select yes if the appeal site is within 67 metres of a trunk road')
		]
	},
	enforcementCrownLand: {
		type: 'boolean',
		title: 'Is the appeal site on Crown land?',
		question: 'Is the appeal site on Crown land?',
		fieldName: 'enforcementCrownLand',
		url: 'crown-land',
		validators: [new RequiredValidator('Select yes if the appeal site is on Crown land')]
	},
	enforcementStopNotice: {
		type: 'boolean',
		title: 'Did you serve a stop notice?',
		question: 'Did you serve a stop notice?',
		fieldName: 'enforcementStopNotice',
		url: 'stop-notice',
		validators: [new RequiredValidator('Select yes if you did serve a stop notice')]
	},
	enforcementStopNoticeUpload: {
		type: 'multi-file-upload',
		title: 'Upload the stop notice',
		question: 'Upload the stop notice',
		fieldName: 'enforcementStopNoticeUpload',
		url: 'upload-stop-notice',
		validators: [
			new RequiredFileUploadValidator('Select the stop notice served'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.enforcementStopNoticeUpload,
		actionHiddenText: 'the stop notice served'
	},
	enforcementDevelopmentRights: {
		type: 'boolean',
		title: 'Did you remove any permitted development rights for the appeal site?',
		question: 'Did you remove any permitted development rights for the appeal site?',
		fieldName: 'enforcementDevelopmentRights',
		url: 'remove-permitted-development-rights',
		validators: [
			new RequiredValidator(
				'Select yes if you did remove any permitted development rights for the appeal site'
			)
		]
	},
	enforcementDevelopmentRightsUpload: {
		type: 'multi-file-upload',
		title: 'Upload the article 4 direction',
		question: 'Upload the article 4 direction',
		fieldName: 'enforcementDevelopmentRightsUpload',
		url: 'upload-article-4-direction',
		validators: [
			new RequiredFileUploadValidator('Select the article 4 direction'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.enforcementDevelopmentRightsUpload,
		actionHiddenText: 'the article 4 direction'
	},
	enforcementDevelopmentRightsRemoved: {
		type: 'text-entry',
		title: 'What permitted development rights did you remove with the direction?',
		question: 'What permitted development rights did you remove with the direction?',
		url: 'rights-removed-direction',
		fieldName: 'enforcementDevelopmentRightsRemoved',
		validators: [
			new RequiredValidator('Enter what permitted development rights have been removed'),
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

	enforcementWhoIsAppealing: {
		type: 'radio',
		title: 'Who is appealing against the enforcement notice?',
		question: 'Who is appealing against the enforcement notice?',
		fieldName: 'enforcementWhoIsAppealing',
		url: 'who-is-appealing',
		validators: [new RequiredValidator('Select who is appealing against the enforcement notice')],
		options: [
			{
				text: 'An individual',
				value: fieldValues.enforcementWhoIsAppealing.INDIVIDUAL
			},
			{
				text: 'A group of individuals',
				value: fieldValues.enforcementWhoIsAppealing.GROUP,
				hint: {
					text: 'If at least 2 people are named on the enforcement notice.'
				}
			},
			{
				text: 'An organisation',
				value: fieldValues.enforcementWhoIsAppealing.ORGANISATION,
				hint: {
					text: 'Includes limited companies, partnerships, charities, trusts and estates.'
				}
			}
		]
	},
	enforcementIndividualName: {
		type: 'multi-field-input',
		title: 'What is the name of the individual appealing against the enforcement notice?',
		question: 'What is the name of the individual appealing against the enforcement notice?',
		// html: 'resources/your-details/applicant-name.html',
		fieldName: 'enforcementIndividualName',
		url: 'individual-name',
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
			}
		],
		validators: [
			new MultiFieldInputValidator({
				requiredFields: [
					{
						fieldName: 'appellantFirstName',
						errorMessage: "Enter the individual's first name",
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'First name must be 250 characters or less'
						}
					},
					{
						fieldName: 'appellantLastName',
						errorMessage: "Enter the individual's last name",
						maxLength: {
							maxLength: 250,
							maxLengthMessage: 'Last name must be 250 characters or less'
						}
					}
				],
				noInputsMessage: "Enter the individual's name"
			})
		]
	},
	enforcementAreYouIndividual: {
		type: 'boolean',
		title: `Are you ${QUESTION_VARIABLES.INDIVIDUAL_NAME}?`,
		question: `Are you ${QUESTION_VARIABLES.INDIVIDUAL_NAME}?`,
		fieldName: 'isAppellant',
		url: 'are-you-individual',
		validators: [
			new RequiredValidator(`Select yes if you are ${QUESTION_VARIABLES.INDIVIDUAL_NAME}`)
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				attributes: { 'data-cy': 'answer-yes' }
			},
			{
				text: `No, I am appealing on behalf of ${QUESTION_VARIABLES.INDIVIDUAL_NAME}`,
				value: 'no',
				attributes: { 'data-cy': 'answer-no' }
			}
		],
		variables: [QUESTION_VARIABLES.INDIVIDUAL_NAME]
	},
	enforcementOrganisationName: {
		type: 'single-line-input',
		title: 'What is the name of the organisation?',
		question: 'What is the name of the organisation?',
		fieldName: 'enforcementOrganisationName',
		url: 'organisation-name',
		hint: 'Enter the name of the organisation on the enforcement notice.',
		validators: [
			new RequiredValidator('Enter the name of the organisation'),
			new StringValidator({
				maxLength: {
					maxLength: 250,
					maxLengthMessage: `Organisation name must be 250 characters or less`
				}
			})
		]
	},
	enforcementAddNamedIndividuals: {
		type: 'list-add-more',
		title: 'Add named individuals',
		pageTitle: 'Do you need to add another individual?',
		question: 'Do you need to add another individual?',
		description: 'You have added an individual',
		fieldName: 'addNamedIndividual',
		url: 'add-another-individual',
		subQuestionLabel: 'Appellant',
		subQuestionTitle: 'Appellant',
		subQuestionInputClasses: 'govuk-input--width-25',
		width: ListAddMoreQuestion.FULL_WIDTH,
		hint: 'You must tell us about all of the individuals appealing against the enforcement notice.',
		validators: [new RequiredValidator('Select yes if you need to add another individual')],
		subQuestionProps: {
			type: 'individual',
			title: 'What is the name of the individual appealing against the enforcement notice?',
			question: 'What is the name of the individual appealing against the enforcement notice?',
			fieldName: fieldNames.enforcementNamedIndividual,
			viewFolder: 'individual',
			validators: [
				new MultiFieldInputValidator({
					requiredFields: [
						{
							fieldName: `${fieldNames.enforcementNamedIndividual}_firstName`,
							errorMessage: "Enter the individual's first name",
							maxLength: {
								maxLength: 250,
								maxLengthMessage: 'First name must be 250 characters or less'
							}
						},
						{
							fieldName: `${fieldNames.enforcementNamedIndividual}_lastName`,
							errorMessage: "Enter the individual's last name",
							maxLength: {
								maxLength: 250,
								maxLengthMessage: 'Last name must be 250 characters or less'
							}
						}
					],
					noInputsMessage: "Enter the individual's name"
				})
			]
		}
	},
	enforcementSelectYourName: {
		type: 'radio',
		title: 'Select your name',
		question: 'Select your name',
		fieldName: 'selectedNamedIndividualId',
		url: 'select-name',
		validators: [new RequiredValidator('Select your name')],
		options: formatEnforcementSelectNamesOptions(response)
	},
	completeOnBehalfOf: {
		type: 'content',
		title: `Complete the appeal on behalf of ${QUESTION_VARIABLES.DYNAMIC_NAMED_PARTIES}`,
		html: 'resources/enforcement/complete-on-behalf-of.html',
		description: `You must answer these questions on behalf of ${QUESTION_VARIABLES.DYNAMIC_NAMED_PARTIES}.`,
		question: `Complete the appeal on behalf of ${QUESTION_VARIABLES.DYNAMIC_NAMED_PARTIES}`,
		url: 'complete-appeal',
		fieldName: 'confirmedCompleteOnBehalf',
		variables: [QUESTION_VARIABLES.DYNAMIC_NAMED_PARTIES]
	},
	interestInLand: {
		type: 'radio',
		title: `What is ${QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY} interest in the land?`,
		question: `What is ${QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY} interest in the land?`,
		fieldName: 'interestInAppealLand',
		url: 'land-interest',
		validators: [
			new RequiredValidator(
				`Select ${QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY} interest in the land`
			),
			new ConditionalRequiredValidator(
				`Enter ${QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY} interest in the land?`
			),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `${capitalize(QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY)} interest in the land must be ${appealFormV2.textInputMaxLength} characters or less`
				},
				fieldName: getConditionalFieldName('interestInAppealLand', 'interestInAppealLandDetails')
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
		variables: [QUESTION_VARIABLES.INTEREST_IN_LAND_PARTY]
	},
	enforcementInspectorAccess: {
		type: 'radio',
		title: 'Will an inspector need to access the land or property?',
		question: 'Will an inspector need to access the land or property?',
		html: 'resources/inspector-access/enforcement-content.html',
		fieldName: 'appellantSiteAccess',
		url: 'inspector-need-access',
		validators: [
			new RequiredValidator('Select yes if an inspector will need to access the land or property'),
			new ConditionalRequiredValidator(
				'Enter a reason why an inspector cannot view the land from a public road or footpath'
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
						'Enter a reason why an inspector cannot view the land from a public road or footpath.',
					hint: 'For example, the land is at the rear of a terraced property.',
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
	enterAllegedBreachDescription: {
		type: 'text-entry',
		title: 'Enter the description of the alleged breach',
		question: 'Enter the description of the alleged breach',
		fieldName: 'allegedBreachDescription',
		url: 'description-alleged-breach',
		hint: 'The description must match what is on the enforcement notice.',
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
	submittedPlanningApplication: {
		type: 'boolean',
		title:
			'Did anyone submit a planning application for the development on the enforcement notice and pay the correct fee?',
		question:
			'Did anyone submit a planning application for the development on the enforcement notice and pay the correct fee?',
		fieldName: 'applicationMadeAndFeePaid',
		url: 'submit-planning-application',
		validators: [
			new RequiredValidator(
				'Select yes if anyone submitted a planning application and paid the correct fee'
			)
		]
	},
	uploadApplicationReceipt: {
		type: 'multi-file-upload',
		title: 'Upload your application receipt',
		question: 'Upload your application receipt',
		fieldName: 'uploadApplicationReceipt',
		url: 'upload-application-receipt',
		validators: [
			new RequiredFileUploadValidator('Select your application receipt'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadApplicationReceipt
	},
	allOrPartOfDevelopment: {
		type: 'radio',
		title: 'Was the application for all or part of the development?',
		question: 'Was the application for all or part of the development?',
		fieldName: 'applicationPartOrWholeDevelopment',
		url: 'all-or-part',
		options: [
			{
				text: 'All of the development',
				value: 'all-of-the-development'
			},
			{
				text: 'Part of the development',
				value: 'part-of-the-development'
			}
		],
		validators: [
			new RequiredValidator('Select if the application was for all or part of the development')
		]
	},
	planningApplicationReference: {
		type: 'single-line-input',
		title: 'What is the application reference number?',
		question: 'What is the application reference number?',
		fieldName: 'applicationReference',
		url: 'planning-application-number',
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
	enforcementEnterDevelopmentDescription: {
		type: 'text-entry',
		title: 'Enter the description of development',
		question: 'Enter the description of development',
		fieldName: 'developmentDescriptionOriginal',
		url: 'enter-description-of-development',
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
	grantedOrRefused: {
		type: 'radio',
		title: 'Was the application granted or refused?',
		question: 'Was the application granted or refused?',
		fieldName: 'applicationDecision',
		url: 'granted-or-refused',
		options: [
			{
				text: 'Granted with conditions',
				value: 'granted'
			},
			{
				text: 'Refused',
				value: 'refused'
			},
			{
				[DIVIDER]: 'or'
			},
			{
				text: 'I have not received a decision',
				value: 'nodecisionreceived'
			}
		],
		validators: [new RequiredValidator('Select if the application was granted or refused')]
	},
	applicationDecisionDate: {
		type: 'date',
		title: 'What is the date on the decision letter from the local planning authority?',
		question: 'What is the date on the decision letter from the local planning authority?',
		fieldName: 'applicationDecisionDate',
		url: 'decision-date',
		hint: `For example, ${getExampleDate('past')}`,
		validators: [
			new DateValidator('the date on the decision letter from the local planning authority', {
				ensurePast: true
			})
		]
	},
	applicationDecisionDueDate: {
		type: 'date',
		title: 'What date was your decision due',
		question: 'What date was your decision due',
		fieldName: 'applicationDecisionDate',
		url: 'decision-date-due',
		hint: `For example, ${getExampleDate('past')}`,
		validators: [
			new DateValidator('the date the decision was due', {
				ensurePast: true
			})
		]
	},
	applicationDecisionAppealed: {
		type: 'boolean',
		title: 'Did anyone appeal the decision?',
		question: 'Did anyone appeal the decision?',
		fieldName: 'applicationDecisionAppealed',
		url: 'did-anyone-appeal',
		validators: [new RequiredValidator('Select yes if anyone appealed the decision')]
	},
	appealDecisionDate: {
		type: 'date',
		title: 'When was the appeal decision?',
		question: 'When was the appeal decision?',
		fieldName: 'appealDecisionDate',
		url: 'appeal-decision-date',
		hint: `For example, ${getExampleDate('past')}`,
		validators: [
			new DateValidator('the decision date', {
				ensurePast: true
			})
		]
	},
	uploadPriorCorrespondence: {
		type: 'multi-file-upload',
		title: 'Upload your communication with the Planning Inspectorate',
		question: 'Upload your communication with the Planning Inspectorate',
		description:
			'For example, the email you sent to confirm that you will appeal against the enforcement notice.',
		fieldName: 'uploadPriorCorrespondence',
		url: 'upload-planning-inspectorate-communication',
		validators: [
			new RequiredFileUploadValidator('Select your communication with the Planning Inspectorate'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadPriorCorrespondence
	},
	uploadEnforcementNotice: {
		type: 'multi-file-upload',
		title: 'Upload your enforcement notice',
		question: 'Upload your enforcement notice',
		fieldName: 'uploadEnforcementNotice',
		url: 'upload-enforcement-notice',
		validators: [
			new RequiredFileUploadValidator('Select your enforcement notice'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadEnforcementNotice
	},
	uploadEnforcementNoticePlan: {
		type: 'multi-file-upload',
		title: 'Upload your enforcement notice plan',
		question: 'Upload your enforcement notice plan',
		fieldName: 'uploadEnforcementNoticePlan',
		url: 'upload-enforcement-plan',
		validators: [
			new RequiredFileUploadValidator('Select your enforcement notice plan'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadEnforcementNoticePlan
	},

	// Notifying relevant parties enforcement questions
	listOfPeopleSentEnforcementNotice: {
		type: 'multi-file-upload',
		title: 'Upload the list of people that you served the enforcement notice to',
		question: 'Upload the list of people that you served the enforcement notice to',
		fieldName: 'listOfPeopleSentEnforcementNotice',
		url: 'upload-enforcement-list',
		validators: [
			new RequiredFileUploadValidator(
				'Select the list of people that you served the enforcement notice to'
			),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.listOfPeopleSentEnforcementNotice,
		actionHiddenText: 'the list of people that you served the enforcement notice to'
	},
	enforcementAppealNotification: {
		type: 'multi-file-upload',
		title: 'Upload the appeal notification letter and the list of people that you notified',
		question: 'Upload the appeal notification letter and the list of people that you notified',
		fieldName: 'appealNotification',
		url: 'appeal-notification-letter',
		validators: [
			new RequiredFileUploadValidator(
				'Select the appeal notification letter and the list of people that you notified'
			),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.appealNotification,
		actionHiddenText: 'the appeal notification letter and the list of people that you notified'
	},

	// Enforcement Specific questions (section 4) - Planning officer's report and supplementary documents
	planningOfficersReport: {
		type: 'boolean',
		title: 'Do you have a planning officer’s report?',
		question: 'Do you have a planning officer’s report?',
		fieldName: 'planningOfficerReport',
		url: 'planning-officer-report',
		validators: [new RequiredValidator('Select yes you have a planning officer’s report?')]
	},
	localDevelopmentOrder: {
		type: 'boolean',
		title: 'Do you have a local development order?',
		question: 'Do you have a local development order?',
		fieldName: 'localDevelopmentOrder',
		url: 'local-development-order',
		validators: [new RequiredValidator('Select yes if you have a local development order')]
	},
	localDevelopmentOrderUpload: {
		type: 'multi-file-upload',
		title: 'Local development order',
		question: 'Upload the local development order',
		fieldName: 'localDevelopmentOrderUpload',
		url: 'upload-local-development-order',

		validators: [
			new RequiredFileUploadValidator('Select the relevant local development order documents'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.localDevelopmentOrderUpload,
		actionHiddenText: 'relevant local development order documents'
	},
	previousPlanningPermission: {
		type: 'boolean',
		title: 'Did you previously grant any planning permission for this development?',
		question: 'Did you previously grant any planning permission for this development?',
		fieldName: 'previousPlanningPermission',
		url: 'previous-planning-permission',
		validators: [
			new RequiredValidator(
				'Select yes if you have you previously granted any planning permissions for this development'
			)
		]
	},
	previousPlanningPermissionUpload: {
		type: 'multi-file-upload',
		title: 'Upload planning permission and any other relevant documents',
		question: 'Upload planning permission and any other relevant documents',
		fieldName: 'previousPlanningPermissionUpload',
		url: 'upload-planning-permission',

		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant planning permission and any other relevant documents'
			),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.previousPlanningPermissionUpload,
		actionHiddenText: 'relevant planning permission and any other relevant documents'
	},
	enforcementNoticeDateApplication: {
		type: 'boolean',
		title: 'Was there an enforcement notice in force at the date of the application?',
		question: 'Was there an enforcement notice in force at the date of the application?',
		fieldName: 'enforcementNoticeDateApplication',
		url: 'enforcement-notice-date-application',
		validators: [
			new RequiredValidator(
				'Select yes if there was an enforcement notice in force at the date of the application'
			)
		]
	},
	enforcementNoticeDateApplicationUpload: {
		type: 'multi-file-upload',
		title: 'The enforcement notice',
		question: 'Upload the enforcement notice',
		fieldName: 'enforcementNoticeDateApplicationUpload',
		url: 'upload-enforcement-notice',

		validators: [
			new RequiredFileUploadValidator('Select the relevant enforcement notice'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.enforcementNoticeDateApplicationUpload,
		actionHiddenText: 'relevant enforcement notice'
	},
	enforcementNoticePlanUpload: {
		type: 'multi-file-upload',
		title: 'The enforcement notice plan',
		question: 'Upload the enforcement notice plan',
		fieldName: 'enforcementNoticePlanUpload',
		url: 'upload-enforcement-notice-plan',

		validators: [
			new RequiredFileUploadValidator('Select the relevant enforcement notice plan'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.enforcementNoticePlanUpload,
		actionHiddenText: 'relevant enforcement notice plan'
	},
	planningContraventionNotice: {
		type: 'boolean',
		title: 'Did you serve a planning contravention notice?',
		question: 'Did you serve a planning contravention notice?',
		fieldName: 'planningContraventionNotice',
		url: 'planning-contravention-notice',
		validators: [
			new RequiredValidator('Select yes if you did serve a planning contravention notice')
		]
	},
	planningContraventionNoticeUpload: {
		type: 'multi-file-upload',
		title: 'Upload the planning contravention notice',
		question: 'Upload the planning contravention notice',
		fieldName: 'planningContraventionNoticeUpload',
		url: 'upload-planning-contravention-notice',

		validators: [
			new RequiredFileUploadValidator('Select the relevant planning contravention notice'),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.planningContraventionNoticeUpload,
		actionHiddenText: 'relevant planning contravention notice'
	},

	highwayLand: {
		type: 'boolean',
		title: 'Is the appeal site on highway land?',
		question: 'Is the appeal site on highway land?',
		fieldName: 'highwayLand',
		url: 'highway-land',
		validators: [new RequiredValidator('Select yes if the appeal site is on highway land')]
	},
	advertInPosition: {
		type: 'boolean',
		title: 'Is the advertisement in position?',
		question: 'Is the advertisement in position?',
		fieldName: 'advertInPosition',
		url: 'advertisement-position',
		validators: [new RequiredValidator('Select yes if the advertisement is in position')]
	},
	landownerPermission: {
		type: 'boolean',
		title: 'Do you have the landowner’s permission?',
		question: 'Do you have the landowner’s permission?',
		fieldName: 'landownerPermission',
		url: 'landowner-permission',
		validators: [new RequiredValidator('Select yes if you have the landowner’s permission')]
	},
	updateAdvertisementDescription: {
		type: 'boolean',
		title: 'Did the local planning authority change the description of the advertisement?',
		question: 'Did the local planning authority change the description of the advertisement?',
		fieldName: 'updateDevelopmentDescription',
		url: 'description-advertisement-correct',
		html: 'resources/development-description/content.html', //?
		hint: 'We need to know if the description of the advertisement is the same as what is on your application.',
		validators: [
			new RequiredValidator(
				'Select yes if the local planning authority changed the description of the advertisement'
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
	enterAdvertisementDescription: {
		type: 'text-entry',
		title: 'Enter the description of the advertisement',
		question: 'Enter the description of the advertisement that you submitted in your application',
		fieldName: 'developmentDescriptionOriginal',
		url: 'description-advertisement',
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
	uploadChangeOfAdvertisementEvidence: {
		type: 'multi-file-upload',
		title: 'Upload evidence of your agreement to change the description of the advertisement',
		question: 'Upload evidence of your agreement to change the description of the advertisement',
		description:
			'For example, an email or letter from the local planning authority that confirms they have changed the description of the advertisement.',
		fieldName: 'uploadChangeOfDescriptionEvidence',
		url: 'upload-description-evidence',
		validators: [
			new RequiredFileUploadValidator(
				'Select the evidence of your agreement to change the description of the advertisement'
			),
			new MultifileUploadValidator(defaultFileUploadValidatorParams)
		],
		documentType: documentTypes.uploadChangeOfDescriptionEvidence,
		actionHiddenText: 'evidence of your agreement to change the description of the advertisement'
	},
	isSiteInAreaOfSpecialControlAdverts: {
		type: 'boolean',
		title: 'Is the site in an area of special control of advertisements?',
		question: 'Is the site in an area of special control of advertisements?',
		fieldName: 'isSiteInAreaOfSpecialControlAdverts',
		url: 'area-special-control',
		validators: [
			new RequiredValidator(
				'Select yes if the site is in an area of special control of advertisements'
			)
		]
	},
	wasApplicationRefusedDueToHighwayOrTraffic: {
		type: 'boolean',
		title: 'Did you refuse the application because of highway or traffic public safety?',
		question: 'Did you refuse the application because of highway or traffic public safety?',
		fieldName: 'wasApplicationRefusedDueToHighwayOrTraffic',
		url: 'public-safety',
		validators: [
			new RequiredValidator(
				'Select yes if you refused the application because of highway or traffic public safety'
			)
		]
	},
	didAppellantSubmitCompletePhotosAndPlans: {
		type: 'boolean',
		title: 'Did the appellant submit complete and accurate photographs and plans?',
		question: 'Did the appellant submit complete and accurate photographs and plans?',
		fieldName: 'didAppellantSubmitCompletePhotosAndPlans',
		url: 'accurate-photographs-plans',
		validators: [
			new RequiredValidator(
				'Select yes if the appellant submitted complete and accurate photographs and plans'
			)
		]
	}
});

/** @type {Record<string, typeof import('@pins/dynamic-forms/src/question')>} */
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
	'list-add-more': ListAddMoreQuestion,
	content: ContentQuestion
};

/** @param {JourneyResponse} response */
exports.getQuestions = (response = {}) =>
	createQuestions(exports.getQuestionProps(response), questionClasses, {
		'multi-file-upload': multiFileUploadOverrides,
		'site-address': siteAddressOverrides,
		'multi-field-input': multiFieldInputOverrides
	});
