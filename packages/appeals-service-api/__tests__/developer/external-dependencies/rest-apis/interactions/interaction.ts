import { JsonPathExpression } from '../json-path-expression';

export class Interaction {
	private numberOfKeysExpectedInJson: number = 0;
	private jsonPathStringsToExpectedValues: Map<JsonPathExpression, RegExp | number | string> =
		new Map([]);

	getNumberOfKeysExpectedInJson(): number {
		return this.numberOfKeysExpectedInJson;
	}

	getJsonPathStringsToExpectedValues(): Map<JsonPathExpression, any> {
		return this.jsonPathStringsToExpectedValues;
	}

	setNumberOfKeysExpectedInJson(numberOfKeysExpected: number): Interaction {
		this.numberOfKeysExpectedInJson = numberOfKeysExpected;
		return this;
	}

	addJsonValueExpectation(
		expression: JsonPathExpression,
		value: RegExp | number | string
	): Interaction {
		this.jsonPathStringsToExpectedValues.set(expression, value);
		return this;
	}

	addStringAttributeExpectationForHorizonCreateAppealInteraction(
		attributeNumber: number,
		key: string,
		value: string
	): Interaction {
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

	addDateAttributeExpectationForHorizonCreateAppealInteraction(
		attributeNumber: number,
		key: string,
		value?: string
	): Interaction {
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

	addContactAttributeExpectationForHorizonCreateAppealInteraction(
		attributeNumber: number
	): Interaction {
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
		contactArrayAttributeNumber: number,
		attributeNumber: number,
		key: string,
		value: string
	): Interaction {
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
		contactArrayAttributeNumber: number,
		attributeNumber: number,
		key: string,
		value?: string
	): Interaction {
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
}
