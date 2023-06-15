class LpaEntity {
	#_id;
	#objectId;
	#lpa19CD;
	#lpaCode;
	#name;
	#email;
	#domain;
	#inTrial;

	constructor(_id, objectId, lpa19CD, lpaCode, name, email, domain, inTrial) {
		this.#_id = _id;
		this.#objectId = objectId;
		this.#lpa19CD = lpa19CD;
		this.#lpaCode = lpaCode;
		this.#name = name;
		this.#email = email;
		this.#domain = domain;
		this.#inTrial = inTrial;
	}

	static createFromJson(json) {
		return new LpaEntity(
			json._id,
			json._objectId,
			json.lpa19CD,
			json.lpaCode,
			json.name,
			json.email,
			json.domain,
			json.inTrial
		);
	}

	getLpa19CD() {
		return this.#lpa19CD;
	}
	getLpaCode() {
		return this.#lpaCode;
	}
	getName() {
		return this.#name;
	}
	getEmail() {
		return this.#email;
	}
	getDomain() {
		return this.#domain;
	}

	isInTrial() {
		return this.#inTrial;
	}
	getCountry() {
		const isWales = new RegExp('^W[0-9]{8}$');
		if (isWales.test(this.#lpa19CD)) {
			return 'Wales';
		} else {
			return 'England';
		}
	}

	toJson() {
		return {
			_id: this.#_id,
			objectId: this.#objectId,
			lpa19CD: this.#lpa19CD,
			lpaCode: this.#lpaCode,
			name: this.#name,
			email: this.#email,
			domain: this.#domain,
			inTrial: this.#inTrial
		};
	}
}

module.exports = LpaEntity;
