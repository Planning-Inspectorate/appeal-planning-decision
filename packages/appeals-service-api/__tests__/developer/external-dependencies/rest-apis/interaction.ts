import { JsonPathExpression } from './json-path-expression';

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
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['a:Value']`
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
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].value.['a:Value']`
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
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].['a:AttributeValue'].['__i:type']`
			),
			'a:SetAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${attributeNumber}].['a:AttributeValue'].['a:Name']`
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
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].__i:type`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].['a:Value']`
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
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].['a:Name']`
			),
			key
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.CreateContact.category.['a:Attributes'][${contactArrayAttributeNumber}].['a:AttributeValue'].['a:Values'][${attributeNumber}].['a:Value']`
			),
			value ? value : RegExp('.+')
		);

		return this;
	}

	addExpectationForHorizonCreateDocumentInteraction(
		documentNumber: number,
		document: any,
		validateDocumentGroupType: boolean
	): Interaction {
		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`$.AddDocuments.documents[${documentNumber}].['__xmlns:a']`),
			'http://schemas.datacontract.org/2004/07/Horizon.Business'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`$.AddDocuments.documents[${documentNumber}].['__xmlns:i']`),
			'http://www.w3.org/2001/XMLSchema-instance'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Content]`
			),
			document.data
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:DocumentType]`
			),
			document.document_type
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Filename]`
			),
			document.filename
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:IsPublished]`
			),
			'false'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][0].['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][0].['a:AttributeValue']['a:Name']`
			),
			'Document:Involvement'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][0].['a:AttributeValue']['a:Value']`
			),
			document.involvement
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][1].['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][1].['a:AttributeValue']['a:Name']`
			),
			'Document:Document Group Type'
		);

		if (validateDocumentGroupType) {
			this.jsonPathStringsToExpectedValues.set(
				JsonPathExpression.create(
					`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][1].['a:AttributeValue']['a:Value']`
				),
				document.document_group_type
			);
		}

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['a:Name']`
			),
			'Document:Incoming/Outgoing/Internal'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['a:Value']`
			),
			'Incoming'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['a:Name']`
			),
			'Document:Received/Sent Date'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`$.AddDocuments.documents[${documentNumber}].[''a:HorizonAPIDocument'].['a:Metadata].['Attributes][2].['a:AttributeValue']['a:Value']`
			),
			document.uploadDate
		);

		return this;
	}
}
