module.exports = class RequestBodyExpectation {
	numberOfJsonKeys;

	constructor(numberOfJsonKeys) {
		this.numberOfJsonKeys = numberOfJsonKeys;
	}

	getNumberOfJsonKeys() {
		return this.numberOfJsonKeys;
	}
};
