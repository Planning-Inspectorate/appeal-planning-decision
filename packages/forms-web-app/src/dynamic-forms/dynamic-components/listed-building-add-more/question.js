const { getListedBuilding } = require('../../../lib/appeals-api-wrapper');
const AddMoreQuestion = require('../add-more/question');
const ListedBuilding = require('@pins/common/src/lib/listed-building');
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
	 * @param {import('express').Request} req
	 * @returns
	 */
	async getDataToSave(req) {
		const listedBuildingReference = req.body[this.fieldName];

		const listedBuildingData = await getListedBuilding(listedBuildingReference);

		const listedBuilding = new ListedBuilding(
			listedBuildingReference,
			listedBuildingData.name,
			listedBuildingData.listedBuildingGrade
		);

		return { addMoreId: uuid.v4(), value: listedBuilding };
	}

	/**
	 *
	 * @param {Object.<Any>} answer
	 * @returns The formatted string to be presented in the UI
	 */
	format(answer) {
		const identifier = answer.reference;
		const grade = answer.listedBuildingGrade;
		const address = answer.name;
		return [identifier, grade, address].join('<br>');
	}
}

module.exports = ListedBuildingAddMoreQuestion;
