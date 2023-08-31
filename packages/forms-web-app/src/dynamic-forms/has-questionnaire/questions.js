/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const { CheckboxQuestion } = require('../dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const RequiredValidator = require('../validator/required-validator');

// Define all questions
exports.questions = {
	appealTypeAppropriate: new BooleanQuestion({
		title: 'Is this the correct type of appeal?',
		question: 'Is this the correct type of appeal?',
		fieldName: 'correct-appeal-type',
		validators: [new RequiredValidator()]
	}),
	listedBuildingCheck: new BooleanQuestion({
		title: 'Affects on a listed building or site',
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
		question: 'Is the site in or next to a conservation area?',
		fieldName: 'conservation-area',
		validators: [new RequiredValidator()]
	}),
	conservationAreaUpload: new MultiFileUploadQuestion({
		title: 'Conservation area map and guidance',
		question: 'Upload conservation map and guidance',
		description:
			'<a href="https://magic.defra.gov.uk/magicmap.aspx" target="_blank" class="govuk-link">Link to Magic Maps (opens in new tab)</a>',
		fieldName: 'conservation-area-upload'
	}),
	greenBelt: new BooleanQuestion({
		title: 'Is the site in a green belt?',
		question: 'Is the site in a green belt?',
		fieldName: 'green-belt',
		validators: [new RequiredValidator()]
	}),
	whoWasNotified: new MultiFileUploadQuestion({
		title: 'Who was notified',
		question: 'Who was notified',
		description: 'This should include internal consultees.',
		fieldName: 'notified-who',
		validators: [new RequiredValidator('You must add your documents')]
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
	// siteNoticeUpload: new MultiFileUploadQuestion({
	// 	title: 'Site notice',
	// 	question: 'Upload site notice',
	// 	fieldName: 'site-notice-upload'
	// }),
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
		question: 'Did you receive representations from other parties?',
		fieldName: 'representations-from-others'
	}),
	// representationUpload: new MultiFileUploadQuestion({
	// 	title: 'Upload representations',
	// 	question: 'Upload representations from other parties',
	// 	fieldName: 'representation-upload'
	// }),
	planningOfficersUpload: new MultiFileUploadQuestion({
		title: 'Upload planning officers report',
		question: 'Upload planning officer’s report',
		fieldName: 'planning-officers-upload'
	}),
	accessForInspection: new BooleanQuestion({
		title: 'Access for inspection',
		question: 'Might the inspector need access to the appellant’s land or property??',
		fieldName: 'access-for-inspection'
	}),
	neighbouringSite: new BooleanQuestion({
		title: 'Could a neighbouring site be affected?', //Title used in the summary list
		question: 'Do the plans affect a neighbouring site?', //The question being asked
		fieldName: 'neighbouring-site-affected' //The name of the html input field / stem of the name for screens with multiple fields
	}),
	potentialSafetyRisks: {
		title: 'Potential safety risks',
		question: 'Add potential safety risks',
		subQuestion: 'Are there any potential safety risks?',
		description:
			'You need to tell inspectors how to prepare for a site visit and what to bring. \n \n What you tell us might include:',
		points: [
			'there is no, or limited mobile reception',
			'access is blocked',
			'ladders or other equipment is needed',
			'site health and safety rules need to be followed (for instance, a hard hat, boots and hi visibility clothing)',
			'there is livestock or other animals',
			'there is dangerous debris or overgrown vegetation',
			'there is potentially hazardous material, such as asbestos'
		],
		conditional: 'Add details of the potential risk and what the inspector might need',
		conditionalId: 'potential-safety-risks-correct-details',
		type: 'boolean-text',
		fieldName: 'potential-safety-risks',
		required: false,
		show: (answers) => {
			return answers['access-for-inspection'] === 'yes';
		},
		validator: { type: 'text', maxLength: 100 }
	},
	appealsNearSite: new BooleanQuestion({
		title: 'Appeals near the site', //Title used in the summary list
		question: 'Add another appeal?', //The question being asked
		fieldName: 'appeals-near-site' //The name of the html input field / stem of the name for screens with multiple fields
	}),
	addNewConditions: new BooleanQuestion({
		title: 'Add new conditions', //Title used in the summary list
		question: 'Do you want to add new planning conditions to this appeal?', //The question being asked
		fieldName: 'add-new-conditions' //The name of the html input field / stem of the name for screens with multiple fields
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
