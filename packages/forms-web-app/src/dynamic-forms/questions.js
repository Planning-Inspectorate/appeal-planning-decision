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
const IdentifierQuestion = require('./dynamic-components/identifier/question');

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

// Define all questions
exports.questions = {
	appealTypeAppropriate: new BooleanQuestion({
		title: 'Is this the correct type of appeal?',
		question: 'Is this the correct type of appeal?',
		fieldName: 'correct-appeal-type',
		validators: [new RequiredValidator('Select yes if this is the correct type of appeal')]
	}),
	listedBuildingCheck: new BooleanQuestion({
		title: 'Affects a listed building',
		question: 'Does the proposed development affect the setting of listed buildings?',
		fieldName: 'affects-listed-building',
		url: 'affect-listed-building',
		validators: [
			new RequiredValidator(
				'Select yes if the proposed development affects the setting of listed buildings'
			)
		]
	}),
	changedListedBuildingNumber: new IdentifierQuestion({
		title: 'Listed building details',
		pageTitle: 'Listed building details',
		question: 'Tell us the list entry number',
		label: 'Seven digit number',
		fieldName: 'changed-listed-building-number',
		url: 'changed-listed-building-details',
		html: 'resources/listed-building-number/content.html',
		validators: [
			new RequiredValidator('Enter a list entry number'),
			new StringEntryValidator(listedBuildingNumberValidation)
		]
	}),
	affectedListedBuildings: new ListAddMoreQuestion({
		title: 'Listed building or site added',
		pageTitle: 'Listed building or site has been added to the case',
		question: 'Add another building or site?',
		fieldName: 'add-listed-buildings',
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
		validators: [new RequiredValidator()]
	}),
	conservationAreaUpload: new MultiFileUploadQuestion({
		title: 'Conservation area map and guidance',
		question: 'Upload conservation map and guidance',
		fieldName: 'conservation-upload',
		url: 'upload-conservation-area-map-guidance',
		validators: [
			new RequiredFileUploadValidator('Select a conservation map and guidance'),
			new MultifileUploadValidator()
		]
	}),
	greenBelt: new BooleanQuestion({
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		fieldName: 'green-belt',
		validators: [new RequiredValidator()]
	}),
	whoWasNotified: new MultiFileUploadQuestion({
		title: 'Who was notified',
		url: 'upload-who-you-notified',
		question: 'Who did you notify about this application?',
		fieldName: 'notified-who',
		validators: [
			new RequiredFileUploadValidator('Select your document that lists who you notified'),
			new MultifileUploadValidator()
		],
		html: 'resources/notified-who/content.html'
	}),
	displaySiteNotice: new BooleanQuestion({
		title: 'Site notice',
		question: 'Did you display a notice at the site?',
		description: 'Notifying relevant parties of the application',
		fieldName: 'display-site-notice',
		validators: [new RequiredValidator()]
	}),
	lettersToNeighbours: new BooleanQuestion({
		title: 'Letters to neighbours',
		question: 'Did you send letters and emails to neighbours?',
		description: 'Did you send letters and emails to neighbours?',
		fieldName: 'letters-to-neighbours',
		validators: [new RequiredValidator()]
	}),
	uploadLettersToNeighbours: new MultiFileUploadQuestion({
		title: 'Uploaded letters',
		question: 'Upload the letters and emails',
		fieldName: 'upload-letters-emails',
		html: 'resources/upload-letters-emails/content.html',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	pressAdvert: new BooleanQuestion({
		title: 'Press Advert',
		question: 'Did you put an advert in the local press?',
		fieldName: 'press-advert',
		validators: [new RequiredValidator()]
	}),
	pressAdvertUpload: new MultiFileUploadQuestion({
		title: 'Uploaded press advert',
		question: 'Upload the press advertisement',
		fieldName: 'upload-press-advert',
		validators: [
			new RequiredFileUploadValidator('Select the press advertisement'),
			new MultifileUploadValidator()
		]
	}),
	consultationResponses: new BooleanQuestion({
		title: 'Responses or standing advice to upload',
		question:
			'Do you have any consultation responses or standing advice from statutory consultees to upload?',
		fieldName: 'consultation-responses',
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
		validators: [
			new RequiredFileUploadValidator('Select the consultation responses and standing advice'),
			new MultifileUploadValidator()
		]
	}),
	howYouNotifiedPeople: new CheckboxQuestion({
		title: 'Type of notification',
		question: 'How did you notify relevant parties about the planning application?',
		description: 'Select all that apply',
		fieldName: 'notification-method',
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
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
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
		validators: [
			new RequiredFileUploadValidator('Select the representations'),
			new MultifileUploadValidator()
		]
	}),
	planningOfficersReportUpload: new MultiFileUploadQuestion({
		title: 'Upload planning officer’s report',
		question: 'Upload the planning officer’s report or what your decision notice would have said',
		fieldName: 'upload-report',
		html: 'resources/upload-planning-officer-report/content.html',
		url: 'upload-planning-officers-report-decision-notice',
		validators: [
			new RequiredFileUploadValidator(
				'Select the planning officer’s report or what your decision notice would have said'
			),
			new MultifileUploadValidator()
		]
	}),
	accessForInspection: new BooleanQuestion({
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property?',
		pageTitle: "Access to the appellant's land",
		fieldName: 'inspector-access-appeal-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need access to the appellant’s land or property'
			)
		]
	}),
	neighbouringSite: new BooleanQuestion({
		title: 'Inspector visit to neighbour', //Title used in the summary list
		question: 'Might the inspector need to enter a neighbour’s land or property?', //The question being asked
		pageTitle: "Access to a neighbour's land",
		fieldName: 'inspector-visit-neighbour', //The name of the html input field / stem of the name for screens with multiple fields
		url: 'inspector-enter-neighbour-site',
		validators: [
			new RequiredValidator(
				'Select yes if the inspector might need to enter a neighbour’s land or property'
			)
		]
	}),
	neighbouringSitesToBeVisited: new ListAddMoreQuestion({
		title: 'Inspector visit to neighbour',
		pageTitle: 'Neighbour added',
		question: 'Do you want to add another neighbour to be visited?',
		fieldName: 'neighbouring-site-visits',
		url: 'neighbour-address',
		subQuestionLabel: 'Neighbour',
		width: ListAddMoreQuestion.FULL_WIDTH,
		validators: [new RequiredValidator()],
		subQuestion: new AddressAddMoreQuestion({
			title: 'Tell us the address of the neighbour’s land or property',
			question: 'Tell us the address of the neighbour’s land or property',
			fieldName: 'neighbour-site-address',
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
		validators: [
			new RequiredValidator('Select the most appropriate procedure'),
			new ConditionalRequiredValidator('Enter how many days you expect the inquiry to last'),
			new StringValidator({
				regex: {
					regex: '^[1-9]\\d{0,2}$',
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
					inputClasses: 'govuk-input--width-3',
					label: 'Length in days:',
					type: 'text'
				}
			}
		]
	}),
	appealsNearSite: new BooleanQuestion({
		title: 'Appeals near the site',
		question: 'Are there any other ongoing appeals next to, or close to the site?',
		pageTitle: 'Are there any other ongoing appeals near the site?',
		url: 'ongoing-appeals',
		fieldName: 'other-ongoing-appeals',
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
		url: 'appeal-reference-number',
		subQuestionLabel: 'Other appeal',
		subQuestionInputClasses: 'govuk-input--width-10',
		validators: [new RequiredValidator('Select yes if you want to add another appeal')],
		subQuestion: new AddMoreQuestion({
			title: 'Enter an appeal reference number',
			question: 'Enter an appeal reference number',
			fieldName: 'other-appeal-reference',
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
		validators: [new RequiredValidator()],
		html: 'resources/emerging-plan/content.html'
	}),
	emergingPlanUpload: new MultiFileUploadQuestion({
		title: 'Upload emerging plan and supporting information	',
		question: 'Upload the emerging plan and supporting information',
		fieldName: 'upload-emerging-plan',
		validators: [
			new RequiredFileUploadValidator('Select the emerging plan and supporting information'),
			new MultifileUploadValidator()
		],
		html: 'resources/emerging-plan-upload/content.html'
	}),
	uploadOtherRelevantPolicies: new MultiFileUploadQuestion({
		title: 'Upload other relevant policies',
		question: 'Upload any other relevant policies',
		fieldName: 'upload-other-policies',
		validators: [
			new RequiredFileUploadValidator('Select any other relevant policies'),
			new MultifileUploadValidator()
		]
	}),
	communityInfrastructureLevy: new BooleanQuestion({
		title: 'Community infrastructure levy',
		question: 'Do you have a community infrastructure levy?',
		fieldName: 'community-infrastructure-levy',
		validators: [new RequiredValidator('Select yes if you have a community infrastructure levy')],
		html: 'resources/community-infrastructure-levy/content.html'
	}),
	communityInfrastructureLevyUpload: new MultiFileUploadQuestion({
		title: 'Upload your community infrastructure levy',
		question: 'Upload your community infrastructure levy',
		fieldName: 'upload-community-infrastructure-levy',
		validators: [
			new RequiredFileUploadValidator('Select your community infrastructure levy'),
			new MultifileUploadValidator()
		]
	}),
	communityInfrastructureLevyAdopted: new BooleanQuestion({
		title: 'Community infrastructure levy formally adopted',
		question: 'Is the community infrastructure levy formally adopted?',
		fieldName: 'community-infrastructure-levy-adopted',
		validators: [new RequiredValidator()]
	}),
	communityInfrastructureLevyAdoptedDate: new DateQuestion({
		title: 'Date community infrastructure levy adopted',
		question: 'When was the community infrastructure levy formally adopted?',
		fieldName: 'community-infrastructure-levy-adopted-date',
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
		validators: [
			new RequiredFileUploadValidator(
				'Select letters or emails sent to interested parties with their addresses'
			),
			new MultifileUploadValidator()
		]
	}),
	treePreservationOrder: new BooleanQuestion({
		title: 'Tree Preservation Order',
		question: 'Does a Tree Preservation Order (TPO) apply to any part of the appeal site?',
		fieldName: 'tree-preservation-order',
		validators: [new RequiredValidator()]
	}),
	treePreservationPlanUpload: new MultiFileUploadQuestion({
		title: 'Tree Preservation Order extent',
		question: 'Upload a plan showing the extent of the order',
		fieldName: 'upload-plan-showing-order',
		validators: [
			new RequiredFileUploadValidator('Select a plan showing the extent of the order'),
			new MultifileUploadValidator()
		]
	}),
	uploadDefinitiveMap: new MultiFileUploadQuestion({
		title: 'Definitive map and statement extract',
		question: 'Upload the definitive map and statement extract',
		fieldName: 'upload-definitive-map-statement',
		validators: [
			new RequiredFileUploadValidator('Select the definitive map and statement extract'),
			new MultifileUploadValidator()
		]
	}),
	supplementaryPlanning: new BooleanQuestion({
		title: 'Supplementary planning documents',
		question: 'Did any supplementary planning documents inform the outcome of the application?',
		fieldName: 'supplementary-planning-documents',
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
		validators: [
			new RequiredFileUploadValidator(
				'Select the relevant policy extracts and supplementary planning documents'
			),
			new MultifileUploadValidator()
		]
	}),
	scheduledMonument: new BooleanQuestion({
		title: 'Affects a scheduled monument',
		question: 'Would the development affect a scheduled monument?',
		fieldName: 'scheduled-monument',
		validators: [
			new RequiredValidator('Select yes if the development would affect a scheduled monument')
		]
	}),
	gypsyOrTraveller: new BooleanQuestion({
		title: 'Gypsy or Traveller',
		question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
		fieldName: 'gypsy-traveller',
		validators: [new RequiredValidator()]
	}),
	statutoryConsultees: new RadioQuestion({
		title: 'Statutory consultees',
		question: 'Did you consult all the relevant statutory consultees about the development?',
		fieldName: 'statutory-consultees',
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
		validators: [
			new RequiredValidator('Select yes if the development would affect a protected species')
		]
	}),
	changesListedBuilding: new BooleanQuestion({
		title: 'Changes a listed building',
		question: 'Does the proposed development change a listed building?',
		fieldName: 'changes-listed-building',
		validators: [new RequiredValidator()]
	}),
	rightOfWayCheck: new BooleanQuestion({
		title: 'Public right of way',
		question: 'Would a public right of way need to be removed or diverted?',
		fieldName: 'public-right-of-way',
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
		title: 'Screening opinion',
		question: 'Have you issued a screening opinion?',
		fieldName: 'screening-opinion',
		validators: [new RequiredValidator('Select yes if you have issued a screening opinion')]
	}),
	screeningOpinionEnvionmentalStatement: new BooleanQuestion({
		title: 'Screening opinion environmental statement',
		question: 'Did your screening opinion say the development needed an environmental statement?',
		fieldName: 'screening-opinion-environmental-statement',
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
	})
	// rightOfWayUpload: new MultiFileUploadQuestion({
	// 	title: 'Definitive map and statement extract',
	// 	question: 'Upload the definitive map and statement extract',
	// 	fieldName: 'right-of-way-upload'
	// }),
};
