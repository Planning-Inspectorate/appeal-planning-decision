import { JsonPathExpression } from '../json-path-expression';

export class Interaction {
	private description: string;
	private numberOfKeysExpectedInJson: number = 0;
	private jsonPathStringsToExpectedValues: Map<
		JsonPathExpression,
		RegExp | number | string | null
	> = new Map([]);

	constructor(description: string) {
		this.description = description;
	}

	toString(): string {
		let result = `Description: ${this.description}\n`;
		this.jsonPathStringsToExpectedValues.forEach((key, value) => {
			result += key + ': ' + value + '\n';
		});
		return result;
	}

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
		value: RegExp | number | string | null
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
