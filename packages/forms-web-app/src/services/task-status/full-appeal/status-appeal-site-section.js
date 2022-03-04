const { KNOW_THE_OWNERS } = require('@pins/business-rules/src/constants');
const { getStatusOfPath, SectionPath } = require('../task-statuses');

const statusAppealSiteSection = (appeal) => {
  const {
    siteOwnership: { ownsAllTheLand, knowsTheOwners, ownsSomeOfTheLand },
    agriculturalHolding: { isAgriculturalHolding, isTenant },
  } = appeal.appealSiteSection;
  const section = appeal.sectionStates.appealSiteSection;

  const sectionPath = new SectionPath(section)
    .add('siteAddress')
    .add('ownsAllTheLand')
    .add('agriculturalHolding')
    .add('visibleFromRoad')
    .add('healthAndSafety');

  if (!ownsAllTheLand) {
    sectionPath.add('someOfTheLand').add('knowTheOwners');
    if (ownsSomeOfTheLand) {
      if (knowsTheOwners === KNOW_THE_OWNERS.YES) {
        sectionPath.add('tellingTheLandowners');
      } else {
        sectionPath.add('identifyingTheLandOwners').add('advertisingYourAppeal');
        if (knowsTheOwners === KNOW_THE_OWNERS.SOME) {
          sectionPath.add('tellingTheLandowners');
        }
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (knowsTheOwners === KNOW_THE_OWNERS.YES) {
        sectionPath.add('tellingTheLandowners');
      } else {
        sectionPath.add('identifyingTheLandOwners').add('advertisingYourAppeal');
      }
    }
  }

  if (isAgriculturalHolding) {
    sectionPath.add('areYouATenant').add('tellingTheTenants');
    if (isTenant) {
      sectionPath.add('otherTenants');
    }
  }
  return getStatusOfPath(sectionPath.getPath());
};

module.exports = {
  statusAppealSiteSection,
};
