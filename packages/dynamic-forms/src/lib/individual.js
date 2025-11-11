/**
 * Defines the shape of a named individual object
 * @class
 */
class Individual {
	/**
	 * @type {string} - the first name of the individual
	 */
	firstName;

	/**
	 * @type {string} - the second name of the individual
	 */
	lastName;

	/**
	 * creates an instance of an enforcement named individual
	 * @param {Object} params
	 * @param {string} params.firstName
	 * @param {string} params.lastName
	 */
	constructor({ firstName, lastName }) {
		if (firstName) {
			this.firstName = firstName.trim();
		} else {
			throw new Error('Individual requires firstName');
		}

		if (lastName) {
			this.lastName = lastName.trim();
		} else {
			throw new Error('Individual requires lastName');
		}
	}
}

module.exports = Individual;
