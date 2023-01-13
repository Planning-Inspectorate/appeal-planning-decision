const logger = require('../lib/logger');

// TODO: Make the method names consistent, something like "create...Requests()"?
class HorizonMapper {

	/**
	 * @param {OrganisationNamesValueObject} organisationNamesValueObject
	 * @return {any} Structure is:
	 * {
	 *  originalApplicant: <request JSON>,
	 *  agent: <request JSON> // optional: only if an agent organisation name is specified in input
	 * }
	 * 
	 * The values for `originalApplicant` and `agent` may be null if no organisation name is specified
	 * for either.
	 */
	appealToCreateOrganisationRequests(organisationNamesValueObject) {
		logger.debug('Constructing create organisation requests for Horizon');

		let result = {
			originalApplicant: null,
			agent: null
		};

		const appellantOrganisationName = organisationNamesValueObject.getAppellantOrganisationName();
		logger.debug(`The appellant organisation name is: '${appellantOrganisationName}'`);
		if (appellantOrganisationName) {
			result.originalApplicant = this.#getCreateContactRequestJson('a:HorizonAPIOrganisation')
			result.originalApplicant.AddContact.contact['a:Name'] = appellantOrganisationName
		}
		
		const agentOrganisationName = organisationNamesValueObject.getAgentOrganisationName();
		logger.debug(`The agent organisation name is: '${appellantOrganisationName}'`);
		if (agentOrganisationName) {
			result.agent = this.#getCreateContactRequestJson('a:HorizonAPIOrganisation')
			result.agent.AddContact.contact['a:Name'] = agentOrganisationName	
		}

		logger.debug(result, 'Create organisation requests constructed');
		return result;
	}

	/**
	 *
	 * @param {*} appeal
	 * @param {*} organisations Structure expected is:
	 * {
	 *  originalApplicant: { value: '<original-applicant-organisation-id-in-horizon>' },
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
	createContactRequests(appeal, organisations) {
		logger.debug('Constructing create contact requests for Horizon');

		let contacts = [];
		let appellant = {
			type: 'Appellant',
			organisationId: organisations.originalApplicant
		};
		let agent;

		const appealIsAFullAppeal = appeal.appealType == '1005';

		if (appealIsAFullAppeal) {
			appellant.name = appeal.contactDetailsSection.contact.name;
		} else {
			appellant.name = appeal.aboutYouSection.yourDetails.name;
		}

		const anAgentIsAppealingOnBehalfOfAnAppellant = appealIsAFullAppeal
			? !appeal.contactDetailsSection.isOriginalApplicant
			: !appeal.aboutYouSection.yourDetails.isOriginalApplicant;

		if (anAgentIsAppealingOnBehalfOfAnAppellant) {
			agent = {
				type: 'Agent',
				email: appeal.email,
				organisationId: organisations.agent
			};
			if (appealIsAFullAppeal) {
				agent.name = appeal.contactDetailsSection.contact.name;
				appellant.name = appeal.contactDetailsSection.appealingOnBehalfOf.name;
			} else {
				agent.name = appeal.aboutYouSection.yourDetails.name;
				appellant.name = appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;
			}
		} else {
			appellant.email = appeal.email;
		}

		// appellant must be before agent in contacts array
		contacts.push(appellant);
		if (anAgentIsAppealingOnBehalfOfAnAppellant) {
			contacts.push(agent);
		}

		logger.debug(contacts, `Contacts to map into Horizon request`);

		return contacts.map((contact) => {
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

			let requestBody = this.#getCreateContactRequestJson('a:HorizonAPIPerson');
			requestBody.AddContact.contact['a:Email'] = contact?.email || { '__i:nil': 'true' };
			requestBody.AddContact.contact['a:FirstName'] = firstName || '<Not provided>';
			requestBody.AddContact.contact['a:LastName'] = lastName || '<Not provided>';
			requestBody.AddContact.contact['a:OrganisationID'] = contact.organisationId;

			return {
				name: contact.name,
				type: contact.type,
				requestBody: requestBody
			};
		});
	}

	appealToHorizonCreateAppealRequest(appeal, contacts, appealCountry, horizonLpaCode) {
		// if no appeal type then default Householder Appeal Type (1001) - required as running HAS in parallel to Full Planning
		const appealTypeId = appeal.appealType == null ? '1001' : appeal.appealType;
		const decision = appeal.eligibility.applicationDecision;
		const typePlanningApplication = appeal.typeOfPlanningApplication;
		const caseworkReason = this.#getCaseworkReason(appealTypeId, decision, typePlanningApplication);
		logger.debug(`Case Work Reason ${caseworkReason}`);

		let attributes = this.#getAttributes(appealTypeId, appeal, caseworkReason);
		attributes.push(...contacts);

		// important: LPA code below refers to Horizon LPA code (i.e. W4705), not 'E' number (i.e. E60000068)
		const input = {
			CreateCase: {
				__soap_op: 'http://tempuri.org/IHorizon/CreateCase',
				__xmlns: 'http://tempuri.org/',
				caseType: this.#getAppealType(appealTypeId),
				LPACode: horizonLpaCode,
				dateOfReceipt: new Date(),
				location: appealCountry,
				category: {
					'__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
					'__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
					'a:Attributes': attributes.map(({ key, value }) => this.#convertToSoapKVPair(key, value))
				}
			}
		};

		logger.debug(input, 'Horizon create appeal request');
		return input;
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
		let documentTypeValue = 'Appellant Initial Documents';
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
				documents: [
					//TODO: this looks like an array, can we do a batch upload instead?
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

	#getCreateContactRequestJson(type) {
		return {
			AddContact: {
				__soap_op: 'http://tempuri.org/IContacts/AddContact',
				__xmlns: 'http://tempuri.org/',
				contact: {
					'__xmlns:a': 'http://schemas.datacontract.org/2004/07/Contacts.API',
					'__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
					'__i:type': type
				}
			}
		};
	}

	// TODO: this could be refactored so its easier to understand by coding it in a way that says:
	//       "I should return casework reason 1 if the following applies, I should return casework
	//       2 if the following applies..." etc. Then, the casework reason is defined once, so there
	//       is less chance of an issue with casework values being incorrect.
	#getCaseworkReason(appealTypeID, decision, typePlanningApplication) {
		// NOTE: This information needs to be correct so, to reduce the risk of human error
		//       (misspelling across instances, missing an instance when updating a reason, etc.),
		//       this method implemented so that casework reasons are only defined once. It also
		//       makes the logic much easier to code and understand too since we're able to discount
		//       appeal types for the first 3 reasons approaching the logic in this way.
		if (
			decision == 'refused' &&
			((appealTypeID == '1001' && typePlanningApplication == 'householder-planning') ||
				(appealTypeID == '1005' && typePlanningApplication == 'full-appeal'))
		) {
			return '1. Refused planning permission for the development';
		}

		if (decision == 'refused' && typePlanningApplication == 'removal-or-variation-of-conditions') {
			return '2. Refused permission to vary or remove a condition(s)';
		}

		if (decision == 'refused' && typePlanningApplication == 'prior-approval') {
			return '3. Refused prior approval of permitted development rights';
		}

		if (appealTypeID == '1005') {
			if (
				decision == 'granted' &&
				(typePlanningApplication == 'householder-planning' ||
					typePlanningApplication == 'full-appeal' ||
					typePlanningApplication == 'prior-approval')
			) {
				return '4. Granted planning permission for the development subject to conditions to which you object';
			}

			if (
				decision == 'refused' &&
				(typePlanningApplication == 'outline-planning' ||
					typePlanningApplication == 'reserved-matters')
			) {
				return '5. Refused approval of the matters reserved under an outline planning permission';
			}

			if (
				decision == 'granted' &&
				(typePlanningApplication == 'outline-planning' ||
					typePlanningApplication == 'reserved-matters' ||
					typePlanningApplication == 'removal-or-variation-of-conditions')
			) {
				return '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
			}

			// TODO: There is no 7 (spoon) ¯\_(ツ)_/¯ Is this correct?!

			if (
				decision == 'nodecisionreceived' &&
				(typePlanningApplication == 'householder-planning' ||
					typePlanningApplication == 'full-appeal' ||
					typePlanningApplication == 'outline-planning' ||
					typePlanningApplication == 'prior-approval' ||
					typePlanningApplication == 'reserved-matters' ||
					typePlanningApplication == 'removal-or-variation-of-conditions')
			) {
				return '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
			}
		}
	}

	#getAppealType(appealTypeId) {
		if (appealTypeId == '1001') return 'Householder (HAS) Appeal';
		else if (appealTypeId == '1005') return 'Planning Appeal (W)';
		else return '';
	}

	#getAttributes(appealTypeId, appeal, caseworkReason) {
		let caseProcedureAppellantValue = null;
		let caseSiteOwnershipCertificateValue = null;
		let caseSiteViewableFromRoadValue = null;
		let caseSiteInspectorNeedsToEnterSiteValue = null;

		if (appealTypeId == '1001') {
			caseProcedureAppellantValue = 'Written Representations';
			caseSiteOwnershipCertificateValue = appeal.appealSiteSection.siteOwnership.ownsWholeSite;
			caseSiteViewableFromRoadValue =
				appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad;
			caseSiteInspectorNeedsToEnterSiteValue = !caseSiteViewableFromRoadValue;
		} else if (appealTypeId == '1005') {
			caseProcedureAppellantValue = appeal.appealDecisionSection.procedureType;
			caseSiteOwnershipCertificateValue = appeal.appealSiteSection.siteOwnership.ownsAllTheLand;
			caseSiteViewableFromRoadValue = appeal.appealSiteSection.visibleFromRoad.isVisible;
			caseSiteInspectorNeedsToEnterSiteValue = !caseSiteViewableFromRoadValue;
		} else {
			return [];
		}

		return [
			{
				key: 'Case:Casework Reason',
				value: caseworkReason
			},
			{
				key: 'Case Dates:Receipt Date',
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
				value: caseProcedureAppellantValue
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
				value: caseSiteOwnershipCertificateValue ? 'Certificate A' : null
			},
			{
				key: 'Case Site:Site Viewable From Road',
				value: caseSiteViewableFromRoadValue
			},
			{
				key: 'Case Site:Inspector Need To Enter Site',
				value: caseSiteInspectorNeedsToEnterSiteValue
			}
		];
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

module.exports = { HorizonMapper };
