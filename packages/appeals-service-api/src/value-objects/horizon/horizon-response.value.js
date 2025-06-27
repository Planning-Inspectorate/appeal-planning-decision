class HorizonResponseValue {
	#isError;
	#value;

	/**
	 *
	 * @param {any} value
	 * @param {boolean} isError
	 */
	constructor(value, isError) {
		this.#value = value;
		this.#isError = isError;
	}

	isNotAnError() {
		return this.#isError == false;
	}

	getValue() {
		return this.#value;
	}
}

module.exports = HorizonResponseValue;
