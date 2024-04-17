/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const CheckboxQuestion = require('../dynamic-components/checkbox/question');
const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const BooleanQuestion = require('../dynamic-components/boolean/question');
const RadioQuestion = require('../dynamic-components/radio/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');
const TextEntryQuestion = require('../dynamic-components/text-entry/question');
const SingleLineInputQuestion = require('../dynamic-components/single-line-input/question');
const { documentTypes } = require('@pins/common');

// Define all questions

module.exports = {
	greenBelt: new BooleanQuestion({
		title: 'Green belt',
		question: 'Is the site in a green belt?',
		// fieldName: 'green-belt',
		fieldName: 'greenBelt',
		url: 'green-belt',
		validators: [new RequiredValidator()]
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
	gypsyOrTraveller: new BooleanQuestion({
		title: 'Gypsy or Traveller',
		question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
		// fieldName: 'gypsy-traveller',
		fieldName: 'gypsyTraveller',
		url: 'gypsy-traveller',
		validators: [new RequiredValidator()]
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
	enterApplicationReference: new SingleLineInputQuestion({
		title: 'What is the planning application reference number?',
		question: 'What is the planning application reference number?',
		fieldName: 'applicationReference',
		url: 'reference-number',
		hint: 'You can find this on any correspondence from the local planning authority. For example, the letter confirming your application.',
		validators: [new RequiredValidator('Enter the planning application reference number')]
	}),
	enterDevelopmentDescription: new TextEntryQuestion({
		title: 'Enter the description of development that you submitted in your planning application',
		question:
			'Enter the description of development that you submitted in your planning application',
		fieldName: 'developmentDescriptionOriginal',
		url: 'enter-description-of-development',
		hint: 'If the local planning authority changed the description of development, you can upload evidence of your agreement to change the description later.',
		validators: [new RequiredValidator('Enter a description')]
	})
};
