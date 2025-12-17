const logger = require('../lib/logger.js');

class HorizonMapper {
	/**
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @return {any}
	 */
	appealContactToCreateOrganisationRequest(appealContact) {
		logger.debug('Constructing create organisation request for Horizon');

		let result = this.#getCreateContactRequestJson('a:HorizonAPIOrganisation');

		const organisationName = appealContact.getOrganisationName();
		if (organisationName) {
			let sanitisedOrganisationName = this.#escapeXml(organisationName);
			logger.debug(`The organisation name is: '${sanitisedOrganisationName}'`);
			if (sanitisedOrganisationName) {
				result.AddContact.contact['a:Name'] = sanitisedOrganisationName;
			}
		}
		logger.debug(result, 'Create organisation request constructed');
		return result;
	}

	/**
	 *
	 * @param {AppealContactsValueObject} appealContactDetail
	 * @param {string} organisationHorizonId
	 * @returns {any} JSON that can be sent to Horizon to create the contact defined via the input parameters.
	 */
	createContactRequest(appealContactDetail, organisationHorizonId) {
		logger.debug('Constructing create contact request for Horizon');

		const contactName = appealContactDetail.getName();
		let firstName;
		let lastName;

		if (contactName) {
			let sanitisedContactName = this.#escapeXml(contactName);
			[firstName, ...lastName] = sanitisedContactName.split(' ');

			if (sanitisedContactName.split(' ').length <= 1) {
				firstName = ',';
				// eslint-disable-next-line prefer-destructuring
				lastName = sanitisedContactName.split(' ')[0];
			} else {
				// eslint-disable-next-line prefer-destructuring
				firstName = sanitisedContactName.split(' ')[0];
				lastName = lastName.join(' ');
			}
		}

		let requestBody = this.#getCreateContactRequestJson('a:HorizonAPIPerson');
		requestBody.AddContact.contact['a:Email'] = appealContactDetail.getEmail() || {
			'__i:nil': 'true'
		};
		requestBody.AddContact.contact['a:FirstName'] = firstName || '<Not provided>';
		requestBody.AddContact.contact['a:LastName'] = lastName || '<Not provided>';
		if (organisationHorizonId)
			requestBody.AddContact.contact['a:OrganisationID'] = organisationHorizonId;
		return requestBody;
	}

	/**
	 *
	 * @param {any} appeal
	 * @param {any} contactSubmissions JSON, structure should be {
	 * 	agent: BackOfficeAppealSubmissionEntity,
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * }
	 * @param {LpaEntity} lpaEntity
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @returns
	 */
	appealToHorizonCreateAppealRequest(appeal, contactSubmissions, lpaEntity, appealContactDetails) {
		// if no appeal type then default Householder Appeal Type (1001) - required as running HAS in parallel to Full Planning
		const appealTypeId = appeal.appealType == null ? '1001' : appeal.appealType;
		const decision = appeal.eligibility.applicationDecision;
		const typePlanningApplication = appeal.typeOfPlanningApplication;
		const caseworkReason = this.#getCaseworkReason(appealTypeId, decision, typePlanningApplication);
		logger.debug(`Case Work Reason ${caseworkReason}`);

		let attributes = this.#getAttributes(appealTypeId, appeal, caseworkReason);
		const contactAttributes = this.#getContactAttributes(contactSubmissions, appealContactDetails);
		attributes.push(...contactAttributes);

		// important: LPA code below refers to Horizon LPA code (i.e. W4705), not 'E' number (i.e. E60000068)
		const input = {
			CreateCase: {
				__soap_op: 'http://tempuri.org/IHorizon/CreateCase',
				__xmlns: 'http://tempuri.org/',
				caseType: this.#getAppealType(appealTypeId),
				LPACode: lpaEntity.getLpaCode(),
				dateOfReceipt: new Date(),
				location: lpaEntity.getCountry(),
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
		logger.debug('Creating document request');
		let documentTypeValue = 'Appellant Initial Documents';
		let documentGroupTypeValue = 'Initial Documents';
		const documentInvolvementValue = document.involvement;

		logger.debug(documentInvolvementValue);
		logger.debug(
			`Document horizon type: ${document?.horizon_document_type} and document group type: ${document?.horizon_document_group_type}`
		);

		if (document?.horizon_document_type && document?.horizon_document_group_type) {
			documentTypeValue = document.horizon_document_type;
			documentGroupTypeValue = document.horizon_document_group_type;
			delete document['horizon_document_type'];
			delete document['horizon_document_group_type'];
		}

		logger.debug(`Document name before sanitisation: ${document.name}`);
		let sanitisedDocumentName = this.#escapeXml(document.name);
		logger.debug(`Document name after sanitisation: ${sanitisedDocumentName}`);

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
							'a:Filename': sanitisedDocumentName,
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

	getAppealFromHorizon(caseReference) {
		const requestBody = {
			GetCase: {
				__soap_op: 'http://tempuri.org/IHorizon/GetCase',
				__xmlns: 'http://tempuri.org/',
				caseReference: caseReference
			}
		};
		return requestBody;
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

	/**
	 * @param {any} contactSubmissions JSON, structure should be {
	 * 	agent: BackOfficeAppealSubmissionEntity,
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * }
	 * @param {AppealContactsValueObject} appealContactDetails
	 */
	#getContactAttributes(contactSubmissions, appealContactDetails) {
		return Object.keys(contactSubmissions).map((contactType) => {
			const contactSubmission = contactSubmissions[contactType];
			return {
				key: 'Case Involvement:Case Involvement',
				value: [
					{
						key: 'Case Involvement:Case Involvement:ContactID',
						value: contactSubmission.getBackOfficeId()
					},
					{
						key: 'Case Involvement:Case Involvement:Contact Details',
						value:
							contactType == 'agent'
								? appealContactDetails.getAgent().getName()
								: appealContactDetails.getAppellant().getName()
					},
					{
						key: 'Case Involvement:Case Involvement:Involvement Start Date',
						value: new Date()
					},
					{
						key: 'Case Involvement:Case Involvement:Communication Preference',
						value: 'e-mail'
					},
					{
						key: 'Case Involvement:Case Involvement:Type Of Involvement',
						value: contactType == 'agent' ? 'Agent' : 'Appellant'
					}
				]
			};
		});
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

	#escapeXml(unsafeString) {
		return unsafeString.replace(/[<>&'"]/g, (c) => {
			switch (c) {
				case '<':
					return '&lt;';
				case '>':
					return '&gt;';
				case '&':
					return '&amp;';
				case "'":
					return '&apos;';
				case '"':
					return '&quot;';
			}
		});
	}
}

module.exports = { HorizonMapper };
