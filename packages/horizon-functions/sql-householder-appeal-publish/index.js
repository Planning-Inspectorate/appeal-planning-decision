// const axios = require('axios');
// const config = require('./src/config');
// const { handlerReply } = require('./handler-reply');
// const { convertToSoapKVPair } = require('./src/convertToSoapKVPair');
// const { callHorizon } = require('./src/callHorizon');
// const { createContacts } = require('./src/createContacts');
const { getLpaData } = require('./src/getLpaData');
// const { publishDocuments } = require('./src/publishDocuments');
const { catchErrorHandling } = require('./src/catchErrorHandling');

module.exports = async (context, event) => {
  // if (!event.appeal) return handlerReply(context, event);
  context.log('Received householder appeal publish request', event);

  try {
    // const { _id: appealId } = event;

    /* Get the LPA associated with this appeal */
    const lpa = await getLpaData(context.log, event.appeal.lpaCode);

    context.log({ lpa }, 'LPA detail');

    // let location;
    /* PINS only supports England and Wales */
    // if (lpa.england) {
    //   location = 'England';
    // } else if (lpa.wales) {
    //   location = 'Wales';
    // } else {
    //   throw new Error('LPA neither English nor Welsh');
    // }

    // const attributeData = [
    //   {
    //     key: 'Case Dates:Receipt Date',
    //     // This is the last time the record was updated
    //     value: new Date(event.appeal.updatedAt),
    //   },
    //   {
    //     key: 'Case:Source Indicator',
    //     value: 'Other',
    //   },
    //   {
    //     key: 'Case:Case Publish Flag',
    //     value: false,
    //   },
    //   {
    //     key: 'Planning Application:Date Of LPA Decision',
    //     value: new Date(event.appeal.decisionDate),
    //   },
    //   {
    //     key: 'Case:Procedure (Appellant)',
    //     value: 'Written Representations',
    //   },
    //   {
    //     key: 'Planning Application:LPA Application Reference',
    //     value: event.appeal.requiredDocumentsSection.applicationNumber,
    //   },
    //   {
    //     key: 'Case Site:Site Address Line 1',
    //     value: event.appeal.appealSiteSection.siteAddress.addressLine1,
    //   },
    //   {
    //     key: 'Case Site:Site Address Line 2',
    //     value: event.appeal.appealSiteSection.siteAddress.addressLine2,
    //   },
    //   {
    //     key: 'Case Site:Site Address Town',
    //     value: event.appeal.appealSiteSection.siteAddress.town,
    //   },
    //   {
    //     key: 'Case Site:Site Address County',
    //     value: event.appeal.appealSiteSection.siteAddress.county,
    //   },
    //   {
    //     key: 'Case Site:Site Address Postcode',
    //     value: event.appeal.appealSiteSection.siteAddress.postcode,
    //   },
    //   {
    //     key: 'Case Site:Ownership Certificate',
    //     value: event.appeal.appealSiteSection.siteOwnership.ownsWholeSite ? 'Certificate A' : null,
    //   },
    //   {
    //     key: 'Case Site:Site Viewable From Road',
    //     value: event.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
    //   },
    //   {
    //     key: 'Case Site:Inspector Need To Enter Site',
    //     value: !event.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
    //   },
    // ];
    //
    // /* Create the contacts and add to attribute data */
    // attributeData.push(...(await createContacts(context.log, event)));

    // const input = {
    //   CreateCase: {
    //     __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
    //     __xmlns: 'http://tempuri.org/',
    //     caseType: 'Householder (HAS) Appeal',
    //     LPACode: lpa.horizonId,
    //     dateOfReceipt: new Date(),
    //     location,
    //     category: {
    //       '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
    //       '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
    //       'a:Attributes': attributeData.map(({ key, value }) =>
    //         convertToSoapKVPair(context.log, key, value)
    //       ),
    //     },
    //   },
    // };
    //
    // const horizonCaseId = await callHorizon(context.log, input);
    // context.log({ horizonId: horizonCaseId }, 'Adding Horizon ID to Appeal');
    //
    // await axios.patch(
    //   `/api/v1/appeals/${appealId}`,
    //   {
    //     horizonId: horizonCaseId,
    //   },
    //   {
    //     baseURL: config.appealsService.url,
    //   }
    // );

    /*
      Finally, publish the documents to Horizon

      We treat these as non-mandatory for add documents, even though
      they are mandatory in the appeal. This is to avoid any unhelpful
      errors at this point
    */
    // const documents = [
    //   {
    //     id: event?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
    //     type: 'Appellant Grounds of Appeal',
    //   },
    //   {
    //     id: event?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
    //     type: 'Appellant Initial Documents',
    //   },
    //   {
    //     id: event?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
    //     type: 'LPA Decision Notice',
    //   },
    //   {
    //     id: event?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
    //     type: 'Appellant Initial Documents',
    //   },
    // ];

    /* Add optional docs to the list */
    // const optionalFiles = event?.appeal?.yourAppealSection?.otherDocuments?.uploadedFiles;
    // if (Array.isArray(optionalFiles)) {
    //   documents.push(
    //     ...optionalFiles.map(({ id }) => ({
    //       id,
    //       type: 'Appellant Grounds of Appeal',
    //     }))
    //   );
    // }

    // await publishDocuments(context.log, documents, appealId, horizonCaseId);
    // context.log({ horizonCaseId }, 'Successful call to Horizon');

    return {
      id: 1234567,
    };
  } catch (err) {
    const [message, httpStatus] = catchErrorHandling(context.log, err);
    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
