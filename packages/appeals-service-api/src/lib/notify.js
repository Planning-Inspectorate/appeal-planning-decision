const { NotifyClient } = require('notifications-node-client');
const fetch = require('node-fetch');
const config = require('./config');
const logger = require('./logger');
const { getLpa } = require('../services/lpa.service');

function getAddress(siteAddress) {
  const address = [];
  if (siteAddress.addressLine1) {
    address.push(siteAddress.addressLine1);
  }
  if (siteAddress.addressLine2) {
    address.push(siteAddress.addressLine2);
  }
  if (siteAddress.town) {
    address.push(siteAddress.town);
  }
  if (siteAddress.county) {
    address.push(siteAddress.county);
  }
  if (siteAddress.postcode) {
    address.push(siteAddress.postcode);
  }
  return address.join('\n');
}

function getNotifyClientArguments(baseUrl, serviceId, apiKey) {
  const args = [];
  if (baseUrl) {
    args.push(baseUrl, serviceId);
  }
  args.push(apiKey);
  return args;
}

function getFileUrl(documentsSrvUrl, applicationId, documentId) {
  return `${documentsSrvUrl}/api/v1/${applicationId}/${documentId}/file`;
}

function getOptions(address, link, lpa, name, id) {
  return {
    personalisation: {
      'appeal site address': address,
      'link to appeal submission pdf': link,
      'local planning department': lpa,
      name,
    },
    reference: id,
  };
}

async function sendEmail(appeal) {
  logger.info(`Sending email`);
  logger.debug({ appeal }, 'Appeal being used to send email');
  const { baseUrl, serviceId, apiKey, templateId } = config.services.notify;
  const destinationEmail = appeal.aboutYouSection.yourDetails.email;
  const args = getNotifyClientArguments(baseUrl, serviceId, apiKey);
  const notifyClient = new NotifyClient(...args);
  logger.debug({ notifyClient }, 'notifyClient');
  const applicationId = appeal.id;
  const documentId = appeal.appealSubmission.appealPDFStatement.uploadedFile.id;
  const url = getFileUrl(config.documents.url, applicationId, documentId);
  let pdfFile;
  try {
    const respFile = await fetch(`${url}`);
    const arrayBuffer = await respFile.arrayBuffer();
    pdfFile = Buffer.from(arrayBuffer);
    const lpa = await getLpa(appeal.lpaCode);
    const options = getOptions(
      getAddress(appeal.appealSiteSection.siteAddress),
      notifyClient.prepareUpload(pdfFile),
      lpa.name,
      appeal.aboutYouSection.yourDetails.name,
      appeal.id
    );
    logger.debug({ templateId }, 'templateId');
    logger.debug({ destinationEmail }, 'destinationEmail');
    logger.debug({ options }, 'options');
    await notifyClient.sendEmail(templateId, destinationEmail, options);
  } catch (err) {
    logger.error({ err }, 'Problem sending email');
  }
}

module.exports = {
  sendEmail,
  getAddress,
  getNotifyClientArguments,
  getFileUrl,
  getOptions,
};
