const axios = require('axios');
const config = require('./src/config');
const { handlerReply } = require('./handler-reply');
const { convertToSoapKVPair } = require('./src/convertToSoapKVPair');
const { callHorizon } = require('./src/callHorizon');
const { createContacts } = require('./src/createContacts');
const { getLpaData } = require('./src/getLpaData');
const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');

module.exports = async (context, event) => {
  if (!event.appeal) return handlerReply(context, event);
  context.log('Received householder appeal publish request', event);

  try {
    const { _id: appealId } = event;

    context.log('JSON information');
    context.log(JSON.stringify(event));

    /* Get the LPA associated with this appeal */
    const lpa = await getLpaData(context.log, event.appeal.lpaCode);

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
    const appealTypeID = event.appeal.appealType == null ? '1001' : event.appeal.appealType;

    context.log({ appealTypeID }, 'Appeal Type');

    // Case:Casework Reason logic
    const applicationDecision = event.appeal.eligibility;
    const typePlanningApplication = event.appeal.typeOfPlanningApplication;

    context.log({ applicationDecision }, 'Application Decision');
    context.log({ typePlanningApplication }, 'Planning Application Type');

    let caseworkReason;

    switch (appealTypeID) {
      case '1001': {
        // Householder (HAS) Appeal
        if (applicationDecision === 'refused') {
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
            if (applicationDecision === 'granted') {
              caseworkReason =
                '4. Granted planning permission for the development subject to conditions to which you object';
            } else if (applicationDecision === 'nodecisionreceived') {
              caseworkReason =
                '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
            }

            break;
          }

          case 'full-appeal': {
            if (applicationDecision === 'granted') {
              caseworkReason =
                '4. Granted planning permission for the development subject to conditions to which you object';
            } else if (applicationDecision === 'refused') {
              caseworkReason = '1. Refused planning permission for the development';
            } else if (applicationDecision === 'nodecisionreceived') {
              caseworkReason =
                '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
            }

            break;
          }

          case 'outline-planning': {
            if (applicationDecision === 'granted') {
              caseworkReason =
                '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
            } else if (applicationDecision === 'refused') {
              caseworkReason =
                '5. Refused approval of the matters reserved under an outline planning permission';
            } else if (applicationDecision === 'nodecisionreceived') {
              caseworkReason =
                '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
            }

            break;
          }

          case 'prior-approval': {
            if (applicationDecision === 'granted') {
              caseworkReason =
                '4. Granted planning permission for the development subject to conditions to which you object';
            } else if (applicationDecision === 'refused') {
              caseworkReason = '3. Refused prior approval of permitted development rights';
            } else if (applicationDecision === 'nodecisionreceived') {
              caseworkReason =
                '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
            }

            break;
          }

          case 'reserved-matters': {
            if (applicationDecision === 'granted') {
              caseworkReason =
                '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
            } else if (applicationDecision === 'refused') {
              caseworkReason =
                '5. Refused approval of the matters reserved under an outline planning permission';
            } else if (applicationDecision === 'nodecisionreceived') {
              caseworkReason =
                '8. Failed to give notice of its decision within the appropriate period (usually 8 weeks) on an application for permission or approval';
            }

            break;
          }

          case 'removal-or-variation-of-conditions': {
            if (applicationDecision === 'granted') {
              caseworkReason =
                '6. Granted approval of the matters reserved under an outline planning permission subject to conditions to which you object';
            } else if (applicationDecision === 'refused') {
              caseworkReason = '2. Refused permission to vary or remove a condition(s)';
            } else if (applicationDecision === 'nodecisionreceived') {
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
            value: caseworkReason,
          },
          {
            key: 'Case Dates:Receipt Date',
            // This is the last time the record was updated
            value: new Date(event.appeal.updatedAt),
          },
          {
            key: 'Case:Source Indicator',
            value: 'Other',
          },
          {
            key: 'Case:Case Publish Flag',
            value: false,
          },
          {
            key: 'Planning Application:Date Of LPA Decision',
            value: new Date(event.appeal.decisionDate),
          },
          {
            key: 'Case:Procedure (Appellant)',
            value: 'Written Representations',
          },
          {
            key: 'Planning Application:LPA Application Reference',
            value: event.appeal.requiredDocumentsSection.applicationNumber,
          },
          {
            key: 'Case Site:Site Address Line 1',
            value: event.appeal.appealSiteSection.siteAddress.addressLine1,
          },
          {
            key: 'Case Site:Site Address Line 2',
            value: event.appeal.appealSiteSection.siteAddress.addressLine2,
          },
          {
            key: 'Case Site:Site Address Town',
            value: event.appeal.appealSiteSection.siteAddress.town,
          },
          {
            key: 'Case Site:Site Address County',
            value: event.appeal.appealSiteSection.siteAddress.county,
          },
          {
            key: 'Case Site:Site Address Postcode',
            value: event.appeal.appealSiteSection.siteAddress.postcode,
          },
          {
            key: 'Case Site:Ownership Certificate',
            value: event.appeal.appealSiteSection.siteOwnership.ownsWholeSite
              ? 'Certificate A'
              : null,
          },
          {
            key: 'Case Site:Site Viewable From Road',
            value: event.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
          },
          {
            key: 'Case Site:Inspector Need To Enter Site',
            value: !event.appeal.appealSiteSection.siteAccess
              .canInspectorSeeWholeSiteFromPublicRoad,
          },
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
            value: new Date(event.appeal.updatedAt),
          },
          {
            key: 'Case:Source Indicator',
            value: 'Other',
          },
          {
            key: 'Case:Case Publish Flag',
            value: false,
          },
          {
            key: 'Planning Application:Date Of LPA Decision',
            value: new Date(event.appeal.decisionDate),
          },
          {
            key: 'Case:Procedure (Appellant)',
            value: event.appeal.appealDecisionSection.procedureType,
          },
          {
            key: 'Planning Application:LPA Application Reference',
            value: event.appeal.planningApplicationDocumentsSection.applicationNumber,
          },
          {
            key: 'Case Site:Site Address Line 1',
            value: event.appeal.appealSiteSection.siteAddress.addressLine1,
          },
          {
            key: 'Case Site:Site Address Line 2',
            value: event.appeal.appealSiteSection.siteAddress.addressLine2,
          },
          {
            key: 'Case Site:Site Address Town',
            value: event.appeal.appealSiteSection.siteAddress.town,
          },
          {
            key: 'Case Site:Site Address County',
            value: event.appeal.appealSiteSection.siteAddress.county,
          },
          {
            key: 'Case Site:Site Address Postcode',
            value: event.appeal.appealSiteSection.siteAddress.postcode,
          },
          {
            key: 'Case Site:Ownership Certificate',
            value: event.appeal.appealSiteSection.siteOwnership.ownsAllTheLand
              ? 'Certificate A'
              : null,
          },
          {
            key: 'Case Site:Site Viewable From Road',
            value: event.appeal.appealSiteSection.visibleFromRoad.isVisible,
          },
          // {
          //   key: 'Case Site:Inspector Need To Enter Site',
          //   value: !event.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
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
    attributeData.push(...(await createContacts(context.log, event)));

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
          ),
        },
      },
    };

    context.log('Horizon input:');
    context.log(input);

    const horizonCaseId = await callHorizon(context.log, input);
    context.log({ horizonId: horizonCaseId }, 'Adding Horizon ID to Appeal');

    await axios.patch(
      `/api/v1/appeals-horizon/${appealId}`,
      {
        horizonId: horizonCaseId,
      },
      {
        baseURL: config.appealsService.url,
      }
    );

    /*
      Finally, publish the documents to Horizon

      We treat these as non-mandatory for add documents, even though
      they are mandatory in the appeal. This is to avoid any unhelpful
      errors at this point
    */
    context.log('Add documents to Horizon');

    switch (appealTypeID) {
      case '1001': {
        // Householder (HAS) Appeal
        const documents = [
          {
            id: event?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
            type: 'Appellant Grounds of Appeal',
          },
          {
            id: event?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
            type: 'Appellant Initial Documents',
          },
          {
            id: event?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
            type: 'LPA Decision Notice',
          },
          {
            id: event?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
            type: 'Appellant Initial Documents',
          },
        ];

        /* Add optional docs to the list */
        const optionalFiles = event?.appeal?.yourAppealSection?.otherDocuments?.uploadedFiles;
        if (Array.isArray(optionalFiles)) {
          documents.push(
            ...optionalFiles.map(({ id }) => ({
              id,
              type: 'Appellant Grounds of Appeal',
            }))
          );
        }

        await publishDocuments(context.log, documents, appealId, horizonCaseId);

        break;
      }

      case '1005': {
        // Full Planning Appeal
        const documents = [
          // Appeal Statement - Mandatory
          {
            id: event?.appeal?.appealDocumentsSection?.appealStatement?.uploadedFile?.id,
            type: 'Appellant Statement and Appendices',
          },
          // Planning Application Form - Mandatory
          {
            id:
              event?.appeal?.planningApplicationDocumentsSection?.originalApplication?.uploadedFile
                ?.id,
            type: 'Application Form',
          },
        ];

        // Decision Letter - Optional
        if (applicationDecision === 'granted' || applicationDecision === 'refused') {
          if (
            event?.appeal?.planningApplicationDocumentsSection?.decisionLetter?.uploadedFile?.id !==
            null
          ) {
            documents.push({
              id:
                event?.appeal?.planningApplicationDocumentsSection?.decisionLetter?.uploadedFile
                  ?.id,
              type: 'LPA Decision Notice',
            });
          }
        }

        // Submission information file PDF - Mandatory
        if (event?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id !== null) {
          documents.push({
            id: event?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
            type: 'Appellant Initial Documents',
          });
        }

        // Design and Access Statement - Optional
        if (
          event?.appeal?.planningApplicationDocumentsSection?.designAccessStatement?.isSubmitted ===
          'true'
        ) {
          if (
            event?.appeal?.planningApplicationDocumentsSection?.designAccessStatement?.uploadedFile
              .id !== null
          ) {
            documents.push({
              id:
                event?.appeal?.planningApplicationDocumentsSection?.designAccessStatement
                  ?.uploadedFile?.id,
              type: 'Appellant Initial Documents',
            });
          }
        }

        // Statement of Common Ground - Optional
        const { procedureType } = event.appeal.appealDecisionSection;

        if (procedureType === 'Hearing' || procedureType === 'Inquiry') {
          if (
            event?.appeal?.planningApplicationDocumentsSection?.draftStatementOfCommonGround
              ?.uploadedFile?.id !== null
          ) {
            documents.push({
              id:
                event?.appeal?.planningApplicationDocumentsSection?.draftStatementOfCommonGround
                  ?.uploadedFile?.id,
              type: 'Statement of Common Ground',
            });
          }
        }

        // Add multiple Old Plans & Drawings documents to the list - Mandatory
        const oldPlansDrawingsFiles =
          event?.appeal?.planningApplicationDocumentsSection?.plansDrawingsSupportingDocuments
            ?.uploadedFiles;
        if (Array.isArray(oldPlansDrawingsFiles)) {
          documents.push(
            ...oldPlansDrawingsFiles.map(({ id }) => ({
              id,
              type: 'Appellant Initial Documents',
            }))
          );
        }

        // Add multiple New Plans & Drawings documents to the list - Optional
        if (event?.appeal?.appealDocumentsSection?.plansDrawings?.hasPlanDrawings === 'true') {
          const newPlansDrawingsFiles =
            event?.appeal?.appealDocumentsSection?.plansDrawings?.uploadedFiles;

          if (Array.isArray(newPlansDrawingsFiles)) {
            documents.push(
              ...newPlansDrawingsFiles.map(({ id }) => ({
                id,
                type: 'Appellant Initial Documents',
              }))
            );
          }
        }

        // Add supporting documents to the list - Optional
        if (
          event?.appeal?.appealDocumentsSection?.supportingDocuments?.hasSupportingDocuments ===
          'true'
        ) {
          const supportingFiles =
            event?.appeal?.appealDocumentsSection?.supportingDocuments?.uploadedFiles;
          if (Array.isArray(supportingFiles)) {
            documents.push(
              ...supportingFiles.map(({ id }) => ({
                id,
                type: 'Appellant Initial Documents',
              }))
            );
          }
        }

        await publishDocuments(context.log, documents, appealId, horizonCaseId);

        break;
      }

      default: {
        break;
      }
    }
    context.log('Finish add documents to Horizon');

    context.log({ horizonCaseId }, 'Successful call to Horizon');

    return {
      id: horizonCaseId,
    };
  } catch (err) {
    const [message, httpStatus] = catchErrorHandling(context.log, err);
    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
