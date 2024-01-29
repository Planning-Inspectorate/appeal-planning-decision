/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const CheckboxQuestion = require('./dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('./dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('./dynamic-components/boolean/question');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const AddMoreQuestion = require('./dynamic-components/add-more/question');
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
			listedBuildingNumber: listedBuildingNumberValidation
		}
	}
} = require('../../src/config');
const StringValidator = require('./validator/string-validator');
const {
	validation: {
		characterLimits: { finalComment: inputMaxCharacters }
	}
} = require('../config');
const { getConditionalFieldName } = require('./dynamic-components/utils/question-utils');
const ConditionalRequiredValidator = require('./validator/conditional-required-validator');
const ListedBuildingAddMoreQuestion = require('./dynamic-components/listed-building-add-more/question');
const DateValidator = require('./validator/date-validator');
const DateQuestion = require('./dynamic-components/date/question');
const TextEntryQuestion = require('./dynamic-components/text-entry/question');
const { documentTypes } = require('@pins/common');

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
		fieldName: 'add-listed-buildings',
		// fieldName: 'addChangedListedBuilding',
		url: 'changed-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestion: new ListedBuildingAddMoreQuestion({
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			fieldName: 'listed-building-number',
			// fieldName: 'changedListedBuildingNumber',
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
		fieldName: 'add-listed-buildings',
		// fieldName: 'addAffectedListedBuilding',
		url: 'affected-listed-buildings',
		subQuestionLabel: 'Listed Building',
		subQuestionFieldLabel: 'Seven digit number',
		subQuestionInputClasses: 'govuk-input--width-10',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator('Select yes to add another building or site')],
		subQuestion: new ListedBuildingAddMoreQuestion({
			title: 'Tell us the list entry number',
			question: 'Tell us the list entry number',
			fieldName: 'listed-building-number',
			// fieldName: 'affectedListedBuildingNumber',
			html: 'resources/listed-building-number/content.html',
			validators: [
				new RequiredValidator('Enter a list entry number'),
				new StringEntryValidator(listedBuildingNumberValidation)
			],
			viewFolder: 'identifier'
		})
	}),
	// listedBuildingDetail: {
	// 	title: 'Listed buildings',
	// 	question: 'Add the listed entry number',
	// 	type: 'custom',
	// 	renderAction: listedBuildingController.enterNumber, //For scenarios where more complex rendering logic is required, pass a controller action
	// 	saveAction: listedBuildingController.lookupCode, //For scenarios where more complex saving/POST handling logic is required, pass a controller action
	// 	fieldName: 'listed-entry-number',
	// 	required: false,
	// 	taskList: false,
	// 	show: (answers) => {
	// 		return answers['listed-building-check'] === 'yes';
	// 	}
	// },
	// listedBuildingDetailList: {
	// 	title: 'Listed buildings list',
	// 	question: 'Manage listed buildings',
	// 	type: 'custom',
	// 	renderAction: listedBuildingController.manageListedBuildings, //For scenarios where more complex rendering logic is required, pass a controller action
	// 	saveAction: listedBuildingController.lookupCode, //For scenarios where more complex saving/POST handling logic is required, pass a controller action
	// 	fieldName: 'listed-detail-list',
	// 	required: false,
	// 	altText: 'Started',
	// 	show: (answers) => {
	// 		return answers['listed-detail-list']?.length > 0;
	// 	}
	// },
	conservationArea: new BooleanQuestion({
		title: 'Conservation area',
		question: 'Is the site in, or next to a conservation area?',
		fieldName: 'conservation-area',
		// fieldName: 'conservationArea',
		url: 'conservation-area',
		validators: [new RequiredValidator()]
	}),
	conservationAreaUpload: new MultiFileUploadQuestion({
		title: 'Conservation area map and guidance',
		question: 'Upload conservation map and guidance',
		fieldName: 'conservation-upload',
		// fieldName: 'uploadConservation',
		url: 'upload-conservation-area-map-guidance',
		validators: [
			new RequiredFileUploadValidator('Select a conservation map and guidance'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.conservationAreaUpload
	}),
	greenBelt: new BooleanQuestion({
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		fieldName: 'green-belt',
		// fieldName: 'greenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator()]
	}),
	whoWasNotified: new MultiFileUploadQuestion({
		title: 'Who was notified',
		url: 'upload-who-you-notified',
		question: 'Who did you notify about this application?',
		fieldName: 'notified-who',
		// fieldName: 'uploadWhoNotified',
		validators: [
			new RequiredFileUploadValidator('Select your document that lists who you notified'),
			new MultifileUploadValidator()
		],
		html: 'resources/notified-who/content.html',
		documentType: documentTypes.whoWasNotified
	}),
	displaySiteNotice: new BooleanQuestion({
		title: 'Site notice',
		question: 'Did you display a notice at the site?',
		description: 'Notifying relevant parties of the application',
		fieldName: 'display-site-notice',
		// fieldName: 'displaySiteNotice',
		url: 'display-site-notice',
		validators: [new RequiredValidator()]
	}),
	lettersToNeighbours: new BooleanQuestion({
		title: 'Letters to neighbours',
		question: 'Did you send letters and emails to neighbours?',
		description: 'Did you send letters and emails to neighbours?',
		fieldName: 'letters-to-neighbours',
		// fieldName: 'lettersToNeighbours',
		url: 'letters-to-neighbours',
		validators: [new RequiredValidator()]
	}),
	uploadLettersToNeighbours: new MultiFileUploadQuestion({
		title: 'Uploaded letters',
		question: 'Upload the letters and emails',
		fieldName: 'upload-letters-emails',
		// fieldName: 'uploadLettersEmails',
		url: 'upload-letters-emails',
		html: 'resources/upload-letters-emails/content.html',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()],
		documentType: documentTypes.uploadLettersToNeighbours
	}),
	pressAdvert: new BooleanQuestion({
		title: 'Press Advert',
		question: 'Did you put an advert in the local press?',
		fieldName: 'press-advert',
		// fieldName: 'pressAdvert',
		url: 'press-advert',
		validators: [new RequiredValidator()]
	}),
	pressAdvertUpload: new MultiFileUploadQuestion({
		title: 'Uploaded press advert',
		question: 'Upload the press advertisement',
		fieldName: 'upload-press-advert',
		// fieldName: 'uploadPressAdvert',
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
		fieldName: 'consultation-responses',
		// fieldName: 'consultationResponses',
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
		fieldName: 'upload-consultation-responses',
		// fieldName: 'uploadConsultationResponses',
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
		fieldName: 'notification-method',
		// fieldName: 'notificationMethod',
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
		fieldName: 'upload-site-notice',
		// fieldName: 'uploadSiteNotice',
		url: 'upload-site-notice',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()],
		documentType: documentTypes.uploadSiteNotice
	}),
	// lettersToNeighboursUpload: new MultiFileUploadQuestion({
	// 	title: 'Letters to neighbours',
	// 	question: 'Upload letters to neighbours',
	// 	fieldName: 'letters-to-neighbours-upload'
	// }),
	// advertisementUpload: new MultiFileUploadQuestion({
	// 	title: 'Advertisement',
	// 	question: 'Upload advertisement',
	// 	fieldName: 'advertisement-upload'
	// }),
	representationsFromOthers: new BooleanQuestion({
		title: 'Representations from other parties',
		question: 'Did you receive representations from members of the public or other parties?',
		url: 'representations',
		fieldName: 'representations-other-parties',
		// fieldName: 'otherPartyRepresentations',
		validators: [
			new RequiredValidator(
				'Select yes if you received representations from members of the public or other parties'
			)
		]
	}),
	representationUpload: new MultiFileUploadQuestion({
		title: 'Upload representations from other parties',
		question: 'Upload the representations',
		fieldName: 'upload-representations',
		// fieldName: 'uploadRepresentations',
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
		fieldName: 'upload-report',
		// fieldName: 'uploadPlanningOfficerReport',
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
		fieldName: 'inspector-access-appeal-site',
		// fieldName: 'lpaSiteAccess',
		url: 'inspector-access-appeal-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need access to the appellant’s land or property'
			),
			new ConditionalRequiredValidator('Enter the reason'),
			new StringValidator({
				regex: {
					regex: new RegExp(`^[0-9a-z- '()]{1,${inputMaxCharacters}}$`, 'gi'),
					regexMessage: 'Reason must only include letters a to z, hyphens, spaces and apostrophes.'
				},
				maxLength: {
					maxLength: inputMaxCharacters,
					maxLengthMessage: `Reason must be ${inputMaxCharacters} characters or less`
				},
				fieldName: getConditionalFieldName(
					'inspector-access-appeal-site',
					'reason-for-inspector-access'
				)
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Enter the reason',
					fieldName: 'reason-for-inspector-access',
					// fieldName: 'lpaSiteAccessDetails',
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
		fieldName: 'inspector-enter-neighbour-site',
		// fieldName: 'neighbourSiteAccess',
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
				fieldName: getConditionalFieldName(
					'inspector-enter-neighbour-site',
					'reason-for-neighbour-inspection'
				)
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Enter the reason',
					fieldName: 'reason-for-neighbour-inspection',
					// fieldName: 'neighbourSiteAccessDetails',
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
		fieldName: 'neighbouring-site-visits',
		// fieldName: 'addNeighbourSiteAccess',
		url: 'neighbour-address',
		subQuestionLabel: 'Neighbour',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator()],
		subQuestion: new AddressAddMoreQuestion({
			title: 'Tell us the address of the neighbour’s land or property',
			question: 'Tell us the address of the neighbour’s land or property',
			fieldName: 'neighbour-site-address',
			// fieldName: 'neighbourSiteAddress'
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
		fieldName: 'safety-risks',
		// fieldName: 'lpaSiteSafetyRisks',
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
				fieldName: getConditionalFieldName('safety-risks', 'new-safety-risk-value')
			})
		],

		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Add details of the potential risk and what the inspector might need',
					fieldName: 'new-safety-risk-value',
					// fieldName: 'lpaSiteSafetyRiskDetails',
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
		fieldName: 'procedure-type',
		// fieldName: 'lpaProcedurePreference',
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
				fieldName: getConditionalFieldName('procedure-type', 'inquiry-duration')
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
					fieldName: 'inquiry-duration',
					// fieldName: 'lpaPreferInquiryDuration',
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
		fieldName: 'prefer-inquiry',
		// fieldName: 'lpaPreferInquiryDetails',
		validators: [new RequiredValidator('Enter why you would prefer an inquiry')]
	}),
	whyHearing: new TextEntryQuestion({
		title: 'Why would you prefer a hearing?',
		question: 'Why would you prefer a hearing?',
		fieldName: 'prefer-hearing',
		// fieldName: 'lpaPreferHearingDetails',
		validators: [new RequiredValidator('Enter why you would prefer a hearing')]
	}),
	appealsNearSite: new BooleanQuestion({
		title: 'Appeals near the site',
		question: 'Are there any other ongoing appeals next to, or close to the site?',
		pageTitle: 'Are there any other ongoing appeals near the site?',
		url: 'ongoing-appeals',
		fieldName: 'other-ongoing-appeals',
		// fieldName: 'nearbyAppeals',
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
		fieldName: 'other-appeals-references',
		// fieldName: 'addNearbyAppeal'
		url: 'appeal-reference-number',
		subQuestionLabel: 'Other appeal',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another appeal')],
		subQuestion: new AddMoreQuestion({
			title: 'Enter an appeal reference number',
			question: 'Enter an appeal reference number',
			fieldName: 'other-appeal-reference',
			// fieldName: 'nearbyAppealReference'
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
		fieldName: 'new-planning-conditions',
		// fieldName: 'newConditions',
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
				fieldName: getConditionalFieldName('new-planning-conditions', 'new-conditions-value')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the new conditions',
					fieldName: 'new-conditions-value',
					// fieldName: 'newConditionDetails',
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
		fieldName: 'emerging-plan',
		// fieldName: 'emergingPlan',
		url: 'emerging-plan',
		validators: [new RequiredValidator()],
		html: 'resources/emerging-plan/content.html'
	}),
	emergingPlanUpload: new MultiFileUploadQuestion({
		title: 'Upload emerging plan and supporting information	',
		question: 'Upload the emerging plan and supporting information',
		fieldName: 'upload-emerging-plan',
		// fieldName: 'uploadEmergingPlan',
		url: 'upload-emerging-plan',
		validators: [
			new RequiredFileUploadValidator('Select the emerging plan and supporting information'),
			new MultifileUploadValidator()
		],
		html: 'resources/emerging-plan-upload/content.html',
		documentType: documentTypes.emergingPlanUpload
	}),
	uploadDevelopmentPlanPolicies: new MultiFileUploadQuestion({
		title: 'Upload policies from statutory development plan',
		question: 'Upload relevant policies from your statutory development plan',
		fieldName: 'upload-development-plan-policies',
		// fieldName: 'uploadDevlopmentPlanPolicies',
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
		fieldName: 'upload-other-policies',
		// fieldName: 'uploadOtherPolicies',
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
		fieldName: 'community-infrastructure-levy',
		// fieldName: 'infrastructureLevy',
		url: 'community-infrastructure-levy',
		validators: [new RequiredValidator('Select yes if you have a community infrastructure levy')],
		html: 'resources/community-infrastructure-levy/content.html'
	}),
	communityInfrastructureLevyUpload: new MultiFileUploadQuestion({
		title: 'Upload your community infrastructure levy',
		question: 'Upload your community infrastructure levy',
		fieldName: 'upload-community-infrastructure-levy',
		// fieldName: 'uploadInfrastructureLevy',
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
		fieldName: 'community-infrastructure-levy-adopted',
		// fieldName: 'infrastructureLevyAdopted',
		url: 'community-infrastructure-levy-adopted',
		validators: [new RequiredValidator()]
	}),
	communityInfrastructureLevyAdoptedDate: new DateQuestion({
		title: 'Date community infrastructure levy adopted',
		question: 'When was the community infrastructure levy formally adopted?',
		fieldName: 'community-infrastructure-levy-adopted-date',
		// fieldName: 'infrastructureLevyAdoptedDate',
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
		fieldName: 'community-infrastructure-levy-adopt-date',
		// fieldName: 'infrastructureLevyExpectedDate',
		hint: 'For example, 21 11 2023',
		validators: [
			new DateValidator('the date you expect to formally adopt the community infrastructure levy', {
				ensureFuture: true
			})
		]
	}),
	uploadNeighbourLetterAddresses: new MultiFileUploadQuestion({
		title: 'Letter sent to neighbours',
		question: 'Upload letters or emails sent to interested parties with their addresses',
		fieldName: 'letters-interested-parties',
		// fieldName: 'uploadLettersInterestedParties',
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
		fieldName: 'tree-preservation-order',
		// fieldName: 'treePreservationOrder',
		url: 'tree-preservation-order',
		validators: [new RequiredValidator()]
	}),
	treePreservationPlanUpload: new MultiFileUploadQuestion({
		title: 'Tree Preservation Order extent',
		question: 'Upload a plan showing the extent of the order',
		fieldName: 'upload-plan-showing-order',
		// fieldName: 'uploadTreePreservationOrder',
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
		fieldName: 'upload-definitive-map-statement',
		// fieldName: 'uploadDefinitiveMapStatement',
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
		fieldName: 'supplementary-planning-documents',
		//fieldName: 'supplementaryPlanningDocs',
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
		fieldName: 'upload-policies-supplementary-planning-documents',
		//fieldName: 'uploadSupplementaryPlanningDocs,'
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
		fieldName: 'scheduled-monument',
		// fieldName: 'affectsScheduledMonument',
		url: 'scheduled-monument',
		validators: [
			new RequiredValidator('Select yes if the development would affect a scheduled monument')
		]
	}),
	gypsyOrTraveller: new BooleanQuestion({
		title: 'Gypsy or Traveller',
		question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
		fieldName: 'gypsy-traveller',
		// fieldName: 'gypsyTraveller',
		url: 'gypsy-traveller',
		validators: [new RequiredValidator()]
	}),
	statutoryConsultees: new RadioQuestion({
		title: 'Statutory consultees',
		question: 'Did you consult all the relevant statutory consultees about the development?',
		fieldName: 'statutory-consultees',
		// fieldName: 'statutoryConsultees'
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
				fieldName: getConditionalFieldName('statutory-consultees', 'consulted-bodies')
			})
		],
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Which bodies did you consult?',
					fieldName: 'consulted-bodies',
					// fieldName: 'consultedBodiesDetails',
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
		fieldName: 'protected-species',
		//fieldName: 'protectedSpecies',
		url: 'protected-species',
		validators: [
			new RequiredValidator('Select yes if the development would affect a protected species')
		]
	}),
	rightOfWayCheck: new BooleanQuestion({
		title: 'Public right of way',
		question: 'Would a public right of way need to be removed or diverted?',
		fieldName: 'public-right-of-way',
		// fieldName: 'publicRightOfWay',
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
		fieldName: 'area-of-outstanding-natural-beauty',
		// fieldName: 'areaOutstandingDuty',
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
		fieldName: 'designated-sites-check',
		//fieldName: 'designatedSites',
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
					fieldName: 'other-designations'
					// fieldName: 'otherDesignations'
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
		fieldName: 'screening-opinion',
		//fieldName: 'screeningOpinion',
		url: 'screening-opinion',
		validators: [new RequiredValidator('Select yes if you have issued a screening opinion')]
	}),
	screeningOpinionEnvironmentalStatement: new BooleanQuestion({
		title: 'Screening opinion environmental statement',
		question: 'Did your screening opinion say the development needed an environmental statement?',
		fieldName: 'screening-opinion-environmental-statement',
		// fieldName: 'environmentalStatement',
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
		fieldName: 'environmental-impact-schedule',
		//fieldName: 'environmentalImpactSchedule',
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
		fieldName: 'upload-environmental-statement',
		// fieldName: 'uploadEnvironmentalStatement',
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
		fieldName: 'column-2-threshold',
		//fieldName: 'columnTwoThreshold',
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
		fieldName: 'sensitive-area',
		// fieldName: 'sensitiveArea',
		url: 'sensitive-area',
		options: [
			{
				text: 'Yes',
				value: 'yes',
				conditional: {
					question: 'Tell us about the sensitive area',
					fieldName: 'sensitive-area-value',
					// fieldName: 'sensitiveAreaDetails',
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
				fieldName: getConditionalFieldName('sensitive-area', 'new-sensitive-area-value')
			})
		]
	}),
	screeningOpinionUpload: new MultiFileUploadQuestion({
		title: 'Screening opinion',
		question: 'Upload your screening opinion and any correspondence',
		fieldName: 'screening-opinion-upload',
		//fieldName: 'uploadScreeningOpinion',
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
		fieldName: 'upload-screening-direction',
		//fieldName: 'uploadScreeningDirection',
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
		fieldName: 'development-description',
		// fieldName: 'developmentDescription',
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
		fieldName: 'environmental-statement',
		// fieldName: 'requiresEnvironmentalStatement',
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
	})
	// rightOfWayUpload: new MultiFileUploadQuestion({
	// 	title: 'Definitive map and statement extract',
	// 	question: 'Upload the definitive map and statement extract',
	// 	fieldName: 'right-of-way-upload'
	// }),
};
