const JsonPathExpression = require('../json-path-expression');

module.exports = class Interaction {
	description;
	numberOfKeysExpectedInJson = 0;
	jsonPathStringsToExpectedValues = new Map([]);

	constructor(description) {
		this.description = description;
	}

	toString() {
		let result = `Description: ${this.description}\n`;
		this.jsonPathStringsToExpectedValues.forEach((key, value) => {
			result += key + ': ' + value + '\n';
		});
		return result;
	}

	getNumberOfKeysExpectedInJson() {
		return this.numberOfKeysExpectedInJson;
	}

	getJsonPathStringsToExpectedValues() {
		return this.jsonPathStringsToExpectedValues;
	}

	setNumberOfKeysExpectedInJson(numberOfKeysExpected) {
		this.numberOfKeysExpectedInJson = numberOfKeysExpected;
		return this;
	}

	addJsonValueExpectation(expression, value) {
		this.jsonPathStringsToExpectedValues.set(expression, value);
		return this;
	}

	addStringAttributeExpectationForHorizonCreateAppealInteraction(attributeNumber, key, value) {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['a:Value']`
			),
			value
		);

		return this;
	}

	addDateAttributeExpectationForHorizonCreateAppealInteraction(attributeNumber, key, value) {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['a:Value']`
			),
			value ? value : RegExp('.+')
		);

		return this;
	}

	addContactAttributeExpectationForHorizonCreateAppealInteraction(attributeNumber) {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['__i:type']`
			),
			'a:SetAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${attributeNumber}]['a:AttributeValue']['a:Name']`
			),
			'Case Involvement:Case Involvement'
		);

		return this;
	}

	addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
		contactArrayAttributeNumber,
		attributeNumber,
		key,
		value
	) {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['a:Value']`
			),
			value
		);

		return this;
	}

	addDateAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
		contactArrayAttributeNumber,
		attributeNumber,
		key,
		value
	) {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateCase.category['a:Attributes'][${contactArrayAttributeNumber}]['a:AttributeValue']['a:Values'][${attributeNumber}]['a:AttributeValue']['a:Value']`
			),
			value ? value : RegExp('.+')
		);

		return this;
	}
};
