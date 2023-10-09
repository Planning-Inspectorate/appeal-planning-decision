const AddMoreQuestion = require('../add-more/question');

const uuid = require('uuid');

class ListedBuildingAddMoreQuestion extends AddMoreQuestion {
	constructor({ title, question, fieldName, viewFolder, html, validators }) {
		super({
			title,
			viewFolder,
			fieldName,
			question,
			html,
			validators
		});
	}

	/**
	 * adds a uuid to save the listed building
	 * @param {ExpressRequest} req
	 * @returns
	 */
	async getDataToSave(req) {
		return { addMoreId: uuid.v4(), value: { [this.fieldName]: req.body[this.fieldName] } };
	}

	/**
	 *
	 * @param {Object.<Any>} answer
	 * @returns The formatted string to be presented in the UI
	 */
	format(answer) {
		const identifier = answer[this.fieldName];
		const grade = 'Grade';
		const address = 'Address';
		return [identifier, grade, address].join('<br>');
	}
}

module.exports = ListedBuildingAddMoreQuestion;
