const logger = require('../lib/logger');
class HorizonMapper {

    /**
     * @return {any} Structure is:
     * { 
     *  appellant: { value: {} },
     *  agent: { value: {} } // optional
     * }
     */
    appealToCreateOrganisationRequests(appeal){
        let organisations = { appellant: { value: {'__i:nil': 'true'} } };

        const appealTypeID = appeal.appealType == null ? '1001' : appeal.appealType;
	    if (appealTypeID == '1005') {
            organisations.appellant.value = {
                AddContact: {
                    __soap_op: 'http://tempuri.org/IContacts/AddContact',
                    __xmlns: 'http://tempuri.org/',
                    contact: {
                        '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
                        '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
                        '__i:type': 'a:HorizonAPIOrganisation',
                        'a:Name': appeal.contactDetailsSection.contact.companyName
                    }
                }
            }

			if (!appeal.contactDetailsSection.isOriginalApplicant) {	
				organisations.agent.value = {
                    AddContact: {
                        __soap_op: 'http://tempuri.org/IContacts/AddContact',
                        __xmlns: 'http://tempuri.org/',
                        contact: {
                            '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
                            '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
                            '__i:type': 'a:HorizonAPIOrganisation',
                            'a:Name': appeal.contactDetailsSection.appealingOnBehalfOf.companyName
                        }
                    }
                }
			}
		}
        
        return organisations;
    }

    /**
     * 
     * @param {*} appeal 
     * @param {*} organisations Structure expected is:
     * { 
     *  appellant: { value: '<appellant-organisation-id-in-horizon>' },
     *  agent: { value: '<agent-organisation-id-in-horizon> } // optional: only if the appeal references an agent.
     * }
     * @returns JSON with structure:
     * [
     *  { 
     *      name: '',
     *      type: '',
     *      requestBody: {}
     *  }
     */
    createContactRequests(appeal, organisations){

	    const appealTypeID = appeal.appealType == null ? '1001' : appeal.appealType;

        let contacts = []
	    if (appealTypeID == '1001') {
			if (appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
				/* User is original applicant - just add appellant */
				contacts.push({
					type: 'Appellant',
					email: appeal.email,
					name: appeal.aboutYouSection.yourDetails.name,
                    organisationId: organisations.appellant
				});
			} else {
				/* User is agent - add both agent and OP */
				contacts.push(
					{
						type: 'Agent',
						email: appeal.email,
						name: appeal.aboutYouSection.yourDetails.name,
                        organisationId: organisations.agent
					},
					{
						/* Email not collected here */
						type: 'Appellant',
						name: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
                        organisationId: organisations.appellant
					}
				);
			}
		} else if (appealTypeID == '1005') {
			if (appeal.contactDetailsSection.isOriginalApplicant) {
				/* User is original applicant - just add appellant */
				contacts.push({
					type: 'Appellant',
					email: appeal.email,
					name: appeal.contactDetailsSection.contact.name,
                    organisationId: organisations.appellant
				});
			} else {
				/* User is agent - add both agent and OP */
				contacts.push(
					{
						type: 'Agent',
						email: appeal.email,
						name: appeal.contactDetailsSection.contact.name,
                        organisationId: organisations.agent
					},
					{
						/* Email not collected here */
						type: 'Appellant',
						name: appeal.contactDetailsSection.appealingOnBehalfOf.name,
                        organisationId: organisations.appellant
					}
				);
			}
		}

        return contacts.map(contact => {

            let [firstName, ...lastName] = contact.name.split(' ');

			if (contact.name.split(' ').length <= 1) {
				firstName = ',';
				// eslint-disable-next-line prefer-destructuring
				lastName = contact.name.split(' ')[0];
			} else {
				// eslint-disable-next-line prefer-destructuring
				firstName = contact.name.split(' ')[0];
				lastName = lastName.join(' ');
			}

            return {
                name: contact.name,
                type: contact.type,
                requestBody: {
                    AddContact: {
                        __soap_op: 'http://tempuri.org/IContacts/AddContact',
                        __xmlns: 'http://tempuri.org/',
                        contact: {
                            '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
                            '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
                            '__i:type': 'a:HorizonAPIPerson',
                            'a:Email': contact?.email || { "__i:nil": "true" },
                            'a:FirstName': firstName || '<Not provided>',
                            'a:LastName': lastName || '<Not provided>',
                            'a:OrganisationID': contact.organisationId
                        }
                    }
                }
            }
        });
	}

    async appealToHorizonCreateAppealRequest(appeal, contacts, lpa){

		 logger.debug({ lpa }, 'LPA detail');
 
		 let locationValue;
		 /* PINS only supports England and Wales */
		 if (lpa.england) {
            locationValue = 'England';
		 } else if (lpa.wales) {
            locationValue = 'Wales';
		 } else {
			 throw new Error('LPA neither English nor Welsh');
		 }

        // if no appeal type then default Householder Appeal Type (1001) - required as running HAS in parallel to Full Planning
        const appealTypeId = appeal.appealType == null ? '1001' : appeal.appealType;
        const decision = appeal.eligibility.applicationDecision;
        const typePlanningApplication = appeal.typeOfPlanningApplication;
        logger.debug({ appealTypeId }, 'Appeal Type');
        logger.debug({ decision }, 'Application Decision');
        logger.debug({ typePlanningApplication }, 'Planning Application Type');
        
        const caseworkReason = this.#getCaseworkReason(appealTypeId, decision, typePlanningApplication);
		logger.debug({ caseworkReason }, 'Case Work Reason');
 
		let attributes = this.#getAttributes(appealTypeId, appeal, caseworkReason);
		attributes.push(...(contacts));

        const input = {
            CreateCase: {
                __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
                __xmlns: 'http://tempuri.org/',
                caseType: this.#getAppealType(appealTypeId),
                LPACode: appeal.lpaCode,
                dateOfReceipt: new Date(),
                location: locationValue,
                category: {
                    '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
                    '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
                    'a:Attributes': attributes.map(({ key, value }) =>
                        this.#convertToSoapKVPair(key, value)
                    )
                }
            }
        };

        logger.debug('Horizon input', input);
    }

    toCreateDocumentRequest(document, caseReference) {
        // TODO: I don't think we need these two lines since, in the original version, there's
        //      these properties never exist on `body` :/
        
        // const documentInvolvementName = body.documentInvolvement || 'Document:Involvement';
        // const documentGroupTypeName = body.documentGroupType || 'Document:Document Group Type';

        /**
         * TODO: When the AS-5031 feature flag is removed remove the if statement
         * and the lines above it below
         *
         * We're using a check on these values being truthy here to prevent misalignment
         * on feature flag settings between apps. Since we cache feature flag configs,
         * we should try to only use the flag in one app so that we don't have two caches
         * in two apps, which can cause obvious issues! So, the `horizon_document_type`
         * and `horizon_document_group_type` on `documentData` below should only be set
         * if the AS-5031 feature flag is on :) By doing this check we avoid the need to
         * do a feature flag check across two separate services! If they're not set, we
         * fall back to the way the `documentTypeValue` and `documentGroupTypeValue` values
         * were set previously!
         *
         * Also note that we have to remove those fields from `documentData` since, if we don't,
         * they're included in the `a:Content` node below, and this causes Horizon to not upload
         * the document since the schema isn't correct ¯\_(ツ)_/¯ (it was like this before we got
         * here)
         */
        let documentTypeValue = 'Appellant Initial Documents'
        let documentGroupTypeValue = 'Initial Documents';
        const documentInvolvementValue = document.involvement;

        if (document?.horizon_document_type && document?.horizon_document_group_type) {
            documentTypeValue = document.horizon_document_type;
            documentGroupTypeValue = document.horizon_document_group_type;
            delete document['horizon_document_type'];
            delete document['horizon_document_group_type'];
        }

        return {
            AddDocuments: {
                __soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
                __xmlns: 'http://tempuri.org/',
                caseReference: caseReference,
                documents: [ //TODO: this looks like an array, can we do a batch upload instead?
                    { '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
                    { '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
                    {
                        // The order of this object is important
                        'a:HorizonAPIDocument': {
                            'a:Content': document.data,
                            'a:DocumentType': documentTypeValue,
                            'a:Filename': document.name,
                            'a:IsPublished': 'false',
                            'a:Metadata': {
                                'a:Attributes': [
                                    {
                                        'a:AttributeValue': {
                                            '__i:type': 'a:StringAttributeValue',
                                            'a:Name': 'Document:Involvement',
                                            'a:Value': documentInvolvementValue
                                        }
                                    },
                                    {
                                        'a:AttributeValue': {
                                            '__i:type': 'a:StringAttributeValue',
                                            'a:Name': 'Document:Document Group Type',
                                            'a:Value': documentGroupTypeValue
                                        }
                                    },
                                    {
                                        'a:AttributeValue': {
                                            '__i:type': 'a:StringAttributeValue',
                                            'a:Name': 'Document:Incoming/Outgoing/Internal',
                                            'a:Value': 'Incoming'
                                        }
                                    },
                                    {
                                        'a:AttributeValue': {
                                            '__i:type': 'a:DateAttributeValue',
                                            'a:Name': 'Document:Received/Sent Date',
                                            'a:Value': document?.upload_date
                                        }
                                    }
                                ]
                            },
                            'a:NodeId': '0'
                        }
                    }
                ]
            }
        };
    }

    // TODO: this could be refactored so its easier to understand by coding it in a way that says:
    //       "I should return casework reason 1 if the following applies, I should return casework 
    //       2 if the following applies..." etc. Then, the casework reason is defined once, so there
    //       is less chance of an issue with casework values being incorrect.
    #getCaseworkReason(appealTypeID, decision, typePlanningApplication) {

        // TODO: in this case, no matter what the appeal type is, if you were refused a householder planning or full appeal, return 1.
        if (
            (appealTypeID == '1001' && decision == 'refused' && typePlanningApplication == 'householder-planning') ||
            (appealTypeID == '1005' && decision == 'refused' && typePlanningApplication == 'full-appeal')
        ) { 
            return '1. Refused planning permission for the development'
        }

        // TODO: in this case, no matter what the appeal type is, if you were refused a removal-or-variation-of-conditions, return 2.
        if (
            (appealTypeID == '1001' && decision == 'refused' && typePlanningApplication == 'removal-or-variation-of-conditions') ||
            (appealTypeID == '1005' && decision == 'refused' && typePlanningApplication == 'removal-or-variation-of-conditions')
        ) { 
            return '2. Refused permission to vary or remove a condition(s)'
        }

        // TODO: in this case, no matter what the appeal type is, if you were refused a prior-approval, return 3.
        if (
            (appealTypeID == '1001' && decision == 'refused' && typePlanningApplication == 'prior-approval') ||
            (appealTypeID == '1005' && decision == 'refused' && typePlanningApplication == 'prior-approval')
        ) {
            return '3. Refused prior approval of permitted development rights'
        }

        // TODO: a single check on appealType and decision, and then ORs on application type
        if (
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'householder-planning') ||
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'full-appeal') ||
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'prior-approval')
        ){
            return '4. Granted planning permission for the development subject to conditions to which you object'
        }
        
        // TODO: a single check on appealType and decision, and then ORs on application type
        if (
            (appealTypeID == '1005' && decision == 'refused' && typePlanningApplication == 'outline-planning') ||
            (appealTypeID == '1005' && decision == 'refused' && typePlanningApplication == 'reserved-matters')
        ) { 
            return '5. Refused approval of the matters reserved under an outline planning permission'
        }

        // TODO: a single check on appealType and decision, and then ORs on application type
        if (
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'outline-planning') ||
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'reserved-matters') ||
            (appealTypeID == '1005' && decision == 'granted' && typePlanningApplication == 'removal-or-variation-of-conditions')
        ) { 
            return '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object'
        }

        // TODO: There is no 7 (spoon) ¯\_(ツ)_/¯ Is this correct?!
        
        // TODO: a single check on appealType and decision, and then ORs on application type
        if (
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'householder-planning') ||
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'full-appeal') ||
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'outline-planning') ||
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'prior-approval') ||
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'reserved-matters') ||
            (appealTypeID == '1005' && decision == 'nodecisionreceived' && typePlanningApplication == 'removal-or-variation-of-conditions')
        ) {
            return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval'
        }
 
		//  switch (appealTypeID) {
        //     case '1001': {
        //         // Householder (HAS) Appeal
        //         if (decision === 'refused') {
        //             if (typePlanningApplication === 'householder-planning') {
        //                 return '1. Refused planning permission for the development';
        //             } else if (typePlanningApplication === 'removal-or-variation-of-conditions') {
        //                 return '2. Refused permission to vary or remove a condition(s)';
        //             } else if (typePlanningApplication === 'prior-approval') {
        //                 return '3. Refused prior approval of permitted development rights';
        //             }
        //         }

        //         break;
        //     }

        //     case '1005': {
        //         // Full Planning Appeal
        //         switch (typePlanningApplication) {
        //             case 'householder-planning': {
        //                 if (decision === 'granted') {
        //                     return '4. Granted planning permission for the development subject to conditions to which you object';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             case 'full-appeal': {
        //                 if (decision === 'granted') {
        //                     return '4. Granted planning permission for the development subject to conditions to which you object';
        //                 } else if (decision === 'refused') {
        //                     return '1. Refused planning permission for the development';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             case 'outline-planning': {
        //                 if (decision === 'granted') {
        //                     return '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
        //                 } else if (decision === 'refused') {
        //                     return '5. Refused approval of the matters reserved under an outline planning permission';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             case 'prior-approval': {
        //                 if (decision === 'granted') {
        //                     return '4. Granted planning permission for the development subject to conditions to which you object';
        //                 } else if (decision === 'refused') {
        //                     return '3. Refused prior approval of permitted development rights';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             case 'reserved-matters': {
        //                 if (decision === 'granted') {
        //                     return '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
        //                 } else if (decision === 'refused') {
        //                     return '5. Refused approval of the matters reserved under an outline planning permission';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             case 'removal-or-variation-of-conditions': {
        //                 if (decision === 'granted') {
        //                     return '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
        //                 } else if (decision === 'refused') {
        //                     return '2. Refused permission to vary or remove a condition(s)';
        //                 } else if (decision === 'nodecisionreceived') {
        //                     return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
        //                 }

        //                 break;
        //             }

        //             default: {
        //                 break;
        //             }
        //         }

        //         break;
        //     }
 
        //     default: {
        //         break;
        //     }
        // }

        return null;
    }

    #getAppealType(appealTypeId){
         if (appealTypeId == '1001') return 'Householder (HAS) Appeal'
         else if (appealTypeId == '1005') return 'Planning Appeal (W)'
         else return '';
    }

    #getAttributes(appealTypeId, appeal, caseworkReason){
        if (appealTypeId == '1001') {
            return [
                {
                    key: 'Case:Casework Reason',
                    // This is the last time the record was updated
                    value: caseworkReason
                },
                {
                    key: 'Case Dates:Receipt Date',
                    // This is the last time the record was updated
                    value: new Date(appeal.updatedAt)
                },
                {
                    key: 'Case:Source Indicator',
                    value: 'Other'
                },
                {
                    key: 'Case:Case Publish Flag',
                    value: false
                },
                {
                    key: 'Planning Application:Date Of LPA Decision',
                    value: new Date(appeal.decisionDate)
                },
                {
                    key: 'Case:Procedure (Appellant)',
                    value: 'Written Representations'
                },
                {
                    key: 'Planning Application:LPA Application Reference',
                    value: appeal.planningApplicationNumber
                },
                {
                    key: 'Case Site:Site Address Line 1',
                    value: appeal.appealSiteSection.siteAddress.addressLine1
                },
                {
                    key: 'Case Site:Site Address Line 2',
                    value: appeal.appealSiteSection.siteAddress.addressLine2
                },
                {
                    key: 'Case Site:Site Address Town',
                    value: appeal.appealSiteSection.siteAddress.town
                },
                {
                    key: 'Case Site:Site Address County',
                    value: appeal.appealSiteSection.siteAddress.county
                },
                {
                    key: 'Case Site:Site Address Postcode',
                    value: appeal.appealSiteSection.siteAddress.postcode
                },
                {
                    key: 'Case Site:Ownership Certificate',
                    value: appeal.appealSiteSection.siteOwnership.ownsWholeSite
                        ? 'Certificate A'
                        : null
                },
                {
                    key: 'Case Site:Site Viewable From Road',
                    value: appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
                },
                {
                    key: 'Case Site:Inspector Need To Enter Site',
                    value: !appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
                }
            ];
        } else if (appealTypeId == '1005') {
            return [
                {
                    key: 'Case Dates:Receipt Date',
                    // This is the last time the record was updated
                    value: new Date(appeal.updatedAt)
                },
                {
                    key: 'Case:Source Indicator',
                    value: 'Other'
                },
                {
                    key: 'Case:Case Publish Flag',
                    value: false
                },
                {
                    key: 'Planning Application:Date Of LPA Decision',
                    value: new Date(appeal.decisionDate)
                },
                {
                    key: 'Case:Procedure (Appellant)',
                    value: appeal.appealDecisionSection.procedureType
                },
                {
                    key: 'Planning Application:LPA Application Reference',
                    value: appeal.planningApplicationDocumentsSection.applicationNumber
                },
                {
                    key: 'Case Site:Site Address Line 1',
                    value: appeal.appealSiteSection.siteAddress.addressLine1
                },
                {
                    key: 'Case Site:Site Address Line 2',
                    value: appeal.appealSiteSection.siteAddress.addressLine2
                },
                {
                    key: 'Case Site:Site Address Town',
                    value: appeal.appealSiteSection.siteAddress.town
                },
                {
                    key: 'Case Site:Site Address County',
                    value: appeal.appealSiteSection.siteAddress.county
                },
                {
                    key: 'Case Site:Site Address Postcode',
                    value: appeal.appealSiteSection.siteAddress.postcode
                },
                {
                    key: 'Case Site:Ownership Certificate',
                    value: appeal.appealSiteSection.siteOwnership.ownsAllTheLand
                        ? 'Certificate A'
                        : null
                },
                {
                    key: 'Case Site:Site Viewable From Road',
                    value: appeal.appealSiteSection.visibleFromRoad.isVisible
                }
                // {
                //   key: 'Case Site:Inspector Need To Enter Site',
                //   value: !appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
                // },
            ];
        }

        else {
            return [];
        }
    }

    #convertToSoapKVPair(key, value) {
        logger.debug(
            {
                key,
                value
            },
            'Parsing soap key/value pair'
        );
    
        if (Array.isArray(value)) {
            logger.debug('Parsing as array');
            return {
                'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': key,
                    'a:Values': value.map((item) => this.#convertToSoapKVPair(item.key, item.value))
                }
            };
        }
    
        if (value == null) {
            logger.debug('Parsing as null');
            return {
                'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': key,
                    'a:Value': null
                }
            };
        }
    
        if (value.toISOString) {
            /* Value is a date */
            logger.debug('Parsing as date');
            return {
                'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': key,
                    'a:Value': value.toISOString()
                }
            };
        }
    
        let cleanValue = value;
    
        /* Check for booleans - convert to "Yes" or "No" */
        if (cleanValue === true) {
            cleanValue = 'Yes';
        } else if (cleanValue === false) {
            cleanValue = 'No';
        }
    
        /* Everything else is a string */
        logger.debug('Parsing as string');
        return {
            'a:AttributeValue': {
                '__i:type': 'a:StringAttributeValue',
                'a:Name': key,
                'a:Value': `${cleanValue}` // Ensure value a string
            }
        };
    }
}

module.exports = { HorizonMapper }