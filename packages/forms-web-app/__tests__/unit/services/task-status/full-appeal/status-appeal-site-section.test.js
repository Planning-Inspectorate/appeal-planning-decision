const {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../../src/services/task-status/task-statuses');
const {
  statusAppealSiteSection,
} = require('../../../../../src/services/task-status/full-appeal/status-appeal-site-section');

describe('services/task-status/full-appeal/status-appeal-site-section.js', () => {
  describe('#statusAppealSiteSection', () => {
    it('should return NOT_STARTED if site address page is NOT_STARTED', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {},
          agriculturalHolding: {},
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: NOT_STARTED,
            ownsAllTheLand: NOT_STARTED,
            agriculturalHolding: NOT_STARTED,
            visibleFromRoad: NOT_STARTED,
            healthAndSafety: NOT_STARTED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(NOT_STARTED);
    });
    it('should return IN_PROGRESS if not all sections[siteAddress, ownsAllTheLand, agriculturalHolding, visibleFromRoad, healthAndSafety] COMPLETED', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {},
          agriculturalHolding: {},
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: NOT_STARTED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=true, isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: true,
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=true, isAgriculturalHolding=true', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: true,
          },
          agriculturalHolding: {
            isAgriculturalHolding: true,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            areYouATenant: COMPLETED,
            tellingTheTenants: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=true, isAgriculturalHolding=true, isTenant=true', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: true,
          },
          agriculturalHolding: {
            isAgriculturalHolding: true,
            isTenant: true,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            areYouATenant: COMPLETED,
            otherTenants: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=true, isAgriculturalHolding=true, isTenant=true, hasOtherTenants=true', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: true,
          },
          agriculturalHolding: {
            isAgriculturalHolding: true,
            isTenant: true,
            hasOtherTenants: true,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            areYouATenant: COMPLETED,
            otherTenants: COMPLETED,
            tellingTheTenants: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=false, ownsSomeOfTheLand=true, knowsTheOwners="yes", isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: false,
            ownsSomeOfTheLand: true,
            knowsTheOwners: 'yes',
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            someOfTheLand: COMPLETED,
            knowTheOwners: COMPLETED,
            tellingTheLandowners: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=false, ownsSomeOfTheLand=true, knowsTheOwners="no", isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: false,
            ownsSomeOfTheLand: true,
            knowsTheOwners: 'no',
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            someOfTheLand: COMPLETED,
            knowTheOwners: COMPLETED,
            identifyingTheLandOwners: COMPLETED,
            advertisingYourAppeal: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=false, ownsSomeOfTheLand=true, knowsTheOwners="some", isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: false,
            ownsSomeOfTheLand: true,
            knowsTheOwners: 'some',
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            someOfTheLand: COMPLETED,
            knowTheOwners: COMPLETED,
            tellingTheLandowners: COMPLETED,
            identifyingTheLandOwners: COMPLETED,
            advertisingYourAppeal: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=false, ownsSomeOfTheLand=false, knowsTheOwners="yes", isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: false,
            ownsSomeOfTheLand: false,
            knowsTheOwners: 'yes',
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            someOfTheLand: COMPLETED,
            knowTheOwners: COMPLETED,
            tellingTheLandowners: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for ownsAllTheLand=false, ownsSomeOfTheLand=false, knowsTheOwners="some" or "no", isAgriculturalHolding=false', () => {
      const appeal = {
        appealSiteSection: {
          siteOwnership: {
            ownsAllTheLand: false,
            ownsSomeOfTheLand: false,
            knowsTheOwners: 'some',
          },
          agriculturalHolding: {
            isAgriculturalHolding: false,
            isTenant: false,
          },
        },
        sectionStates: {
          appealSiteSection: {
            siteAddress: COMPLETED,
            ownsAllTheLand: COMPLETED,
            agriculturalHolding: COMPLETED,
            visibleFromRoad: COMPLETED,
            healthAndSafety: COMPLETED,
            someOfTheLand: COMPLETED,
            knowTheOwners: COMPLETED,
            identifyingTheLandOwners: COMPLETED,
            advertisingYourAppeal: COMPLETED,
          },
        },
      };
      expect(statusAppealSiteSection(appeal)).toEqual(COMPLETED);
    });
  });
});
