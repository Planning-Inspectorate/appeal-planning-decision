module.exports = class JsonPathExpression {
	static create(expression) {
		return new JsonPathExpression(expression);
	}

	constructor(expression) {
		this.expression = expression;
	}

	get() {
		return this.expression;
	}

	toString() {
		return this.expression;
	}
};
