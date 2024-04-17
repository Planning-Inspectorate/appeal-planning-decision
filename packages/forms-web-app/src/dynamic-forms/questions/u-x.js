/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const MultiFileUploadQuestion = require('../dynamic-components/multi-file-upload/question');
const RadioQuestion = require('../dynamic-components/radio/question');
const RequiredValidator = require('../validator/required-validator');
const RequiredFileUploadValidator = require('../validator/required-file-upload-validator');
const MultifileUploadValidator = require('../validator/multifile-upload-validator');

const TextEntryQuestion = require('../dynamic-components/text-entry/question');

const { documentTypes } = require('@pins/common');

// Define all questions

module.exports = {
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
	uploadLettersToNeighbours: new MultiFileUploadQuestion({
		title: 'Uploaded letters',
		question: 'Upload the letters and emails',
		// fieldName: 'upload-letters-emails',
		fieldName: 'uploadLettersEmails',
		url: 'upload-letters-emails',
		html: 'resources/upload-letters-emails/content.html',
		validators: [new RequiredFileUploadValidator(), new MultifileUploadValidator()],
		documentType: documentTypes.uploadLettersToNeighbours
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
	uploadDevelopmentPlanPolicies: new MultiFileUploadQuestion({
		title: 'Upload policies from statutory development plan',
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
	uploadOriginalApplicationForm: new MultiFileUploadQuestion({
		title: 'Upload your separate ownership certificate and agricultural land declaration',
		question: 'Upload your separate ownership certificate and agricultural land declaration',
		fieldName: 'uploadOriginalApplicationForm',
		url: 'upload-application-form',
		validators: [
			new RequiredFileUploadValidator(
				'Select your separate ownership certificate and agricultural land declaration'
			),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadOriginalApplicationForm
	}),
	uploadApplicationDecisionLetter: new MultiFileUploadQuestion({
		title: 'Upload the decision letter from the local planning authority',
		question: 'Upload the decision letter from the local planning authority',
		description: `This letter tells you about the decision on your application. \nWe need the letter from the local planning authority that tells you their decision on your planning application (also called a ‘decision notice’).\nDo not upload the planning officer’s report.`,
		fieldName: 'uploadApplicationDecisionLetter',
		url: 'upload-decision-letter',
		validators: [
			new RequiredFileUploadValidator('Select the decision letter'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadApplicationDecisionLetter
	}),
	uploadChangeOfDescriptionEvidence: new MultiFileUploadQuestion({
		title: 'Upload evidence of your agreement to change the description of development',
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
	updateDevelopmentDescription: new RadioQuestion({
		title: 'Did the local planning authority change the description of development? ',
		question: 'Did the local planning authority change the description of development? ',
		fieldName: 'updateDevelopmentDescription',
		url: 'development-description-correct',
		hint: 'We need to know if the description of development is the same as what is on your planning application.',
		validators: [
			new RequiredValidator(
				'Select yes if the local planning authority changed the description of development'
			)
		],
		options: [
			{
				text: 'Yes, I agreed a new description with the local planning authority',
				value: 'yes'
			},
			{
				text: 'No',
				value: 'no'
			}
		]
	}),
	uploadAppellantStatement: new MultiFileUploadQuestion({
		title: 'Upload your appeal statement',
		question: 'Upload your appeal statement',
		description:
			'Your appeal statement explains why you disagree with the local planning authority’s decision.\nYou can upload any documents that you refer to in your appeal statement later.',
		fieldName: 'uploadAppellantStatement',
		url: 'upload-appeal-statement',
		validators: [
			new RequiredFileUploadValidator('Select your appeal statement'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadAppellantStatement
	}),
	uploadCostApplication: new MultiFileUploadQuestion({
		title: 'Upload your application for an award of appeal costs',
		question: 'Upload your application for an award of appeal costs',
		fieldName: 'uploadCostApplication',
		url: 'upload-appeal-costs-application',
		validators: [
			new RequiredFileUploadValidator('Select your application for an award of appeal costs'),
			new MultifileUploadValidator()
		],
		documentType: documentTypes.uploadCostApplication
	})
};
