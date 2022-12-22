import { Interaction } from './interaction';
import { JsonPathExpression } from '../json-path-expression';
import { HorizonCreateOrganisationRequestBodyExpectation } from '../expectations/horizon/create-organisation-request-body';
import { HorizonCreateContactRequestBodyExpectation } from '../expectations/horizon/create-contact-request-body';
import { HorizonCreateAppealRequestBodyExpectation } from '../expectations/horizon/create-appeal-request-body';
import { HorizonCreateAppealContactExpectation } from '../expectations/horizon/create-appeal-contact';


export class HorizonInteraction {
    
    static getCreateOrganisationInteraction(expectation: HorizonCreateOrganisationRequestBodyExpectation): Interaction {
        return new Interaction() 
            .setNumberOfKeysExpectedInJson(expectation.getNumberOfJsonKeys())
            .addJsonValueExpectation(
                JsonPathExpression.create('$.AddContact.__soap_op'),
                'http://tempuri.org/IContacts/AddContact'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create('$.AddContact.__xmlns'),
                'http://tempuri.org/'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__xmlns:a']"),
                'http://schemas.datacontract.org/2004/07/Contacts.API'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__xmlns:i']"),
                'http://www.w3.org/2001/XMLSchema-instance'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__i:type']"),
                'a:HorizonAPIOrganisation'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create(`$.AddContact.contact['a:Name']`),
                expectation.getOrganisationName()
            )
        ;
    }

    static getCreateContactInteraction(expectation: HorizonCreateContactRequestBodyExpectation): Interaction {
        return new Interaction()
            .setNumberOfKeysExpectedInJson(expectation.getNumberOfJsonKeys())
            .addJsonValueExpectation(
                JsonPathExpression.create('$.AddContact.__soap_op'),
                'http://tempuri.org/IContacts/AddContact'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create('$.AddContact.__xmlns'),
                'http://tempuri.org/'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__xmlns:a']"),
                'http://schemas.datacontract.org/2004/07/Contacts.API'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__xmlns:i']"),
                'http://www.w3.org/2001/XMLSchema-instance'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['__i:type']"),
                'a:HorizonAPIPerson'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['a:Email']"),
                expectation.getEmail()
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['a:FirstName']"),
                expectation.getFirstName()
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.AddContact.contact['a:LastName']"),
                expectation.getLastName()
            )
            .addJsonValueExpectation(JsonPathExpression.create("$.AddContact.contact['a:OrganisationID']"), expectation.getOrganisationId())
    }

    static getCreateAppealInteraction(expectation: HorizonCreateAppealRequestBodyExpectation): Interaction {
        let interaction = new Interaction()
            .setNumberOfKeysExpectedInJson(expectation.getNumberOfJsonKeys())
            .addJsonValueExpectation(
                JsonPathExpression.create('$.CreateCase.__soap_op'),
                'http://tempuri.org/IHorizon/CreateCase'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create('$.CreateCase.__xmlns'),
                'http://tempuri.org/'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create('$.CreateCase.caseType'),
                expectation.getAppealType()
            )
            .addJsonValueExpectation(JsonPathExpression.create('$.CreateCase.LPACode'), expectation.getLpaCode())
            .addJsonValueExpectation(
                JsonPathExpression.create('$.CreateCase.dateOfReceipt'),
                new RegExp(`.+`)
            )
            .addJsonValueExpectation(JsonPathExpression.create('$.CreateCase.location'), expectation.getLpaCountry())
            .addJsonValueExpectation(
                JsonPathExpression.create("$.CreateCase.category['__xmlns:a']"),
                'http://schemas.datacontract.org/2004/07/Horizon.Business'
            )
            .addJsonValueExpectation(
                JsonPathExpression.create("$.CreateCase.category['__xmlns:i']"),
                'http://www.w3.org/2001/XMLSchema-instance'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                0,
                "Case:Casework Reason",
                expectation.getCaseworkReason()
            ) 
            .addDateAttributeExpectationForHorizonCreateAppealInteraction(
                1,
                "Case Dates:Receipt Date"
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                2,
                "Case:Source Indicator",
                'Other'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                3,
                "Case:Case Publish Flag",
                'No'
            )
            .addDateAttributeExpectationForHorizonCreateAppealInteraction(
                4,
                "Planning Application:Date Of LPA Decision",
                expectation.getDecisionDate().toISOString()
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                5,
                "Case:Procedure (Appellant)",
                expectation.getCaseProcedure()
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                6,
                "Planning Application:LPA Application Reference",
                '12345'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                7,
                "Case Site:Site Address Line 1",
                'Site Address 1'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                8,
                "Case Site:Site Address Line 2",
                'Site Address 2'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                9,
                "Case Site:Site Address Town",
                'Site Town'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                10,
                "Case Site:Site Address County",
                'Site County'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                11,
                "Case Site:Site Address Postcode",
                'SW1 1AA'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                12,
                "Case Site:Ownership Certificate",
                expectation.getOwnershipCertificate()
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                13,
                "Case Site:Site Viewable From Road",
                'No'
            )
            .addStringAttributeExpectationForHorizonCreateAppealInteraction(
                14,
                "Case Site:Inspector Need To Enter Site",
                'Yes'
            )
        ;

        expectation.getContacts().map((expectation: HorizonCreateAppealContactExpectation, index: number) => {
            const attributeIndex = 15 + index;
            interaction
                .addContactAttributeExpectationForHorizonCreateAppealInteraction(attributeIndex)
                .addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
                    attributeIndex,
                    0,
                    "Case Involvement:Case Involvement:ContactID",
                    expectation.getId()
                )
                .addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
                    attributeIndex,
                    1,
                    "Case Involvement:Case Involvement:Contact Details",
                    expectation.getFullName()
                )
                .addDateAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
                    attributeIndex,
                    2,
                    "Case Involvement:Case Involvement:Involvement Start Date"
                )
                .addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
                    attributeIndex,
                    3,
                    "Case Involvement:Case Involvement:Communication Preference",
                    'e-mail'
                )
                .addStringAttributeExpectationForContactArrayInHorizonCreateAppealInteraction(
                    attributeIndex,
                    4,
                    "Case Involvement:Case Involvement:Type Of Involvement",
                    expectation.getInvolvement()
                );
        });

        return interaction;
    }

    static getCreateDocumentInteraction(
		caseReference: number,
		document: any,
		validateDocumentGroupType: boolean
	): Interaction {

		const root = `$.AddDocuments`;
		const documentsWrapper = `${root}.documents`;
		const documentData = `${documentsWrapper}[2]['a:HorizonAPIDocument']`;
		const documentMetadata = `${documentData}['a:Metadata']['a:Attributes']`;

        let interaction = new Interaction()
            .setNumberOfKeysExpectedInJson(31)
            .addJsonValueExpectation(JsonPathExpression.create(`${root}['__soap_op']`), 'http://tempuri.org/IHorizon/AddDocuments')
            .addJsonValueExpectation(JsonPathExpression.create(`${root}['__xmlns']`), 'http://tempuri.org/')
            .addJsonValueExpectation(JsonPathExpression.create(`${root}.caseReference`), caseReference)
            .addJsonValueExpectation(JsonPathExpression.create(`${documentsWrapper}[0]['__xmlns:a']`), 'http://schemas.datacontract.org/2004/07/Horizon.Business')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentsWrapper}[1]['__xmlns:i']`), 'http://www.w3.org/2001/XMLSchema-instance')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentData}['a:Content']`), new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$')) // Base 64 encoded string
            .addJsonValueExpectation(JsonPathExpression.create(`${documentData}['a:DocumentType']`), /^\w|\s+$/) // Words and spaces
            .addJsonValueExpectation(JsonPathExpression.create(`${documentData}['a:Filename']`),document.name)
            .addJsonValueExpectation(JsonPathExpression.create(`${documentData}['a:IsPublished']`),'false')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentData}['a:NodeId']`),'0')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[0]['a:AttributeValue']['__i:type']`),'a:StringAttributeValue')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[0]['a:AttributeValue']['a:Name']`),'Document:Involvement')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[0]['a:AttributeValue']['a:Value']`), /^Appellant|LPA|$/) // The words "Appellant", "LPA", or an empty string
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[1]['a:AttributeValue']['__i:type']`), 'a:StringAttributeValue')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[1]['a:AttributeValue']['a:Name']`),'Document:Document Group Type')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[2]['a:AttributeValue']['__i:type']`),'a:StringAttributeValue')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[2]['a:AttributeValue']['a:Name']`),'Document:Incoming/Outgoing/Internal')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[2]['a:AttributeValue']['a:Value']`),'Incoming')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[3]['a:AttributeValue']['__i:type']`),'a:DateAttributeValue')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[3]['a:AttributeValue']['a:Name']`), 'Document:Received/Sent Date')
            .addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[3]['a:AttributeValue']['a:Value']`), /.+/) // ISO 8601 strings are apparently really hard to validate, so just check that we have something!
        
        if (validateDocumentGroupType) {
            // Values for this are likely to change, so just check that we have something
			interaction.addJsonValueExpectation(JsonPathExpression.create(`${documentMetadata}[1]['a:AttributeValue']['a:Value']`), /.+/);
		}

		return interaction;
	}
}