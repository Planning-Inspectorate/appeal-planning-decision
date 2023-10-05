/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const CheckboxQuestion = require('./dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('./dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('./dynamic-components/boolean/question');
const BooleanTextQuestion = require('./dynamic-components/boolean-text/question');
const RequiredValidator = require('./validator/required-validator');
const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const MultifileUploadValidator = require('./validator/multifile-upload-validator');
const AddressValidator = require('./validator/address-validator');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const AddMoreQuestion = require('./dynamic-components/add-more/question');
const AddressAddMoreQuestion = require('./dynamic-components/address-add-more/question');
const IdentifierQuestion = require('./dynamic-components/identifier/question');
const StringEntryValidator = require('./validator/string-validator');

const {
	validation: {
		stringValidation: { listedBuildingNumber: listedBuildingNumberValidation }
	}
} = require('../../src/config');

// Define all questions
exports.questions = {
	appealTypeAppropriate: new BooleanQuestion({
		title: 'Is this the correct type of appeal?',
		question: 'Is this the correct type of appeal?',
		fieldName: 'correct-appeal-type',
		validators: [new RequiredValidator()]
	}),
	listedBuildingCheck: new BooleanQuestion({
		title: 'Affects a listed building',
		question: 'Do the plans affect the setting of a listed building or site?',
		fieldName: 'affects-listed-building',
		validators: [new RequiredValidator()]
	}),
	listedBuildingNumber: new IdentifierQuestion({
		title: 'Tell us the list entry number',
		question: 'Tell us the list entry number',
		label: 'Seven digit number',
		fieldName: 'listed-building-number',
		html: 'resources/listed-building-number/content.html',
		validators: [new StringEntryValidator(listedBuildingNumberValidation)]
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
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	greenBelt: new BooleanQuestion({
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		fieldName: 'green-belt',
		validators: [new RequiredValidator()]
	}),
	whoWasNotified: new MultiFileUploadQuestion({
		title: 'Who was notified',
		pageTitle: 'Who did you notify?',
		url: 'who-you-notified',
		question: 'Who did you notify about this application?',
		fieldName: 'notified-who',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
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
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),

	howYouNotifiedPeople: new CheckboxQuestion({
		title: 'How you notified people',
		question: 'How did you notify people about the application?',
		description: 'Select all that apply',
		fieldName: 'notification-method',
		options: [
			//Options for checkboxes / radio buttons
			{
				text: 'Site notice',
				value: 'Site notice'
			},
			{
				text: 'Letters to neighbours',
				value: 'Letters to neighbours'
			},
			{
				text: 'Advertisement',
				value: 'Advertisement'
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
		fieldName: 'representations-other-parties',
		validators: [new RequiredValidator()]
	}),
	representationUpload: new MultiFileUploadQuestion({
		title: 'Upload representations from other parties',
		question: 'Upload the representations',
		fieldName: 'upload-representations',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	planningOfficersReportUpload: new MultiFileUploadQuestion({
		title: 'Upload planning officer’s report',
		question: 'Upload the planning officer’s report',
		fieldName: 'upload-report',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	accessForInspection: new BooleanQuestion({
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property?',
		pageTitle: "Access to the appellant's land",
		fieldName: 'inspector-visit-appellant',
		validators: [new RequiredValidator()]
	}),
	neighbouringSite: new BooleanQuestion({
		title: 'Inspector visit to neighbour', //Title used in the summary list
		question: 'Might the inspector need to enter a neighbour’s land or property?', //The question being asked
		pageTitle: "Access to a neighbour's land",
		fieldName: 'inspector-visit-neighbour', //The name of the html input field / stem of the name for screens with multiple fields
		validators: [new RequiredValidator()]
	}),
	neighbouringSitesToBeVisited: new ListAddMoreQuestion({
		title: 'Neighbour added',
		question: 'Do you want to add another neighbour to be visited?',
		fieldName: 'neighbouring-site-visits',
		url: 'neighbours',
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
	potentialSafetyRisks: new BooleanTextQuestion({
		title: 'Potential safety risks',
		question: 'Add potential safety risks',
		//subQuestion: 'Are there any potential safety risks?',
		description:
			'You need to tell inspectors how to prepare for a site visit and what to bring. \n \n What you tell us might include:',
		// points: [
		// 	'there is no, or limited mobile reception',
		// 	'access is blocked',
		// 	'ladders or other equipment is needed',
		// 	'site health and safety rules need to be followed (for instance, a hard hat, boots and hi visibility clothing)',
		// 	'there is livestock or other animals',
		// 	'there is dangerous debris or overgrown vegetation',
		// 	'there is potentially hazardous material, such as asbestos'
		// ],
		//conditional: 'Add details of the potential risk and what the inspector might need',
		//conditionalId: 'potential-safety-risks-correct-details',
		fieldName: 'safety-risks',
		//required: false,
		// show: (answers) => {
		// 	return answers['access-for-inspection'] === 'yes';
		// },
		//validator: { type: 'text', maxLength: 100 }
		validators: []
	}),
	appealsNearSite: new BooleanQuestion({
		title: 'Appeals near the site',
		question: 'Are there any other ongoing appeals next to, or close to the site?',
		pageTitle: 'Are there any other ongoing appeals near the site?',
		fieldName: 'other-ongoing-appeals',
		validators: [new RequiredValidator()]
	}),
	nearbyAppeals: new ListAddMoreQuestion({
		title: 'Nearby appeal added to the case',
		question: 'Add another appeal?',
		fieldName: 'other-appeals-references',
		url: 'nearby-appeals-list',
		subQuestionLabel: 'Appeal',
		validators: [new RequiredValidator()],
		subQuestion: new AddMoreQuestion({
			title: 'Enter an appeal reference number',
			question: 'Enter an appeal reference number',
			fieldName: 'other-appeal-reference',
			hint: 'You can add more appeals later if there is more than one nearby',
			validators: [new RequiredValidator()],
			viewFolder: 'identifier'
		})
	}),
	addNewConditions: new BooleanTextQuestion({
		title: 'Add new conditions', // this is summary list title
		question: 'Add new planning conditions to this appeal', // this text is the page heading
		description: 'These are additional to the standard planning conditions we would expect to see.',
		fieldName: 'new-planning-conditions',
		html: 'resources/new-planning-conditions/content.html',
		label: 'Are there any new conditions?',
		validators: [new RequiredValidator()], // todo: new BooleanTestValidator() aapd-393
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
	})
	// /*S78 questions */
	// rightOfWayCheck: new BooleanQuestion({
	// 	title: 'Public right of way',
	// 	question: 'Would a public right of way need to be removed or diverted?',
	// 	fieldName: 'right-of-way-check'
	// }),
	// rightOfWayUpload: new MultiFileUploadQuestion({
	// 	title: 'Definitive map and statement extract',
	// 	question: 'Upload the definitive map and statement extract',
	// 	fieldName: 'right-of-way-upload'
	// }),
	// designatedSitesCheck: new CheckboxQuestion({
	// 	title: 'Designated sites',
	// 	question: 'Is the development in, near or likely to affect any designated sites?',
	// 	fieldName: 'designated-sites-check',
	// 	options: [
	// 		//Options for checkboxes / radio buttons
	// 		{
	// 			text: 'SSSI (site of special scientific interest)',
	// 			value: 'SSSI'
	// 		},
	// 		{
	// 			text: 'Other',
	// 			value: 'other',
	// 			conditional: {
	// 				question: 'Other designation(s)',
	// 				type: 'text',
	// 				fieldName: 'other-desigations'
	// 			}
	// 		},
	// 		{
	// 			divider: 'or'
	// 		},
	// 		{
	// 			text: 'No, it is not in, near or likely to affect any designated sites',
	// 			value: 'None',
	// 			behaviour: 'exclusive'
	// 		}
	// 	]
	// })
};
