/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const CheckboxQuestion = require('../dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const BooleanTextQuestion = require('../dynamic-components/boolean-text/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');

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
	listedBuildingNumber: new BooleanQuestion({
		title: '*************placeholder**************',
		question: '*************placeholder**************',
		fieldName: 'listed-building-number',
		validators: [new RequiredValidator()]
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
		fieldName: 'conservation-area-upload',
		validators: [new RequiredValidator('You must add your documents')]
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
		title: 'Upload the press advertisement',
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
		title: 'Site notice',
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
		fieldName: 'representation-upload',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	planningOfficersReportUpload: new MultiFileUploadQuestion({
		title: 'Upload planning officers report',
		question: 'Upload the planning officer’s report',
		fieldName: 'upload-report',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()]
	}),
	accessForInspection: new BooleanQuestion({
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property?',
		fieldName: 'inspector-visit-appellant',
		validators: [new RequiredValidator()]
	}),
	neighbouringSite: new BooleanQuestion({
		title: 'Inspector visit to neighbour', //Title used in the summary list
		question: 'Might the inspector need to enter a neighbour’s land or property?', //The question being asked
		fieldName: 'inspector-visit-neighbour' //The name of the html input field / stem of the name for screens with multiple fields
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
	addNewConditions: new BooleanQuestion({
		title: 'Add new conditions',
		question: 'Do you want to add new planning conditions to this appeal?',
		fieldName: 'new-planning-conditions'
	}),
	otherAppealReference: new BooleanQuestion({
		title: '*?',
		question: '*?',
		fieldName: 'other-appeal-reference'
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
