const axios = require('axios');
const config = require('./src/config');
const { handlerReply } = require('./handler-reply');
const { convertToSoapKVPair } = require('./src/convertToSoapKVPair');
const { callHorizon } = require('./src/callHorizon');
const { createContacts } = require('./src/createContacts');
const { getLpaData } = require('./src/getLpaData');
const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');
const uploadedDocumentMapper = require('./uploadedDocumentMapper');

module.exports = async (context, appeal) => {
	if (!appeal || Object.keys(appeal).length == 0) return handlerReply(context, appeal);
	context.log('Received householder appeal publish request', appeal);

	try {
		const { _id: appealId } = appeal;

		context.log('JSON information');
		context.log(JSON.stringify(appeal));

		/* Get the LPA associated with this appeal */
		const lpa = await getLpaData(context.log, appeal.lpaCode);

		context.log({ lpa }, 'LPA detail');

		let location;
		/* PINS only supports England and Wales */
		if (lpa.england) {
			location = 'England';
		} else if (lpa.wales) {
			location = 'Wales';
		} else {
			throw new Error('LPA neither English nor Welsh');
		}

		// if no appeal type then default Householder Appeal Type (1001) - required as running HAS in parallel to Full Planning
		const appealTypeID = appeal.appealType == null ? '1001' : appeal.appealType;

		context.log({ appealTypeID }, 'Appeal Type');

		// Case:Casework Reason logic
		const decision = appeal.eligibility.applicationDecision;
		const typePlanningApplication = appeal.typeOfPlanningApplication;

		context.log({ decision }, 'Application Decision');
		context.log({ typePlanningApplication }, 'Planning Application Type');

		let caseworkReason;

		switch (appealTypeID) {
			case '1001': {
				// Householder (HAS) Appeal
				if (decision === 'refused') {
					if (typePlanningApplication === 'householder-planning') {
						caseworkReason = '1. Refused planning permission for the development';
					} else if (typePlanningApplication === 'removal-or-variation-of-conditions') {
						caseworkReason = '2. Refused permission to vary or remove a condition(s)';
					} else if (typePlanningApplication === 'prior-approval') {
						caseworkReason = '3. Refused prior approval of permitted development rights';
					}
				}

				break;
			}

			case '1005': {
				// Full Planning Appeal
				switch (typePlanningApplication) {
					case 'householder-planning': {
						if (decision === 'granted') {
							caseworkReason =
								'4. Granted planning permission for the development subject to conditions to which you object';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					case 'full-appeal': {
						if (decision === 'granted') {
							caseworkReason =
								'4. Granted planning permission for the development subject to conditions to which you object';
						} else if (decision === 'refused') {
							caseworkReason = '1. Refused planning permission for the development';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					case 'outline-planning': {
						if (decision === 'granted') {
							caseworkReason =
								'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
						} else if (decision === 'refused') {
							caseworkReason =
								'5. Refused approval of the matters reserved under an outline planning permission';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					case 'prior-approval': {
						if (decision === 'granted') {
							caseworkReason =
								'4. Granted planning permission for the development subject to conditions to which you object';
						} else if (decision === 'refused') {
							caseworkReason = '3. Refused prior approval of permitted development rights';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					case 'reserved-matters': {
						if (decision === 'granted') {
							caseworkReason =
								'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
						} else if (decision === 'refused') {
							caseworkReason =
								'5. Refused approval of the matters reserved under an outline planning permission';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					case 'removal-or-variation-of-conditions': {
						if (decision === 'granted') {
							caseworkReason =
								'6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
						} else if (decision === 'refused') {
							caseworkReason = '2. Refused permission to vary or remove a condition(s)';
						} else if (decision === 'nodecisionreceived') {
							caseworkReason =
								'8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
						}

						break;
					}

					default: {
						break;
					}
				}

				break;
			}

			default: {
				break;
			}
		}

		context.log({ caseworkReason }, 'Case Work Reason');

		let attributeData;
		let appealType;

		switch (appealTypeID) {
			case '1001': {
				// Householder (HAS) Appeal
				attributeData = [
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

				appealType = 'Householder (HAS) Appeal';

				break;
			}

			case '1005': {
				// Full Planning Appeal
				attributeData = [
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

				appealType = 'Planning Appeal (W)';

				break;
			}

			default: {
				break;
			}
		}

		/* Create the contacts and add to attribute data */
		attributeData.push(...(await createContacts(context.log, appeal)));

		const input = {
			CreateCase: {
				__soap_op: 'http://tempuri.org/IHorizon/CreateCase',
				__xmlns: 'http://tempuri.org/',
				caseType: appealType,
				LPACode: lpa.horizonId,
				dateOfReceipt: new Date(),
				location,
				category: {
					'__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
					'__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
					'a:Attributes': attributeData.map(({ key, value }) =>
						convertToSoapKVPair(context.log, key, value)
					)
				}
			}
		};

		context.log('Horizon input:');
		context.log(input);

		const horizonCaseId = await callHorizon(context.log, input);
		context.log({ horizonId: horizonCaseId }, 'Adding Horizon ID to Appeal');

		await axios.patch(
			`/api/v1/appeals/${appealId}`,
			{
				horizonId: horizonCaseId
			},
			{
				baseURL: config.appealsService.url
			}
		);

		/*
      Finally, publish the documents to Horizon

      We treat these as non-mandatory for add documents, even though
      they are mandatory in the appeal. This is to avoid any unhelpful
      errors at this point
    */
		context.log('Add documents to Horizon');

		let documents = uploadedDocumentMapper(appeal, decision);

		context.log('documents sent to publish function', documents);
		await publishDocuments(context.log, documents, appealId, horizonCaseId);

		context.log('Finish add documents to Horizon');
		context.log({ horizonCaseId }, 'Successful call to Horizon');

		return {
			id: horizonCaseId
		};
	} catch (err) {
		const [message, httpStatus] = catchErrorHandling(context.log, err);
		context.httpStatus = httpStatus;

		return {
			message
		};
	}
};
