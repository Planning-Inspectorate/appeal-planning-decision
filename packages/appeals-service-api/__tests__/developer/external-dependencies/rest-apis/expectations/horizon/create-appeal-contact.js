module.exports = class HorizonCreateAppealContactExpectation {
	id;
	fullName;
	involvement;

	constructor(id, fullName, involvement) {
		this.id = id;
		this.fullName = fullName;
		this.involvement = involvement;
	}

	getId() {
		return this.id;
	}

	getFullName() {
		return this.fullName;
	}

	getInvolvement() {
		return this.involvement;
	}
};
