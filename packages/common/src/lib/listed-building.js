/**
 * Defines the shape of a ListedBuilding object
 * @class
 */
class ListedBuilding {
	/**
	 * @type {string} - the reference of the Listed Building
	 */
	reference;

	/**
	 * @type {string} - the address of the Listed Building
	 */
	name;

	/**
	 * @type {string} - the grade of the Listed Building
	 */
	listedBuildingGrade;

	/**
	 * creates an instance of a listed building
	 * @param {string} reference
	 * @param {string | null} [name]
	 * @param {string | null} [listedBuildingGrade]
	 */
	constructor(reference, name, listedBuildingGrade) {
		if (reference) {
			this.reference = reference;
		} else {
			throw new Error('Listed Building requires reference');
		}

		if (name) {
			this.name = name;
		} else {
			throw new Error('Listed Building requires name');
		}

		if (listedBuildingGrade) {
			this.listedBuildingGrade = listedBuildingGrade;
		} else {
			throw new Error('Listed Building requires grade');
		}
	}
}

module.exports = ListedBuilding;
