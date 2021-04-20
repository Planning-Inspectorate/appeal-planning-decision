const logger = require('./logger')

const formatAddress = (address) => {
  const addressFields = Object.values(address).filter((value) => !!value);
  return addressFields.join(', ');
};

module.exports = (appeal) => {
  logger.debug(`appeal-sidebar-details :: appeal= ${JSON.stringify(appeal)}`)
  if (!appeal) return null;

  return {
    number: appeal.requiredDocumentsSection && appeal.requiredDocumentsSection.applicationNumber,
    address: appeal.appealSiteSection && formatAddress(appeal.appealSiteSection.siteAddress),
    appellant:
      appeal.aboutYouSection &&
      appeal.aboutYouSection.yourDetails &&
      appeal.aboutYouSection.yourDetails.name,
  };
};
