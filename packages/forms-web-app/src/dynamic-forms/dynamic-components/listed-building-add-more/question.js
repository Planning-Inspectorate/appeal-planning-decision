const { getListedBuilding } = require('../../../lib/appeals-api-wrapper');
const AddMoreQuestion = require('../add-more/question');
const ListedBuilding = require('@pins/common/src/lib/listed-building');
const { randomUUID } = require('crypto');

/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 */

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

		return { addMoreId: randomUUID(), value: listedBuilding };
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

	/**
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} fieldName
	 */
	getAddMoreAnswers(journeyResponse, fieldName) {
		const listedBuildings = journeyResponse.answers?.SubmissionListedBuilding || [];
		return listedBuildings.filter((listedBuilding) => listedBuilding.fieldName == fieldName);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {string} parentFieldName
	 * @param {JourneyResponse} journeyResponse
	 * @param {Object} responseToSave
	 */
	async saveList(req, parentFieldName, journeyResponse, responseToSave) {
		const listedBuildings = responseToSave.answers[parentFieldName];
		await Promise.all(
			listedBuildings.map((listedBuilding) => {
				const listedBuildingData = listedBuilding.value;
				listedBuildingData.fieldName = this.fieldName;
				return req.appealsApiClient.postSubmissionListedBuilding(
					journeyResponse.referenceId,
					listedBuildingData
				);
			})
		);
	}

	/**
	 * removes answer with answerId from response if present
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @param {string} answerId
	 * @returns {Promise<JourneyResponse | boolean> } updated JourneyResponse
	 */
	async removeList(req, journeyResponse, answerId) {
		const updatedLPA = await req.appealsApiClient.deleteSubmissionListedBuilding(
			journeyResponse.referenceId,
			answerId
		);
		journeyResponse.answers = updatedLPA;
		return updatedLPA.SubmissionListedBuilding?.length > 0 ? journeyResponse : true;
	}
}

module.exports = ListedBuildingAddMoreQuestion;
