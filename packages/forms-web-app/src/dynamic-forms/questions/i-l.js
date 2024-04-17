/*************************************************************
 * This file holds the definitions for all questions         *
 * regardless of which questionnaire they get used on.       *
 * This allows us to reuse questions between questionnaire   *
 * types without having the overhead of managing duplicates. *
 *************************************************************/

const BooleanQuestion = require('../dynamic-components/boolean/question');
const RequiredValidator = require('../validator/required-validator');

// Define all questions

module.exports = {
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
	lettersToNeighbours: new BooleanQuestion({
		title: 'Letters to neighbours',
		question: 'Did you send letters and emails to neighbours?',
		description: 'Did you send letters and emails to neighbours?',
		// fieldName: 'letters-to-neighbours',
		fieldName: 'lettersToNeighbours',
		url: 'letters-to-neighbours',
		validators: [new RequiredValidator()]
	}),
	identifyingLandowners: new BooleanQuestion({
		title: 'Identifying the landowners?',
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
	})
};
