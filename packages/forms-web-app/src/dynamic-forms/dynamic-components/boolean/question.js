const RadioQuestion = require('../radio/question');

class BooleanQuestion extends RadioQuestion {
	/**
	 * @param {Object} params
	 * @param {string} params.title
	 * @param {string} params.question
	 * @param {string} params.fieldName
	 * @param {string} [params.url]
	 * @param {string} [params.hint]
	 * @param {string} [params.pageTitle]
	 * @param {string} [params.description]
	 * @param {string} [params.html]
	 * @param {string} [params.interfaceType]
	 * @param {Array.<import('../../options-question').Option>} [params.options]
	 * @param {Array.<import('../../question').BaseValidator>} [params.validators]
	 */
	constructor({
		title,
		question,
		fieldName,
		url,
		hint,
		pageTitle,
		description,
		html,
		validators,
		interfaceType = 'radio',
		options
	}) {
		let defaultOptions = options || [
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
		];

		if (interfaceType === 'checkbox') {
			defaultOptions = options || [{ text: 'Confirm', value: 'yes' }];
		}

		super({
			title,
			question,
			viewFolder: 'boolean',
			fieldName,
			url,
			hint,
			pageTitle,
			description,
			options: defaultOptions,
			validators,
			html
		});

		this.interfaceType = interfaceType;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise.<Object>}
	 */
	async getDataToSave(req, journeyResponse) {
		// set answer on response
		let responseToSave = { answers: {} };
		const fieldValue = req.body[this.fieldName];

		if (fieldValue === 'yes') {
			responseToSave.answers[this.fieldName] = true;
		} else {
			responseToSave.answers[this.fieldName] = false;
		}

		for (const propName in req.body) {
			if (propName.startsWith(this.fieldName + '_')) {
				responseToSave.answers[propName] = req.body[propName];
				journeyResponse.answers[propName] = req.body[propName];
			}
		}

		journeyResponse.answers[this.fieldName] = fieldValue;

		return responseToSave;
	}
}

module.exports = BooleanQuestion;
