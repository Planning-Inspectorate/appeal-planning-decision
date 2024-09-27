/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const { add, sub, format: formatDate } = require('date-fns');
const { APPEAL_CASE_PROCEDURE } = require('pins-data-model');

const CheckboxQuestion = require('./dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('./dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('./dynamic-components/boolean/question');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const CaseAddMoreQuestion = require('./dynamic-components/case-add-more/question');
const AddressAddMoreQuestion = require('./dynamic-components/address-add-more/question');
const RadioQuestion = require('./dynamic-components/radio/question');
const RequiredValidator = require('./validator/required-validator');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const MultifileUploadValidator = require('./validator/multifile-upload-validator');
const AddressValidator = require('./validator/address-validator');
const StringEntryValidator = require('./validator/string-validator');

const {
	validation: {
		stringValidation: {
			appealReferenceNumber: appealReferenceNumberValidation,
			listedBuildingNumber: listedBuildingNumberValidation,
			appealSiteArea: { minValue, maxValue },
			numberOfWitnesses: { maxWitnesses },
			lengthOfInquiry: { minDays, maxDays }
		}
	}
} = require('../../src/config');
const StringValidator = require('./validator/string-validator');
const {
	validation: {
		characterLimits: { appealFormV2 }
	}
} = require('../config');
let {
	validation: {
		characterLimits: { finalComment: inputMaxCharacters }
	}
} = require('../config');
const { getConditionalFieldName } = require('./dynamic-components/utils/question-utils');
const ConditionalRequiredValidator = require('./validator/conditional-required-validator');
const UnitOptionEntryValidator = require('./validator/unit-option-entry-validator');
const ListedBuildingAddMoreQuestion = require('./dynamic-components/listed-building-add-more/question');
const DateValidator = require('./validator/date-validator');
const DateQuestion = require('./dynamic-components/date/question');
const TextEntryQuestion = require('./dynamic-components/text-entry/question');
const SingleLineInputQuestion = require('./dynamic-components/single-line-input/question');
const MultiFieldInputQuestion = require('./dynamic-components/multi-field-input/question');
const { documentTypes } = require('@pins/common');
const NumberEntryQuestion = require('./dynamic-components/number-entry/question');
const NumericValidator = require('./validator/numeric-validator');
const SiteAddressQuestion = require('./dynamic-components/site-address/question');
const MultiFieldInputValidator = require('./validator/multi-field-input-validator');
const UnitOptionEntryQuestion = require('./dynamic-components/unit-option-entry/question');
const ConfirmationCheckboxValidator = require('./validator/confirmation-checkbox-validator');

inputMaxCharacters = Math.min(Number(inputMaxCharacters), 1000);

/**
 * @param {'past' | 'future'} tense
 * @param {number} days
 * @return {string} returns date string in d M yyyy format
 */

const getDate = (tense, days = 60) =>
	formatDate(
		{
			past: sub,
			future: add
		}[tense](new Date(), { days }),
		'd M yyyy'
	);

// Define all questions
exports.questions = {
	appealTypeAppropriate: new BooleanQuestion({
		title: 'Is this the correct type of appeal?',
		question: 'Is this the correct type of appeal?',
		// fieldName: 'correct-appeal-type',
		fieldName: 'correctAppealType',
		url: 'correct-appeal-type',
		validators: [new RequiredValidator('Select yes if this is the correct type of appeal')]
	}),
	listedBuildingCheck: new BooleanQuestion({
		title: 'Affects a listed building',
		question: 'Does the proposed development affect the setting of listed buildings?',
		// fieldName: 'affects-listed-building',
		fieldName: 'affectsListedBuilding',
		url: 'affect-listed-building',
		validators: [
			new RequiredValidator(
				'Select yes if the proposed development affects the setting of listed buildings'
			)
		]
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
		fieldName: 'uploadConservation',
		url: 'upload-conservation-area-map-guidance',
		validators: [
			new RequiredFileUploadValidator('Select a conservation map and guidance'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.conservationMap
	}),
	greenBelt: new BooleanQuestion({
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		// fieldName: 'green-belt',
		fieldName: 'greenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator()]
	}),
	whoWasNotified: new MultiFileUploadQuestion({
		title: 'Who was notified',
		url: 'upload-who-you-notified',
		question: 'Who did you notify about this application?',
		// fieldName: 'notified-who',
		fieldName: 'uploadWhoNotified',
		validators: [
			new RequiredFileUploadValidator('Select your document that lists who you notified'),
			new MultifileUploadValidator()
		],
		html: 'resources/notified-who/content.html',
		documentType: documentTypes.whoWasNotified
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
	howYouNotifiedPeople: new CheckboxQuestion({
		title: 'Type of notification',
		question: 'How did you notify relevant parties about the planning application?',
		description: 'Select all that apply',
		// fieldName: 'notification-method',
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
	}),
	uploadSiteNotice: new MultiFileUploadQuestion({
		title: 'Uploaded site notice',
		question: 'Upload the site notice',
		// fieldName: 'upload-site-notice',
		fieldName: 'uploadSiteNotice',
		url: 'upload-site-notice',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()],
		documentType: documentTypes.uploadSiteNotice
	}),
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
					// fieldName: 'inquiry-duration',
					fieldName: 'lpaPreferInquiryDuration',
					inputClasses: 'govuk-input--width-3',
					label: 'Length in days:',
					type: 'text'
				}
			}
		]
	}),
	whyInquiry: new TextEntryQuestion({
		title: 'Why would you prefer an inquiry?',
		question: 'Why would you prefer an inquiry?',
		// fieldName: 'prefer-inquiry',
		fieldName: 'lpaPreferInquiryDetails',
		validators: [new RequiredValidator('Enter why you would prefer an inquiry')]
	}),
	whyHearing: new TextEntryQuestion({
		title: 'Why would you prefer a hearing?',
		question: 'Why would you prefer a hearing?',
		// fieldName: 'prefer-hearing',
		fieldName: 'lpaPreferHearingDetails',
		validators: [new RequiredValidator('Enter why you would prefer a hearing')]
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
		subQuestion: new CaseAddMoreQuestion({
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
	// /*S78 questions */
	emergingPlan: new BooleanQuestion({
		title: 'Emerging plans',
		question: "Do you have an emerging plan that's relevant to this appeal?",
		// fieldName: 'emerging-plan',
		fieldName: 'emergingPlan',
		url: 'emerging-plan',
		validators: [new RequiredValidator()],
		html: 'resources/emerging-plan/content.html'
	}),
	emergingPlanUpload: new MultiFileUploadQuestion({
		title: 'Upload emerging plan and supporting information	',
		question: 'Upload the emerging plan and supporting information',
		// fieldName: 'upload-emerging-plan',
		fieldName: 'uploadEmergingPlan',
		url: 'upload-emerging-plan',
		validators: [
			new RequiredFileUploadValidator('Select the emerging plan and supporting information'),
			new MultifileUploadValidator()
		],
		html: 'resources/emerging-plan-upload/content.html',
		documentType: documentTypes.emergingPlanUpload
	}),
	uploadDevelopmentPlanPolicies: new MultiFileUploadQuestion({
		title: 'Policies from statutory development plan',
		question: 'Upload relevant policies from your statutory development plan',
		// fieldName: 'upload-development-plan-policies',
		fieldName: 'uploadDevelopmentPlanPolicies',
		url: 'upload-development-plan-policies',
		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant policies from your statutory development plan'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadDevelopmentPlanPolicies
	}),
	uploadOtherRelevantPolicies: new MultiFileUploadQuestion({
		title: 'Upload any other relevant policies',
		question: 'Upload any other relevant policies',
		// fieldName: 'upload-other-policies',
		fieldName: 'uploadOtherPolicies',
		url: 'upload-other-policies',
		validators: [
			new RequiredFileUploadValidator('Select any other relevant policies'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOtherRelevantPolicies
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
	communityInfrastructureLevyAdoptedDate: () =>
		new DateQuestion({
			title: 'Date community infrastructure levy adopted',
			question: 'When was the community infrastructure levy formally adopted?',
			// fieldName: 'community-infrastructure-levy-adopted-date',
			fieldName: 'infrastructureLevyAdoptedDate',
			hint: `For example, ${getDate('past')}`,
			validators: [
				new DateValidator('the date the infrastructure levy was formally adopted', {
					ensurePast: true
				})
			]
		}),
	communityInfrastructureLevyAdoptDate: () =>
		new DateQuestion({
			title: 'Date community infrastructure levy expected to be adopted',
			question: 'When do you expect to formally adopt the community infrastructure levy?',
			// fieldName: 'community-infrastructure-levy-adopt-date',
			fieldName: 'infrastructureLevyExpectedDate',
			hint: `For example, ${getDate('future')}`,
			validators: [
				new DateValidator(
					'the date you expect to formally adopt the community infrastructure levy',
					{
						ensureFuture: true
					}
				)
			]
		}),
	uploadNeighbourLetterAddresses: new MultiFileUploadQuestion({
		title: 'Letter sent to neighbours',
		question: 'Upload letters or emails sent to interested parties with their addresses',
		// fieldName: 'letters-interested-parties',
		fieldName: 'uploadLettersInterestedParties',
		url: 'letters-interested-parties',
		validators: [
			new RequiredFileUploadValidator(
				'Select letters or emails sent to interested parties with their addresses'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadNeighbourLetterAddresses
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
	uploadDefinitiveMap: new MultiFileUploadQuestion({
		title: 'Definitive map and statement extract',
		question: 'Upload the definitive map and statement extract',
		// fieldName: 'upload-definitive-map-statement',
		fieldName: 'uploadDefinitiveMapStatement',
		url: 'upload-definitive-map-statement',
		validators: [
			new RequiredFileUploadValidator('Select the definitive map and statement extract'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadDefinitiveMap
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
	gypsyOrTraveller: new BooleanQuestion({
		title: 'Gypsy or Traveller',
		question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
		// fieldName: 'gypsy-traveller',
		fieldName: 'gypsyTraveller',
		url: 'gypsy-traveller',
		validators: [new RequiredValidator()]
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
	environmentalImpactSchedule: new RadioQuestion({
		title: 'Schedule type',
		question: 'Is the development a schedule 1 or schedule 2 development?',
		// fieldName: 'environmental-impact-schedule',
		fieldName: 'environmentalImpactSchedule',
		url: 'schedule-1-or-2',
		validators: [new RequiredValidator('Select the development schedule')],
		options: [
			{
				text: 'Yes, schedule 1',
				value: 'schedule-1'
			},
			{
				text: 'Yes, schedule 2',
				value: 'schedule-2'
			},
			{
				divider: 'or'
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	uploadEnvironmentalStatement: new MultiFileUploadQuestion({
		title: 'Upload the environmental statement and supporting information',
		question: 'Upload the environmental statement and supporting information',
		// fieldName: 'upload-environmental-statement',
		fieldName: 'uploadEnvironmentalStatement',
		url: 'upload-environmental-statement',
		validators: [
			new RequiredFileUploadValidator(
				'Select the environmental statement and supporting information'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadEnvironmentalStatement
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
	uploadScreeningDirection: new MultiFileUploadQuestion({
		title: 'Upload the screening direction',
		question: 'Upload the screening direction',
		// fieldName: 'upload-screening-direction',
		fieldName: 'uploadScreeningDirection',
		url: 'upload-screening-direction',
		validators: [
			new RequiredFileUploadValidator('Select the screening direction'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadScreeningDirection
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
	// rightOfWayUpload: new MultiFileUploadQuestion({
	// 	title: 'Definitive map and statement extract',
	// 	question: 'Upload the definitive map and statement extract',
	// 	fieldName: 'right-of-way-upload'
	// }),
	// HAS APPEAL FORM QUESTIONS
	siteArea: new NumberEntryQuestion({
		title: 'What is the area of the appeal site?',
		question: 'What is the area of the appeal site?',
		suffix: 'm\u00B2',
		fieldName: 'siteAreaSquareMetres',
		hint: 'Total site area, in square metres.',
		url: 'site-area',
		validators: [
			new RequiredValidator('Enter the area of the appeal site'),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${inputMaxCharacters}}$`, 'gi'),
				regexMessage: 'Enter the area of the site using numbers 0 to 9',
				min: minValue,
				minMessage: `Appeal site area must be at least ${minValue}m\u00B2`,
				max: maxValue,
				maxMessage: `Appeal site area must be ${maxValue.toLocaleString()}m\u00B2 or less`,
				fieldName: 'siteAreaSquareMetres'
			})
		]
	}),
	ownsAllLand: new BooleanQuestion({
		title: 'Do you own all the land involved in the appeal?',
		question: 'Do you own all the land involved in the appeal?',
		fieldName: 'ownsAllLand',
		url: 'own-all-land',
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
	knowsWhoOwnsRestOfLand: new RadioQuestion({
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
	knowsWhoOwnsLandInvolved: new RadioQuestion({
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
	tellingLandowners: new BooleanQuestion({
		title: 'Have the landowners been told about the appeal?',
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
	}),
	identifyingLandowners: new BooleanQuestion({
		title: 'Have you attempted to identify the landowners?',
		question: 'Identifying the landowners',
		type: 'checkbox',
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
	}),
	advertisingAppeal: new BooleanQuestion({
		title: 'Have you advertised the appeal?',
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
	inspectorAccess: new RadioQuestion({
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
	}),
	healthAndSafety: new RadioQuestion({
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
	}),
	uploadOriginalApplicationForm: new MultiFileUploadQuestion({
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
		documentType: documentTypes.uploadOriginalApplicationForm
	}),
	uploadApplicationDecisionLetter: new MultiFileUploadQuestion({
		title: 'Decision letter',
		question: 'Upload the decision letter from the local planning authority',
		description: `This letter tells you about the decision on your application. \n\nWe need the letter from the local planning authority that tells you their decision on your application (also called a ‘decision notice’).\n\nDo not upload the planning officer’s report.`,
		fieldName: 'uploadApplicationDecisionLetter',
		url: 'upload-decision-letter',
		validators: [
			new RequiredFileUploadValidator('Select the decision letter'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadApplicationDecisionLetter
	}),
	uploadChangeOfDescriptionEvidence: new MultiFileUploadQuestion({
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
		documentType: documentTypes.uploadChangeOfDescriptionEvidence
	}),
	enterApplicationReference: new SingleLineInputQuestion({
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
	}),
	planningApplicationDate: () =>
		new DateQuestion({
			title: 'What date did you submit your application?',
			question: 'What date did you submit your application?',
			fieldName: 'onApplicationDate',
			url: 'application-date',
			hint: `For example, ${getDate('past')}`,
			validators: [
				new DateValidator('the date you submitted your application', {
					ensurePast: true
				})
			]
		}),
	enterDevelopmentDescription: new TextEntryQuestion({
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
	}),
	updateDevelopmentDescription: new BooleanQuestion({
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
	}),
	uploadAppellantStatement: new MultiFileUploadQuestion({
		title: 'Appeal statement',
		question: 'Upload your appeal statement',
		html: 'resources/upload-appeal-statement/content.html',
		fieldName: 'uploadAppellantStatement',
		url: 'upload-appeal-statement',
		validators: [
			new RequiredFileUploadValidator('Select your appeal statement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantStatement
	}),
	uploadStatementCommonGround: new MultiFileUploadQuestion({
		title: 'Draft statement of common ground',
		question: 'Upload your draft statement of common ground',
		fieldName: 'uploadStatementCommonGround',
		url: 'upload-draft-statement-common-ground',
		validators: [
			new RequiredFileUploadValidator('Select the draft statement of common ground'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadStatementCommonGround
	}),
	costApplication: new BooleanQuestion({
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
	}),
	uploadCostApplication: new MultiFileUploadQuestion({
		title: 'Application for an award of appeal costs',
		question: 'Upload your application for an award of appeal costs',
		fieldName: 'uploadCostApplication',
		url: 'upload-appeal-costs-application',
		validators: [
			new RequiredFileUploadValidator('Select your application for an award of appeal costs'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadCostApplication
	}),
	anyOtherAppeals: new BooleanQuestion({
		title: 'Are there other appeals linked to your development?',
		question: 'Are there other appeals linked to your development?',
		fieldName: 'appellantLinkedCase',
		url: 'other-appeals',
		html: 'resources/other-appeals/content.html',
		validators: [
			new RequiredValidator('Select yes if there are other appeals linked to your development')
		]
	}),
	linkAppeals: new ListAddMoreQuestion({
		pageTitle: 'You’ve added a linked appeal',
		title: 'n/a',
		question: 'Add another appeal?',
		fieldName: 'appellantLinkedCaseAdd',
		url: 'enter-appeal-reference',
		subQuestionLabel: 'Other appeal',
		subQuestionTitle: 'Enter the appeal reference number',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another linked appeal')],
		subQuestion: new CaseAddMoreQuestion({
			title: 'Enter the appeal reference number',
			question: 'Enter the appeal reference number',
			fieldName: 'appellantLinkedCase',
			html: 'resources/appellant-linked-case/content.html',
			hint: 'For example, 0221532.',
			validators: [
				new RequiredValidator('Enter the appeal reference number'),
				new StringEntryValidator(appealReferenceNumberValidation)
			],
			viewFolder: 'identifier'
		})
	}),
	applicationName: new BooleanQuestion({
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
	}),
	applicantName: new MultiFieldInputQuestion({
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
	}),
	contactDetails: new MultiFieldInputQuestion({
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
	}),
	contactPhoneNumber: new SingleLineInputQuestion({
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
	}),
	appealSiteAddress: new SiteAddressQuestion({
		title: 'What is the address of the appeal site?',
		question: 'What is the address of the appeal site?',
		fieldName: 'siteAddress',
		html: 'resources/site-address/site-address.html',
		url: 'appeal-site-address',
		viewFolder: 'address-entry',
		validators: [new AddressValidator()]
	}),
	s78SiteArea: new UnitOptionEntryQuestion({
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
				unit: 'Appeal site area',
				regex: new RegExp(`^[0-9]{0,${inputMaxCharacters}}$`, 'gi'),
				regexMessage: 'Enter the area of the site using numbers 0 to 9',
				min: minValue,
				max: maxValue
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
				}
			}
		]
	}),
	appellantGreenBelt: new BooleanQuestion({
		title: 'Is the appeal site in a green belt?',
		question: 'Is the appeal site in a green belt?',
		fieldName: 'appellantGreenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator('Select yes if the appeal site is in a green belt')]
	}),
	submitPlanningObligation: new BooleanQuestion({
		title: 'Do you plan to submit a planning obligation to support your appeal?',
		question: 'Do you plan to submit a planning obligation to support your appeal?',
		fieldName: 'planningObligation',
		url: 'submit-planning-obligation',
		validators: [
			new RequiredValidator(
				'Select yes if you plan to submit a planning obligation to support your appeal'
			)
		]
	}),
	planningObligationStatus: new RadioQuestion({
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
	}),
	uploadPlanningObligation: new MultiFileUploadQuestion({
		title: 'Planning obligation',
		question: 'Upload your planning obligation',
		fieldName: 'uploadPlanningObligation',
		url: 'upload-planning-obligation',
		validators: [
			new RequiredFileUploadValidator('Select your planning obligation'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadPlanningObligation
	}),
	designAccessStatement: new BooleanQuestion({
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
	}),
	uploadDesignAccessStatement: new MultiFileUploadQuestion({
		title: 'Design and access statement',
		question: 'Upload your design and access statement',
		fieldName: 'uploadDesignAccessStatement',
		url: 'upload-design-access-statement',
		html: 'resources/plans-drawings/upload-design-access.html',
		validators: [
			new RequiredFileUploadValidator('Select your design and access statement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadDesignAccessStatement
	}),
	uploadPlansDrawingsHAS: new MultiFileUploadQuestion({
		title: 'Upload the plans, drawings and list of plans',
		question: 'Upload the plans, drawings and list of plans',
		fieldName: 'uploadPlansDrawings',
		url: 'upload-plans-drawings',
		validators: [
			new RequiredFileUploadValidator('Select the plans, drawings and list of plans'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadPlansDrawings
	}),
	uploadPlansDrawingsDocuments: new MultiFileUploadQuestion({
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
		documentType: documentTypes.uploadPlansDrawings
	}),
	newPlansDrawings: new BooleanQuestion({
		title: 'Do you have any new plans or drawings that support your appeal?',
		question: 'Do you have any new plans or drawings that support your appeal?',
		fieldName: 'newPlansDrawings',
		url: 'new-plans-drawings',
		validators: [
			new RequiredValidator(
				'Select yes if you have any new plans or drawings that support your appeal'
			)
		]
	}),
	uploadNewPlansDrawings: new MultiFileUploadQuestion({
		title: 'New plans or drawings',
		question: 'Upload your new plans or drawings',
		fieldName: 'uploadNewPlansDrawings',
		url: 'upload-new-plans-drawings',
		validators: [
			new RequiredFileUploadValidator('Select your new plans or drawings'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadNewPlansDrawings
	}),
	otherNewDocuments: new BooleanQuestion({
		title: 'Do you have any other new documents that support your appeal?',
		question: 'Do you have any other new documents that support your appeal?',
		fieldName: 'otherNewDocuments',
		url: 'other-new-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have any other new documents that support your appeal'
			)
		]
	}),
	separateOwnershipCert: new BooleanQuestion({
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
	}),
	uploadSeparateOwnershipCert: new MultiFileUploadQuestion({
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
		documentType: documentTypes.uploadOwnershipCertificate
	}),
	uploadOtherNewDocuments: new MultiFileUploadQuestion({
		title: 'Other new supporting documents',
		question: 'Upload your other new supporting documents',
		fieldName: 'uploadOtherNewDocuments',
		url: 'upload-other-new-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your other new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOtherNewDocuments
	}),
	appellantProcedurePreference: new RadioQuestion({
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
	}),
	appellantPreferHearing: new TextEntryQuestion({
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
	}),
	agriculturalHolding: new BooleanQuestion({
		title: 'Is the appeal site part of an agricultural holding?',
		question: 'Is the appeal site part of an agricultural holding?',
		fieldName: 'agriculturalHolding',
		url: 'agricultural-holding',
		html: 'resources/agricultural-holding/content.html',
		validators: [
			new RequiredValidator('Select yes if the appeal site is part of an agricultural holding')
		]
	}),
	tenantAgriculturalHolding: new BooleanQuestion({
		title: 'Are you a tenant of the agricultural holding?',
		question: 'Are you a tenant of the agricultural holding?',
		fieldName: 'tenantAgriculturalHolding',
		url: 'tenant-agricultural-holding',
		validators: [
			new RequiredValidator('Select yes if you are a tenant of the agricultural holding')
		]
	}),
	otherTenantsAgriculturalHolding: new BooleanQuestion({
		title: 'Are there any other tenants?',
		question: 'Are there any other tenants?',
		fieldName: 'otherTenantsAgriculturalHolding',
		url: 'other-tenants',
		validators: [new RequiredValidator('Select yes if there are any other tenants')]
	}),
	informedTenantsAgriculturalHolding: new BooleanQuestion({
		title: 'Have the tenants been told about the appeal?',
		question: 'Telling the tenants',
		type: 'checkbox',
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
	}),
	appellantPreferInquiry: new TextEntryQuestion({
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
	}),
	inquiryHowManyDays: new NumberEntryQuestion({
		title: 'How many days would you expect the inquiry to last?',
		question: 'How many days would you expect the inquiry to last?',
		url: 'how-many-days-inquiry',
		fieldName: 'appellantPreferInquiryDuration',
		validators: [
			new RequiredValidator('Enter the number of days you would expect the inquiry to last'),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${inputMaxCharacters}}$`, 'gi'),
				regexMessage: 'Enter the number of days using numbers 0 to 9',
				min: minDays,
				minMessage: `Number of days must be at least ${minDays}`,
				max: maxDays,
				maxMessage: `Number of days must be ${maxDays} numbers or less`,
				fieldName: 'appellantPreferInquiryDuration'
			})
		]
	}),
	inquiryHowManyWitnesses: new NumberEntryQuestion({
		title: 'How many witnesses would you expect to give evidence at the inquiry?',
		question: 'How many witnesses would you expect to give evidence at the inquiry?',
		url: 'how-many-witnesses',
		fieldName: 'appellantPreferInquiryWitnesses',
		validators: [
			new RequiredValidator(
				'Enter the number of witnesses you would expect to give evidence at the inquiry'
			),
			new NumericValidator({
				regex: new RegExp(`^[0-9]{0,${inputMaxCharacters}}$`, 'gi'),
				regexMessage: 'Enter the number of witnesses using numbers 0 to 9',
				max: maxWitnesses,
				maxMessage: `Number of witnesses must be ${maxWitnesses} or less`,
				fieldName: 'appellantPreferInquiryWitnesses'
			})
		]
	}),
	lpaStatement: new TextEntryQuestion({
		title: 'Appeal statement',
		question: 'Appeal statement',
		label: 'Enter your statement',
		url: 'appeal-statement',
		fieldName: 'lpaStatement',
		validators: [
			new RequiredValidator('Enter your statement'),
			new StringValidator({
				maxLength: {
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Your statement must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			})
		]
	}),
	additionalDocuments: new BooleanQuestion({
		title: 'Add supporting documents',
		question: 'Do you have additional documents to support your appeal statement?',
		fieldName: 'additionalDocuments',
		url: 'additional-documents',
		validators: [
			new RequiredValidator(
				'Select yes if you have additional documents to support your appeal statement'
			)
		]
	}),
	uploadLpaStatementDocuments: new MultiFileUploadQuestion({
		title: 'Supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadLpaStatementDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLpaStatementDocuments
	}),
	appellantFinalComment: new BooleanQuestion({
		title: 'Do you want to submit any final comments?',
		question: 'Do you want to submit any final comments?',
		fieldName: 'appellantFinalComment',
		url: 'submit-final-comments',
		validators: [new RequiredValidator('Select yes if you want to submit any final comments')]
	}),
	appellantFinalCommentDetails: new TextEntryQuestion({
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
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Your final comments must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			}),
			new ConfirmationCheckboxValidator({
				checkboxName: 'sensitiveInformationCheckbox',
				errorMessage:
					'You must confirm that you have not included any sensitive information in your final comments'
			})
		]
	}),
	appellantFinalCommentDocuments: new BooleanQuestion({
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
	}),
	uploadAppellantFinalCommentDocuments: new MultiFileUploadQuestion({
		title: 'New supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadAppellantFinalCommentDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantFinalCommentDocuments
	}),
	lpaFinalComment: new BooleanQuestion({
		title: 'Do you want to submit any final comments?',
		question: 'Do you want to submit any final comments?',
		fieldName: 'lpaFinalComment',
		url: 'submit-final-comments',
		validators: [new RequiredValidator('Select yes if you want to submit any final comments')]
	}),
	lpaFinalCommentDetails: new TextEntryQuestion({
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
					maxLength: appealFormV2.textInputMaxLength,
					maxLengthMessage: `Your final comments must be ${appealFormV2.textInputMaxLength} characters or less`
				}
			}),
			new ConfirmationCheckboxValidator({
				checkboxName: 'sensitiveInformationCheckbox',
				errorMessage:
					'You must confirm that you have not included any sensitive information in your final comments'
			})
		]
	}),
	lpaFinalCommentDocuments: new BooleanQuestion({
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
	}),
	uploadLPAFinalCommentDocuments: new MultiFileUploadQuestion({
		title: 'New supporting documents',
		question: 'Upload your new supporting documents',
		fieldName: 'uploadLPAFinalCommentDocuments',
		url: 'upload-supporting-documents',
		validators: [
			new RequiredFileUploadValidator('Select your new supporting documents'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadLPAFinalCommentDocuments
	})
};
