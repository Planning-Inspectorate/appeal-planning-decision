import { JsonPathExpression } from './json-path-expression';

export class Interaction {
	private numberOfKeysExpectedInJson: number = 0;
	private jsonPathStringsToExpectedValues: Map<JsonPathExpression, RegExp | number | string> =
		new Map([]);

	private base64EncodedStringRegex = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$');
	private wordsAndSpacesRegex = /^\w|\s+$/
	private theWordsAppellantOrLPAOrEmptyStringRegex = /^Appellant|LPA|$/;
	private anythingOneOrMoreTimesRegex = new RegExp('.+')

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

	addExpectationForHorizonCreateDocumentInteraction(
		caseReference: number,
		document: any,
		validateDocumentGroupType: boolean
	): Interaction {

		const root = `$.AddDocuments`;
		const documentsWrapper = `${root}.documents`;
		const documentData = `${documentsWrapper}[2]['a:HorizonAPIDocument']`;
		const documentMetadata = `${documentData}['a:Metadata']['a:Attributes']`;

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`${root}['__soap_op']`), 
			'http://tempuri.org/IHorizon/AddDocuments'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`${root}['__xmlns']`), 
			'http://tempuri.org/'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`${root}.caseReference`),
			caseReference
		)

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`${documentsWrapper}[0]['__xmlns:a']`),
			'http://schemas.datacontract.org/2004/07/Horizon.Business'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(`${documentsWrapper}[1]['__xmlns:i']`),
			'http://www.w3.org/2001/XMLSchema-instance'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentData}['a:Content']`
			),
			this.base64EncodedStringRegex
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentData}['a:DocumentType']`
			),
			this.wordsAndSpacesRegex
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentData}['a:Filename']`
			),
			document.name
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentData}['a:IsPublished']`
			),
			'false'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentData}['a:NodeId']`
			),
			'0'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[0]['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[0]['a:AttributeValue']['a:Name']`
			),
			'Document:Involvement'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[0]['a:AttributeValue']['a:Value']`
			),
			this.theWordsAppellantOrLPAOrEmptyStringRegex
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[1]['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[1]['a:AttributeValue']['a:Name']`
			),
			'Document:Document Group Type'
		);

		if (validateDocumentGroupType) {
			this.jsonPathStringsToExpectedValues.set(
				JsonPathExpression.create(
					`${documentMetadata}[1]['a:AttributeValue']['a:Value']`
				),
				this.wordsAndSpacesRegex
			);
		}

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[2]['a:AttributeValue']['__i:type']`
			),
			'a:StringAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[2]['a:AttributeValue']['a:Name']`
			),
			'Document:Incoming/Outgoing/Internal'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[2]['a:AttributeValue']['a:Value']`
			),
			'Incoming'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[3]['a:AttributeValue']['__i:type']`
			),
			'a:DateAttributeValue'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[3]['a:AttributeValue']['a:Name']`
			),
			'Document:Received/Sent Date'
		);

		this.jsonPathStringsToExpectedValues.set(
			JsonPathExpression.create(
				`${documentMetadata}[3]['a:AttributeValue']['a:Value']`
			),
			this.anythingOneOrMoreTimesRegex // ISO 8601 strings are apparently really hard to validate, so just check that we have something!
		);

		return this;
	}
}
